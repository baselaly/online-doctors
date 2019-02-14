<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAppointmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->increments('id');
            $table->date('appointment_date');
            $table->string('appointment_hour', 255);
            $table->string('appointment_minute', 56);
            $table->unsignedInteger('patient_id');
            $table->foreign('patient_id')->references('id')->on('users');
            $table->unsignedInteger('doctor_id');
            $table->foreign('doctor_id')->references('id')->on('users');
            $table->float('rate', 8, 2)->nullable();
            $table->integer('status')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('appointments');
    }
}
