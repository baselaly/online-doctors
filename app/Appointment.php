<?php

namespace App;

use App\Feedback;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Appointment extends Model
{
    public $table = 'appointments';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'appointment_date', 'appointment_hour', 'rate', 'appointment_minute', 'patient_id', 'doctor_id', 'status',
    ];

    public function rules()
    {
        return [
            'appointment_date' => 'required',
            'patient_id' => 'required|exists:users,id',
            'doctor_id' => 'required|exists:users,id',
            'appointment_time' => 'required',
        ];
    }

    public function user_booking()
    {
        return [
            'appointment_date' => 'required',
            'doctor_id' => 'required|exists:users,id',
            'appointment_time' => 'required',
        ];
    }

    public function checkAppointmentHourRule()
    {
        return [
            'doctor_id' => 'required|exists:users,id',
            'date' => 'required',
        ];
    }

    public function checkAppointmentDateRule()
    {
        return [
            'doctor_id' => 'required|exists:users,id',
        ];
    }

    public function AdminsearchRules()
    {
        return [
            'date' => 'required_without:status',
            'status' => 'required_without:date',
        ];
    }

    public function doctor()
    {
        return $this->belongsTo('App\User', 'doctor_id');
    }

    public function patient()
    {
        return $this->belongsTo('App\User', 'patient_id');
    }

    public function feedback()
    {
        return Feedback::where('appointment_id', $this->id)->first();
    }

    public function changeStatus()
    {
        $this->status = 1;
        if ($this->save()) {
            return true;
        }
        return false;
    }

    public function canCancelled()
    {
        $now = Carbon::today()->toDateTimeString();
        $concatenate_date = DB::raw('concat(appointment_date," ",appointment_hour,":",appointment_minute)');
        $appointment = $this->where([
            'id' => $this->id,
        ])->whereDate($concatenate_date, '=', $now)->first();
        if ($appointment) {
            return false;
        }
        return true;
    }
}
