<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    public $table = 'feedbacks';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'feedback', 'patient_id', 'doctor_id', 'appointment_id',
    ];

    public function rules()
    {
        return [
            'feedback' => 'required|max:400',
            'patient_id' => 'required|exists:users,id',
            'doctor_id' => 'required|exists:users,id',
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

    public function appointment()
    {
        return $this->belongsTo('App\Appointment', 'appointment_id');
    }
}
