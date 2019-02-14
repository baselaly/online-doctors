<?php

namespace App\Http\Controllers\adminController;

use App\Appointment;
use App\Category;
use App\Feedback;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use JWTAuth;
use JWTException;

class usercontroller extends Controller
{
    protected $model;
    protected $request;
    protected $feedback_model;
    protected $category_model;
    protected $appointment_model;

    public function __construct(User $model, Request $request, Appointment $appointment_model, Category $category_model, Feedback $feedback_model)
    {
        $this->request = $request;
        $this->model = $model;
        $this->feedback_model = $feedback_model;
        $this->category_model = $category_model;
        $this->appointment_model = $appointment_model;
    }

    public function login()
    {
        $this->validate($this->request, $this->model->login_rules());
        try {
            if (!$token = JWTAuth::attempt(['email' => $this->request->email, 'role_id' => 1, 'password' => $this->request->password])) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }
        return response()->json(compact('token'));
    }

    public function logout()
    {
        if (JWTAuth::invalidate(JWTAuth::getToken())) {
            return response()->json('logged out', 200);
        } else {
            return response()->json('something went wrong', 500);
        }
    }

    public function addUser()
    {
        $this->validate($this->request, $this->model->add_rules());
        $user = new $this->model;
        $user->name = $this->request->name;
        $user->phone = $this->request->phone;
        $user->address = $this->request->address;
        $user->email = $this->request->email;
        $user->password = bcrypt($this->request->password);
        $user->role_id = $this->request->role_id;
        if ($this->request->has('category_id') && $this->request->role_id == 2) {
            $user->category_id = $this->request->category_id;
        }
        if ($this->request->has('fees') && $this->request->role_id == 2) {
            $user->fees = $this->request->fees;
        }
        if ($this->request->has('image')) {
            $this->validate($this->request, $this->model->validate_image());
            $file = $this->request->image;
            $imageName = uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move('./uploads/', $imageName);
            $user->image = $imageName;
        } else {
            $user->image = 'user.png';
        }
        $DONE = $user->save();
        if (!$DONE) {
            return response()->json('failed', 500);
        }
        return response()->json('user added', 200);
    }

    public function editUser($id)
    {
        $this->validate($this->request, $this->model->edit_rules($id));
        $user = $this->model->findOrFail($id);
        $user->name = $this->request->name;
        $user->phone = $this->request->phone;
        $user->address = $this->request->address;
        $user->email = $this->request->email;
        if ($this->request->has('password') && strlen($this->request->password) >= 6) {
            $user->password = bcrypt($this->request->password);
        }
        if ($this->request->has('fees') && $this->request->role_id == 2) {
            $user->fees = $this->request->fees;
        } else {
            $user->fees = null;
        }
        if ($this->request->has('category_id') && $this->request->role_id == 2) {
            $user->category_id = $this->request->category_id;
        } else {
            $user->category_id = null;
        }
        $user->role_id = $this->request->role_id;
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
        $DONE = $user->save();
        if (!$DONE) {
            return response()->json('failed', 500);
        }
        return response()->json('user edited', 200);
    }

    public function deleteUser($id)
    {
        $user = $this->model->findOrFail($id);
        $user->doctor_appointments()->delete();
        $user->patient_appointments()->delete();
        $user->doctor_feedbacks()->delete();
        $user->patient_feedbacks()->delete();
        if ($user->image != 'user.png') {
            unlink('./uploads/' . $user->image);
        }
        $DONE = $user->delete();
        if (!$DONE) {
            return response()->json('failed', 500);
        }
        return response()->json('deleted', 200);
    }

    public function getAll()
    {
        $users = $this->model->paginate(10);
        if (!$users) {
            return response()->json('no users found', 404);
        }
        foreach ($users as $user) {
            $user['role'] = $user->role;
        }
        return response()->json(compact('users'), 200);
    }

    public function getById($id)
    {
        $user = $this->model->findOrFail($id);
        if ($user->category_id && $user->role_id == 2) {
            $user['category'] = $user->category;
            $user['rate'] = $user->getRate();
        }
        $user['role'] = $user->role;
        return response()->json(compact('user'), 200);
    }

    public function checkAdmin()
    {
        $user = $this->model->getUser();
        if ($user->role_id == 1) {
            return response()->json($user);
        }
        return response()->json('not authorized', 401);
    }

    public function getStatistics()
    {
        $doctors_count = $this->model->where('role_id', 2)->count();
        $admins_count = $this->model->where('role_id', 1)->count();
        $users_count = $this->model->where('role_id', 4)->count();
        $appointments_count = Appointment::count();
        $feedbacks_count = Feedback::count();
        $categories_count = Category::count();

        return response()->json(compact('users_count', 'doctors_count', 'admins_count', 'appointments_count', 'feedbacks_count', 'categories_count'));
    }

    public function get_doctors_patients()
    {
        $doctors = $this->model->where('role_id', 2)->get();
        $patients = $this->model->where('role_id', 4)->get();
        return response()->json(compact('doctors', 'patients'));
    }

}
