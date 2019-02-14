<?php

namespace App\Http\Controllers\doctorcontroller;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use JWTAuth;

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
            if (!$token = JWTAuth::attempt(['email' => $this->request->email, 'role_id' => 2, 'password' => $this->request->password])) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        return response()->json(compact('token'), 200);
    }

    public function checkUser()
    {
        $user = $this->model->getUser();
        if ($user->role_id == 2) {
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

    public function getPatient($id)
    {
        $patient = $this->model->getPatient($id);
        return response()->json(compact('patient'), 200);
    }
}
