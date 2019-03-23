<?php

namespace App\Http\Controllers\userController;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use JWTAuth;
use PayPal\Api\Amount;
use PayPal\Api\Details;
use PayPal\Api\Item;
use PayPal\Api\ItemList;
use PayPal\Api\Payer;
use PayPal\Api\Payment;
use PayPal\Api\PaymentExecution;
use PayPal\Api\RedirectUrls;
use PayPal\Api\Transaction;

class usercontroller extends Controller
{
    protected $model;
    protected $request;

    public function __construct(User $model, Request $request)
    {
        $this->request = $request;
        $this->model = $model;
    }
    public function login()
    {
        $this->validate($this->request, $this->model->login_rules());
        try {
            if (!$token = JWTAuth::attempt(['email' => $this->request->email, 'role_id' => 4, 'password' => $this->request->password])) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        return response()->json(compact('token'));
    }

    public function register()
    {
        $this->validate($this->request, $this->model->register_rules());
        $user = new $this->model;
        $user->name = $this->request->name;
        $user->phone = $this->request->phone;
        $user->address = $this->request->address;
        $user->email = $this->request->email;
        $user->password = bcrypt($this->request->password);
        $user->role_id = 4;
        $user->image = 'user.png';
        if ($user->save()) {
            $token = JWTAuth::fromUser($user);
            return response()->json(compact('token'), 200);
        }
        return response()->json('failed', 500);
    }

    public function checkUser()
    {
        $user = $this->model->getUser();
        if ($user->role_id == 4) {
            $user['image'] = '/uploads/' . $user->image;
            return response()->json($user);
        }
        return response()->json('not authorized', 401);
    }
    public function logout()
    {
        if (JWTAuth::invalidate(JWTAuth::getToken())) {
            return response()->json('logged out', 200);
        } else {
            return response()->json('something went wrong', 500);
        }
    }

    public function editProfile()
    {
        $user = $this->model->getUser();
        $this->validate($this->request, $this->model->edit_profile_rules($user->id));
        $user->name = $this->request->name;
        $user->address = $this->request->address;
        $user->phone = $this->request->phone;
        $user->email = $this->request->email;
        if ($this->request->has('image')) {
            $this->validate($this->request, $this->model->validate_image());
            $file = $this->request->image;
            $imageName = uniqid() . '.' . $file->getClientOriginalExtension();
            if ($file->move('./uploads/', $imageName)) {
                if ($user->image != 'user.png') {
                    unlink('./uploads/' . $user->image);
                }
                $user->image = $imageName;
            }
        }
        if ($user->save()) {
            return response()->json(compact('user'), 200);
        }
        return response()->json('something went wrong', 500);
    }

    public function editPassword()
    {
        $this->validate($this->request, $this->model->edit_password_rules());
        $user = $this->model->getUser();
        if (!Hash::check($this->request->oldPassword, $user->password)) {
            return response()->json('wrong old password', 401);
        }
        $user->password = bcrypt($this->request->newPassword);
        if ($user->save()) {
            return response()->json(compact('user'), 200);
        }
        return response()->json('something went wrong', 500);
    }

    public function createPayment()
    {
        $apiContext = new \PayPal\Rest\ApiContext(
            new \PayPal\Auth\OAuthTokenCredential(
                'AapTlPeSaQqb9qvXLm8QKxsUX9SlaQeDhnsqWqapyBl90IxOB66iqZv5ry0D8Pgi76g5vDldy-w-EzAE', // ClientID
                'EAG7keJX7HvG8-adrQSZn1oIMZsGSkqMdhR4IQ5bzyZ4NmV2bxFMaTlBR2xb3PiL0BUFAc9Ayrdbc6dX' // ClientSecret
            )
        );

        $payer = new Payer();
        $payer->setPaymentMethod("paypal");

        $item1 = new Item();
        $item1->setName('Ground Coffee 40 oz')
            ->setCurrency('USD')
            ->setQuantity(1)
            ->setSku("123123") // Similar to `item_number` in Classic API
            ->setPrice(7);
        $item2 = new Item();
        $item2->setName('Granola bars')
            ->setCurrency('USD')
            ->setQuantity(5)
            ->setSku("321321") // Similar to `item_number` in Classic API
            ->setPrice(2);

        $itemList = new ItemList();
        $itemList->setItems(array($item1, $item2));

        $details = new Details();
        $details->setSubtotal(17);

        $amount = new Amount();
        $amount->setCurrency("USD")
            ->setTotal(17)
            ->setDetails($details);

        $transaction = new Transaction();
        $transaction->setAmount($amount)
            ->setItemList($itemList)
            ->setDescription("Payment description")
            ->setInvoiceNumber(uniqid());

        $redirectUrls = new RedirectUrls();
        $redirectUrls->setReturnUrl("http://localhost:8000/payment/execute")
            ->setCancelUrl("http://localhost:8000/payment/cancel");

        $payment = new Payment();
        $payment->setIntent("sale")
            ->setPayer($payer)
            ->setRedirectUrls($redirectUrls)
            ->setTransactions(array($transaction));

        $payment->create($apiContext);

        return redirect($payment->getApprovalLink());
    }

    public function executePayment()
    {
        try {
            $apiContext = new \PayPal\Rest\ApiContext(
                new \PayPal\Auth\OAuthTokenCredential(
                    'AapTlPeSaQqb9qvXLm8QKxsUX9SlaQeDhnsqWqapyBl90IxOB66iqZv5ry0D8Pgi76g5vDldy-w-EzAE', // ClientID
                    'EAG7keJX7HvG8-adrQSZn1oIMZsGSkqMdhR4IQ5bzyZ4NmV2bxFMaTlBR2xb3PiL0BUFAc9Ayrdbc6dX' // ClientSecret
                )
            );

            $paymentId = $this->request->paymentId;
            $payment = Payment::get($paymentId, $apiContext);

            $execution = new PaymentExecution();
            $execution->setPayerId($this->request->PayerID);

            $transaction = new Transaction();
            $amount = new Amount();
            $details = new Details();

            $details->setSubtotal(17);

            $amount->setCurrency('USD');
            $amount->setTotal(17);
            $amount->setDetails($details);
            $transaction->setAmount($amount);
            $execution->addTransaction($transaction);
            $result = $payment->execute($execution, $apiContext);
        } catch (\Exception $ex) {
            // echo $ex->getCode(); // Prints the Error Code
            // echo $ex->getData(); // Prints the detailed error message
            dd($ex);
        } catch (Exception $ex) {
            die($ex);
        }

        return $result;
    }

    public function cancelPayment()
    {
        return 'payment cancelled';
    }
}
