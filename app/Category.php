<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public $table = 'categories';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
    ];

    public function rules()
    {
        return [
            'name' => 'required|max:50',
        ];
    }

    public function users()
    {
        return $this->hasMany('App\User');
    }
}
