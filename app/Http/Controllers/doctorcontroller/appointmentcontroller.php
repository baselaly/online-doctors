<?php

namespace App\Http\Controllers\doctorcontroller;

use App\Appointment;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;

class appointmentcontroller extends Controller
{
    protected $model;
    protected $request;
    protected $user_model;

    public function __construct(Appointment $model, User $user_model, Request $request)
    {
        $this->request = $request;
        $this->model = $model;
        $this->user_model = $user_model;
    }

    public function getUpcoming()
    {
        $doctor = $this->user_model->getUser();
        $live_appointments = $doctor->DoctorLiveAppointments();
        return response()->json(compact('live_appointments'));
    }

    public function getFinished()
    {
        $doctor = $this->user_model->getUser();
        $finished_appointments = $doctor->DoctorFinishedAppointments();
        return response()->json(compact('finished_appointments'));
    }

    public function getToday()
    {
        $doctor = $this->user_model->getUser();
        $today_appointments = $doctor->DoctorTodayAppointments();
        return response()->json(compact('today_appointments'));
    }

    public function finishAppointment($id)
    {
        $doctor = $this->user_model->getUser();
        $appointment = $this->model->where([
            'id' => $id,
            'doctor_id' => $doctor->id,
        ])->firstOrFail();
        if ($appointment->changeStatus()) {
            return response()->json(['message' => 'appointment finished successfully'], 200);
        }
        return response()->json(['message' => 'something went wrong'], 500);
    }

    public function getFeedback($id)
    {
        $appointment = $this->model->findOrFail($id);
        $feedback = $appointment->feedback();
        return response()->json(compact('feedback'), 200);
    }

    public function cancel($id)
    {
        $appointment = $this->model->findOrFail($id);
        $doctor = $this->user_model->getUser();
        if ($appointment->canCancelled() && $appointment->doctor_id == $doctor->id) {
            $appointment->delete();
            return response()->json('this appointment has been cancelled', 200);
        }
        return response()->json('this appointment cant cancelled', 500);
    }

}
