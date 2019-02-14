<?php

namespace App\Http\Controllers\adminController;

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
        $this->model = $model;
        $this->request = $request;
        $this->user_model = $user_model;
    }

    public function addAppointment()
    {
        $this->validate($this->request, $this->model->rules());
        $patient = $this->user_model->where([
            'category_id' => null,
            'id' => $this->request->patient_id,
        ])->first();
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
            $appointment->patient_id = $this->request->patient_id;
            $appointment->doctor_id = $this->request->doctor_id;
            $DONE = $appointment->save();
            if (!$DONE) {
                return response()->json('error', 500);
            }
            return response()->json('added', 200);
        }
        return response()->json('error', 500);
    }

    public function editAppointment($id)
    {
        $this->validate($this->request, $this->model->rules());
        $patient = $this->user_model->where([
            'role_id' => 4,
            'id' => $this->request->patient_id,
        ])->first();
        $doctor = $this->user_model->where([
            'id' => $this->request->doctor_id,
            'role_id' => 2,
        ])->first();
        if ($doctor && $patient) {
            $appointment = $this->model->findOrFail($id);
            $time = explode(':', $this->request->appointment_time);
            $old_date = Carbon::parse($appointment->appointment_date . ' ' . $appointment->aapointment_hour . ':' . $appointment->appointment_minute)
                ->toDateTimeString();
            $new_date = Carbon::parse($this->request->appointment_date . ' ' . $this->request->appointment_time)->toDateTimeString();
            if ($old_date > $new_date) {
                return response()->json('error in date', 500);
            }
            $appointments = $this->model->where([
                'appointment_date' => $this->request->appointment_date,
                'doctor_id' => $this->request->doctor_id,
                'appointment_hour' => $time[0],
            ])->where('id', '!=', $id)->get();
            if (count($appointments) >= 2) {
                return response()->json('unavailable time for this doctor', 500);
            }
            if (count($appointments) == 1) {
                foreach ($appointments as $another_appointment) {
                    if ($another_appointment->appointment_minute == $time[1]) {
                        return response()->json('duplicated time', 403);
                    }
                }
            }
            if ($time[1] != 0 && $time[1] != 30) {
                return response()->json('error in time', 500);
            }
            $appointment->appointment_date = $this->request->appointment_date;
            $appointment->appointment_hour = $time[0];
            $appointment->appointment_minute = $time[1];
            $appointment->patient_id = $this->request->patient_id;
            $appointment->doctor_id = $this->request->doctor_id;
            if ($this->request->status == true) {
                $appointment->status = 1;
            } else if ($this->request->status == false) {
                $appointment->status = 0;
            }
            $DONE = $appointment->save();
            if (!$DONE) {
                return response()->json('error', 500);
            }
            return response()->json('edited', 200);
        }
        return response()->json('error', 500);
    }

    public function deleteAppointment($id)
    {
        $appointment = $this->model->findOrFail($id);
        $DONE = $appointment->delete();
        if (!$DONE) {
            return response()->json('error', 500);
        }
        return response()->json('deleted', 200);
    }

    public function getAll()
    {
        $appointments = $this->model->paginate(10);
        if (!$appointments) {
            return response()->json('no appointments', 404);
        }
        foreach ($appointments as $appointment) {
            $appointment->doctor;
            $appointment->patient;
            $appointment['appointment_time'] = $appointment->appointment_hour . ':' . $appointment->appointment_minute;
            $appointment['appointment_time'] = date("g:i a", strtotime($appointment['appointment_time']));
        }
        return response()->json(compact('appointments'), 200);
    }

    public function getById($id)
    {
        $appointment = $this->model->findOrFail($id);
        $appointment->doctor;
        $appointment->patient;
        $appointment['appointment_time'] = $appointment->appointment_hour . ':' . $appointment->appointment_minute;
        $appointment['appointment_time'] = date("g:i a", strtotime($appointment['appointment_time']));
        $appointment->status == 0 ? $appointment->status = false : $appointment->status = true;

        return response()->json(compact('appointment'), 200);
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
            $unavailable_dates = array();
            foreach (array_count_values($hours) as $val => $c) {
                if ($c > 1) {
                    $unavailable_hours[] = $val;
                }
            }
            return response()->json(compact('unavailable_hours'), 200);
        }
        return response()->json('no doctor selected', 500);

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

    public function searchAppointments($status, $date)
    {
        if ($date != 2 && $status == 2) {
            $appointments = $this->model->where('appointment_date', $date)->paginate(10);
        } else if ($date == 2 && $status != 2) {
            $appointments = $this->model->where('status', $status)->paginate(10);
        } else {
            $appointments = $this->model->where([
                'status' => $status,
                'appointment_date' => $date,
            ])->paginate(10);
        }
        if (!$appointments) {
            return response()->json('no appointment match your search', 404);
        }
        foreach ($appointments as $appointment) {
            $appointment->doctor;
            $appointment->patient;
            $appointment['appointment_time'] = $appointment->appointment_hour . ':' . $appointment->appointment_minute;
            $appointment['appointment_time'] = date("g:i a", strtotime($appointment['appointment_time']));
        }
        return response()->json(compact('appointments'), 200);
    }

    public function getTodayAppointments()
    {
        $now = Carbon::now();
        $date = explode(' ', $now);
        $date = $date[0];
        $appointments = $this->model->where('appointment_date', $date)->paginate(10);
        if (!$appointments) {
            return response()->json('no appointments today', 404);
        }
        foreach ($appointments as $appointment) {
            $appointment->doctor;
            $appointment->patient;
            $appointment['appointment_time'] = $appointment->appointment_hour . ':' . $appointment->appointment_minute;
            $appointment['appointment_time'] = date("g:i a", strtotime($appointment['appointment_time']));
        }
        return response()->json(compact('appointments'), 200);
    }

    public function getCheckedAppointments()
    {
        $appointments = $this->model->where('status', 1)->paginate(10);
        if (!$appointments) {
            return response()->json('no appointments today', 404);
        }
        foreach ($appointments as $appointment) {
            $appointment->doctor;
            $appointment->patient;
            $appointment['appointment_time'] = $appointment->appointment_hour . ':' . $appointment->appointment_minute;
            $appointment['appointment_time'] = date("g:i a", strtotime($appointment['appointment_time']));
        }
        return response()->json(compact('appointments'), 200);
    }

    public function getUncheckedAppointments()
    {
        $appointments = $this->model->where('status', 0)->paginate(10);
        if (!$appointments) {
            return response()->json('no appointments today', 404);
        }
        foreach ($appointments as $appointment) {
            $appointment->doctor;
            $appointment->patient;
            $appointment['appointment_time'] = $appointment->appointment_hour . ':' . $appointment->appointment_minute;
            $appointment['appointment_time'] = date("g:i a", strtotime($appointment['appointment_time']));
        }
        return response()->json(compact('appointments'), 200);
    }

}
