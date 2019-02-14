<?php
Route::group(['prefix' => 'user'], function () {
    Route::post('/login', 'userController\usercontroller@login');
    Route::post('/register', 'userController\usercontroller@register');
    Route::get('/check', 'userController\usercontroller@checkUser');
    Route::get('/getDoctors', 'userController\doctorcontroller@getDoctors');
    Route::get('/getCategories', 'userController\categorycontroller@getCategories');
    Route::get('/doctorSearch/{category_id?}/{name?}', 'userController\doctorcontroller@search');
    Route::get('/categoryDoctors/{category_id}', 'userController\doctorcontroller@getCategoryDoctors');

    Route::group(['middleware' => ['jwt_auth', 'user']], function () {
        Route::get('/logout', 'userController\usercontroller@logout');
        Route::post('/editProfile', 'userController\usercontroller@editProfile');
        Route::post('/editPassword', 'userController\usercontroller@editPassword');
        Route::get('/getDoctor/{doctor_id}', 'userController\doctorcontroller@getDoctor');
        Route::post('/appointment/checkDate/{id?}', 'userController\appointmentcontroller@checkAvailableDates');
        Route::post('appointment/checkHour/{id?}', 'userController\appointmentcontroller@checkAvailableHours');
        Route::post('appointment/book', 'userController\appointmentcontroller@bookAppointment');
        Route::get('/getBookingStatus/{doctor_id}', 'userController\appointmentcontroller@getBookingStatus');
        Route::get('/upcoming', 'userController\appointmentcontroller@getUpcoming');
        Route::get('/finished', 'userController\appointmentcontroller@getFinished');
        Route::post('/rateDoctor', 'userController\doctorcontroller@rateDoctor');
        Route::get('/getFeedback/{id}', 'userController\appointmentcontroller@getFeedback');
        Route::get('/cancelAppointment/{id}', 'userController\appointmentcontroller@cancel');

    });
});
