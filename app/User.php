<?php

namespace App;

use Carbon\Carbon;
use Eloquent;
use Illuminate\Auth\Authenticatable as AuthenticableTrait;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use JWTAuth;

class User extends Eloquent implements Authenticatable
{
    use AuthenticableTrait;
    public $table = 'users';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'address', 'phone', 'role_id', 'category_id', 'image', 'password', 'fees',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    public function add_rules()
    {
        return [
            'name' => 'required|max:30',
            'email' => 'required|unique:users|email|max:50',
            'phone' => 'required|numeric|min:1|digits_between:1,20',
            'address' => 'required|max:30',
            'role_id' => 'required|exists:roles,id',
            'password' => 'required|min:6|max:40',
        ];
    }

    public function edit_rules($id)
    {
        return [
            'name' => 'required|max:30',
            'email' => 'required|email|max:50|unique:users,email,' . $id . ',id',
            'phone' => 'required|numeric|min:1|digits_between:1,20',
            'address' => 'required|max:30',
            'role_id' => 'required|exists:roles,id',
        ];
    }

    public function edit_profile_rules($id)
    {
        return [
            'name' => 'required|max:30',
            'email' => 'required|email|max:50|unique:users,email,' . $id . ',id',
            'phone' => 'required|numeric|min:1|digits_between:1,20',
            'address' => 'required|max:30',
        ];
    }
    public function edit_password_rules()
    {
        return [
            'oldPassword' => 'required',
            'newPassword' => 'required|min:6|max:40',
        ];
    }

    public function register_rules()
    {
        return [
            'email' => 'required|unique:users|email|max:50',
            'name' => 'required|max:30',
            'phone' => 'required|numeric|min:1|digits_between:1,20',
            'address' => 'required|max:30',
            'password' => 'required|min:6|max:40',
        ];
    }

    public function login_rules()
    {
        return [
            'email' => 'required|email',
            'password' => 'required',
        ];
    }

    public function validate_image()
    {
        return [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];
    }

    public function rate_validate()
    {
        return [
            'rate' => 'required|numeric|min:0.5',
            'appointment_id' => 'required|exists:appointments,id',
        ];
    }

    public function validate_rate_feedback()
    {
        return [
            'feedback' => 'required|max:400',
        ];
    }

    public function getUser()
    {
        $user = JWTAuth::parseToken()->authenticate();
        if (!$user) {
            return response()->json('not authorized', 401);
        }
        return $user;
    }

    public function doctor_appointments()
    {
        return $this->hasMany('App\Appointment', 'doctor_id');
    }

    public function patient_appointments()
    {
        return $this->hasMany('App\Appointment', 'patient_id');
    }

    public function doctor_feedbacks()
    {
        return $this->hasMany('App\Feedback', 'doctor_id')->orderBy('created_at', 'DESC');
    }

    public function patient_feedbacks()
    {
        return $this->hasMany('App\Feedback', 'patient_id');
    }

    public function role()
    {
        return $this->belongsTo('App\Role');
    }

    public function category()
    {
        return $this->belongsTo('App\Category');
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function DoctorFeedback()
    {
        $feedback = Feedback::where([
            'doctor_id' => $this->id,
        ])->first();
        $feedback ?
        ($feedback['time'] = Carbon::parse($feedback->created_at)->format('l, d-F-Y g:i A')) /*&& ($feedback->patient)*/
        : '';
        return $feedback;
    }

    public function getRate()
    {
        $appointments_rates = Appointment::select('rate')->where([
            'status' => 1,
            'doctor_id' => $this->id,
        ])->get();
        $rates = [];
        foreach ($appointments_rates as $rate) {
            $rate ? array_push($rates, $rate->rate) : array_push($rates, 2.5);
        }
        $sum_of_rates = array_sum($rates);
        count($appointments_rates) > 0 ? $rate = $sum_of_rates / count($appointments_rates) : $rate = 0;
        return $rate;
    }

    public function getDoctorById($id)
    {
        $doctor = self::where([
            'id' => $id,
            'role_id' => 2,
        ])->first();
        return $doctor;
    }

    public function activeAppointment($doctor_id)
    {
        $appointment = Appointment::where([
            'status' => 0,
            'doctor_id' => $doctor_id,
            'patient_id' => $this->id,
        ])->first();
        return $appointment;
    }

    public function liveAppointments()
    {
        $now = Carbon::now()->toDateTimeString();
        $concatenate_date = DB::raw('concat(appointment_date," ",appointment_hour,":",appointment_minute)');
        $appointments = Appointment::where([
            'status' => 0,
            'patient_id' => $this->id,
        ])->where($concatenate_date, '>=', $now)
            ->orderByRaw($concatenate_date)
            ->paginate(9);
        foreach ($appointments->items() as $appointment) {
            $appointment['time'] = Carbon::parse($appointment->appointment_date . ' ' . $appointment->appointment_hour . ':' . $appointment->appointment_minute)->format('Y-m-d g:i A');
            $appointment->doctor;
            $appointment->doctor['image'] = '/uploads/' . $appointment->doctor->image;
            $appointment->doctor->category;
            $appointment['can_cancelled'] = $appointment->canCancelled();
        }
        return $appointments;
    }

    public function finishedAppointments()
    {
        $now = Carbon::now()->toDateTimeString();
        $concatenate_date = DB::raw('concat(appointment_date," ",appointment_hour,":",appointment_minute)');
        $appointments = Appointment::where([
            'status' => 1,
            'patient_id' => $this->id,
        ])->where($concatenate_date, '<', $now)
            ->orderByRaw($concatenate_date . ' DESC')->paginate(9);
        foreach ($appointments->items() as $appointment) {
            $appointment['time'] = Carbon::parse($appointment->appointment_date . ' ' . $appointment->appointment_hour . ':' . $appointment->appointment_minute)->format('Y-m-d g:i A');
            $appointment->doctor;
            $appointment->doctor['image'] = '/uploads/' . $appointment->doctor->image;
            $appointment->doctor->category;
            $appointment->feedback() ? $appointment['has_feedback'] = true : $appointment['has_feedback'] = false;
        }
        return $appointments;
    }

    public function DoctorLiveAppointments()
    {
        $now = Carbon::now()->toDateTimeString();
        $concatenate_date = DB::raw('concat(appointment_date," ",appointment_hour,":",appointment_minute)');
        $appointments = Appointment::where([
            'status' => 0,
            'doctor_id' => $this->id,
        ])->whereDate($concatenate_date, '>', $now)
            ->orderByRaw($concatenate_date)
            ->paginate(9);
        foreach ($appointments->items() as $appointment) {
            $appointment['time'] = Carbon::parse($appointment->appointment_date . ' ' . $appointment->appointment_hour . ':' . $appointment->appointment_minute)->format('Y-m-d g:i A');
            $appointment->patient;
            $appointment->patient['image'] = '/uploads/' . $appointment->patient->image;
            $appointment['can_cancelled'] = $appointment->canCancelled();
        }
        return $appointments;
    }

    public function DoctorFinishedAppointments()
    {
        $now = Carbon::now()->toDateTimeString();
        $concatenate_date = DB::raw('concat(appointment_date," ",appointment_hour,":",appointment_minute)');
        $appointments = Appointment::where([
            'doctor_id' => $this->id,
        ])->where($concatenate_date, '<', $now)
            ->orderByRaw($concatenate_date . ' DESC')->paginate(9);
        foreach ($appointments->items() as $appointment) {
            $appointment['time'] = Carbon::parse($appointment->appointment_date . ' ' . $appointment->appointment_hour . ':' . $appointment->appointment_minute)->format('Y-m-d g:i A');
            $appointment->patient;
            $appointment->patient['image'] = '/uploads/' . $appointment->patient->image;
            $appointment->feedback() ? $appointment['has_feedback'] = true : $appointment['has_feedback'] = false;
        }
        return $appointments;
    }

    public function DoctorTodayAppointments()
    {
        $now = Carbon::today()->toDateTimeString();
        $concatenate_date = DB::raw('concat(appointment_date," ",appointment_hour,":",appointment_minute)');
        $appointments = Appointment::where([
            'doctor_id' => $this->id,
            'status' => 0,
        ])->whereDate($concatenate_date, '=', $now)
            ->orderByRaw($concatenate_date)->paginate(9);
        foreach ($appointments->items() as $appointment) {
            $appointment['time'] = Carbon::parse($appointment->appointment_date . ' ' . $appointment->appointment_hour . ':' . $appointment->appointment_minute)->format('Y-m-d g:i A');
            $appointment->patient;
            $appointment->patient['image'] = '/uploads/' . $appointment->patient->image;
            $appointment->feedback() ? $appointment['has_feedback'] = true : $appointment['has_feedback'] = false;
        }
        return $appointments;
    }

    public function getPatient($id)
    {
        $patient = $this->where([
            'id' => $id,
            'role_id' => 4,
        ])->firstOrFail();
        $patient['image'] = '/uploads/' . $patient->image;

        return $patient;
    }
}
