<?php

namespace App\Http\Controllers\userController;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
}
