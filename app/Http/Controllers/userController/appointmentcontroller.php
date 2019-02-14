<?php

namespace App\Http\Controllers\userController;

use App\Appointment;
use App\Http\Controllers\Controller;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class appointmentcontroller extends Controller
{
    protected $model;
    protected $request;
    protected $user_model;

    public function __construct(Appointment $model, Request $request, User $user_model)
    {
        $this->request = $request;
        $this->model = $model;
        $this->user_model = $user_model;
    }

    public function checkAvailableDates($id = null)
    {
        $this->validate($this->request, $this->model->checkAppointmentDateRule());

        $doctor = $this->user_model->where([
            'id' => $this->request->doctor_id,
            'role_id' => 2,
        ])->first();
        if ($doctor) {
            if ($id) {
                $doctor_appointments = $this->model->where([
                    'doctor_id' => $this->request->doctor_id,
                ])->where('id', '!=', $id)->get();
            } else {
                $doctor_appointments = $this->model->where([
                    'doctor_id' => $this->request->doctor_id,
                ])->get();
            }
            $dates = array();
            $unavailable_dates = array();
            foreach ($doctor_appointments as $appointment) {
                array_push($dates, $appointment->appointment_date);
            }
            foreach (array_count_values($dates) as $day => $times) {
                if ($times >= 24) {
                    $unavailable_dates[] = $day;
                }
            }
            return response()->json(compact('unavailable_dates'), 200);
        }
        return response()->json('no doctor selected', 500);
    }

    public function checkAvailableHours($id = null)
    {
        $this->validate($this->request, $this->model->checkAppointmentHourRule());
        $doctor = $this->user_model->where([
            'id' => $this->request->doctor_id,
            'role_id' => 2,
        ])->first();
        if ($doctor) {
            if ($id) {
                $doctor_appointments = $this->model->where([
                    'doctor_id' => $this->request->doctor_id,
                    'appointment_date' => $this->request->date,
                ])->where('id', '!=', $id)->get();
            } else {
                $doctor_appointments = $this->model->where([
                    'doctor_id' => $this->request->doctor_id,
                    'appointment_date' => $this->request->date,
                ])->get();
            }
            $hours = [];
            foreach ($doctor_appointments as $appointment) {
                array_push($hours, $appointment->appointment_hour);
            }
            $unavailable_hours = array();
            foreach (array_count_values($hours) as $val => $c) {
                if ($c > 1) {
                    $unavailable_hours[] = $val;
                }
            }
            return response()->json(compact('unavailable_hours'), 200);
        }
        return response()->json('no doctor selected', 500);
    }

    public function bookAppointment()
    {
        $this->validate($this->request, $this->model->user_booking());
        $patient = $this->user_model->getUser();
        $doctor = $this->user_model->where([
            'role_id' => 2,
            'id' => $this->request->doctor_id,
        ])->first();
        if ($doctor && $patient) {
            if ($patient->activeAppointment($doctor->id)) {
                return response()->json('there is alive appointment', 401);
            }
            $date = Carbon::parse($this->request->appointment_date . ' ' . $this->request->appointment_time)->toDateTimeString();
            $now = Carbon::now()->toDateTimeString();
            if ($now >= $date) {
                return response()->json('error in date', 500);
            }
            $time = explode(':', $this->request->appointment_time);
            $appointments = $this->model->where([
                'appointment_date' => $date,
                'doctor_id' => $this->request->doctor_id,
                'appointment_hour' => $time[0],
            ])->get();
            if (count($appointments) >= 2) {
                return response()->json('unavailable time for this doctor', 500);
            }
            if (count($appointments) == 1) {
                foreach ($appointments as $appointment) {
                    if ($appointment->appointment_minute == $time[1]) {
                        return response()->json('duplicated time', 403);
                    }
                }
            }
            if ($time[1] != 0 && $time[1] != 30) {
                return response()->json('error in time', 500);
            }
            $appointment = new $this->model;
            $appointment->appointment_date = $this->request->appointment_date;
            $appointment->appointment_hour = $time[0];
            $appointment->appointment_minute = $time[1];
            $appointment->patient_id = $patient->id;
            $appointment->doctor_id = $this->request->doctor_id;
            $DONE = $appointment->save();
            if (!$DONE) {
                return response()->json('error', 500);
            }
            return response()->json('added', 200);
        }
        return response()->json('error', 500);
    }

    public function getBookingStatus($doctor_id)
    {
        $patient = $this->user_model->getUser();
        $doctor = $this->user_model->where([
            'role_id' => 2,
            'id' => $doctor_id,
        ])->first();
        if ($doctor && $patient) {
            if ($patient->activeAppointment($doctor->id)) {
                return response()->json(['status' => false], 200);
            }
            return response()->json(['status' => true], 200);
        }
        return response()->json('error', 500);
    }

    public function getUpcoming()
    {
        $patient = $this->user_model->getUser();
        $live_appointments = $patient->liveAppointments();
        return response()->json(compact('live_appointments'));
    }

    public function getFinished()
    {
        $patient = $this->user_model->getUser();
        $finished_appointments = $patient->finishedAppointments();
        return response()->json(compact('finished_appointments'));
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
        $patient = $this->user_model->getUser();
        if ($appointment->canCancelled() && $appointment->patient_id == $patient->id) {
            $appointment->delete();
            return response()->json('this appointment has been cancelled', 200);
        }
        return response()->json('this appointment cant cancelled', 500);
    }
}
