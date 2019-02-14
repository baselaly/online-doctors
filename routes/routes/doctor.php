<?php
Route::group(['prefix' => 'doctor'], function () {
    Route::post('/login', 'doctorcontroller\usercontroller@login');
    Route::get('/check', 'doctorcontroller\usercontroller@checkUser');

    Route::group(['middleware' => ['jwt_auth', 'doctor']], function () {
        Route::get('/logout', 'doctorcontroller\usercontroller@logout');
        Route::get('/upcoming', 'doctorcontroller\appointmentcontroller@getUpcoming');
        Route::get('/finished', 'doctorcontroller\appointmentcontroller@getFinished');
        Route::get('/finishAppointment/{id}', 'doctorcontroller\appointmentcontroller@finishAppointment');
        Route::get('/today', 'doctorcontroller\appointmentcontroller@getToday');
        Route::get('/getPatient/{id}', 'doctorcontroller\usercontroller@getPatient');
        Route::get('/getFeedback/{id}', 'doctorcontroller\appointmentcontroller@getFeedback');
        Route::get('/cancelAppointment/{id}', 'doctorcontroller\appointmentcontroller@cancel');


    });
});
