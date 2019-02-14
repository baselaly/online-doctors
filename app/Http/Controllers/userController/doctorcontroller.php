<?php

namespace App\Http\Controllers\userController;

use App\Appointment;
use App\Category;
use App\Feedback;
use App\Http\Controllers\Controller;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class doctorcontroller extends Controller
{
    protected $model;
    protected $request;
    protected $category_model;
    protected $appointment_model;
    protected $feedback_model;

    public function __construct(User $model, Request $request, Category $category_model, Appointment $appointment_model, Feedback $feedback_model)
    {
        $this->request = $request;
        $this->model = $model;
        $this->category_model = $category_model;
        $this->appointment_model = $appointment_model;
        $this->feedback_model = $feedback_model;
    }

    public function getDoctors()
    {
        $doctors = $this->model->where('role_id', 2)->paginate(9);
        foreach ($doctors->items() as $doctor) {
            $doctor['rate'] = $doctor->getRate();
            $doctor->category;
            $doctor['appointments_count'] = $doctor->doctor_appointments()->count();
            $doctor['image'] = '/uploads/' . $doctor->image;
        }
        return response()->json(compact('doctors'), 200);
    }

    public function search($category_id = null, $name = null)
    {
        $doctors = $this->model->newQuery()->where('role_id', 2);
        if ($name) {
            $name = urlencode($name);
            $doctors->where('name', 'LIKE', '%' . $name . '%');
        }
        if ($category_id) {
            $doctors->where('category_id', $category_id);
        }
        $doctors = $doctors->paginate(9);
        foreach ($doctors->items() as $doctor) {
            $doctor->category;
            $doctor['rate'] = $doctor->getRate();
            $doctor['appointments_count'] = $doctor->doctor_appointments()->count();
            $doctor['image'] = '/uploads/' . $doctor->image;
            $doctor['feedback'] = $doctor->DoctorFeedback();
        }
        return response()->json(compact('doctors'), 200);
    }

    public function getCategoryDoctors($category_id)
    {
        $category = $this->category_model->findOrFail($category_id);
        $doctors = $this->model->where([
            'category_id' => $category->id,
            'role_id' => 2,
        ])->paginate(18);
        foreach ($doctors->items() as $doctor) {
            $doctor->category;
            $doctor['appointments_count'] = $doctor->doctor_appointments()->count();
            $doctor['image'] = '/uploads/' . $doctor->image;
            $doctor['rate'] = $doctor->getRate();
            $doctor['feedback'] = $doctor->DoctorFeedback();
        }
        return response()->json(compact('doctors'), 200);
    }

    public function getDoctor($doctor_id)
    {
        $doctor = $this->model->getDoctorById($doctor_id);
        if (!$doctor) {
            return response()->json('not found', 404);
        }
        $doctor['feedbacks'] = $doctor->doctor_feedbacks()->paginate(5);
        foreach ($doctor->feedbacks->items() as $feedback) {
            $feedback->patient;
            $feedback->patient['image'] = '/uploads/' . $feedback->patient->image;
            $feedback['time'] = Carbon::parse($feedback->created_at)->format('l, d-F-Y g:i A');
        }
        $doctor['image'] = '/uploads/' . $doctor->image;
        $doctor['rate'] = $doctor->getRate();
        $doctor['appointments_count'] = $doctor->doctor_appointments()->count();
        $doctor->category;
        return response()->json(compact('doctor'));
    }

    public function rateDoctor()
    {
        $this->validate($this->request, $this->model->rate_validate());

        $appointment = $this->appointment_model->findOrFail($this->request->appointment_id);

        if ($appointment->rate) {
            return response()->json('this appointment is already rated', 500);
        }

        $appointment->rate = $this->request->rate;

        if (isset($this->request->feedback) && !$appointment->feedback()) {
            $this->validate($this->request, $this->model->validate_rate_feedback());
            $feedback = new $this->feedback_model;
            $feedback->feedback = $this->request->feedback;
            $feedback->patient_id = $appointment->patient_id;
            $feedback->doctor_id = $appointment->doctor_id;
            $feedback->appointment_id = $appointment->id;
            if (!$feedback->save()) {
                return response()->json('something went wrong', 500);
            }
        }
        if ($appointment->save()) {
            return response()->json('process success', 200);
        }
        return response()->json('something went wrong', 500);

    }
}
