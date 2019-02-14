<?php
Route::group(['prefix' => 'admin'], function () {
    Route::post('/login', 'adminController\usercontroller@login');

    Route::group(['middleware' => ['jwt_auth', 'admin']], function () {
        Route::get('/check', 'adminController\usercontroller@checkAdmin');

        Route::get('/logout', 'adminController\usercontroller@logout');

        Route::get('/statistics', 'adminController\usercontroller@getStatistics');

        Route::post('/role/add', 'adminController\rolecontroller@addRole');
        Route::post('/role/edit/{id}', 'adminController\rolecontroller@editRole');
        Route::get('/role/delete/{id}', 'adminController\rolecontroller@deleteRole');
        Route::get('/role/getAll', 'adminController\rolecontroller@getAll');

        Route::post('/category/add', 'adminController\categorycontroller@addCategory');
        Route::post('/category/edit/{id}', 'adminController\categorycontroller@editCategory');
        Route::get('/category/delete/{id}', 'adminController\categorycontroller@deleteCategory');
        Route::get('/category/getAll', 'adminController\categorycontroller@getAll');
        Route::get('/category/getAllForUsers', 'adminController\categorycontroller@getAllForUsers');
        Route::get('/category/getById/{id}', 'adminController\categorycontroller@getById');

        Route::post('/user/add', 'adminController\usercontroller@addUser');
        Route::post('/user/edit/{id}', 'adminController\usercontroller@editUser');
        Route::get('/user/delete/{id}', 'adminController\usercontroller@deleteUser');
        Route::get('/user/getAll', 'adminController\usercontroller@getAll');
        Route::get('/user/getById/{id}', 'adminController\usercontroller@getById');
        Route::get('/users/Doctors_patients', 'adminController\usercontroller@get_doctors_patients');

        Route::post('appointment/add', 'adminController\appointmentcontroller@addAppointment');
        Route::post('appointment/edit/{id}', 'adminController\appointmentcontroller@editAppointment');
        Route::get('appointment/delete/{id}', 'adminController\appointmentcontroller@deleteAppointment');
        Route::get('appointment/getAll', 'adminController\appointmentcontroller@getAll');
        Route::get('appointment/today', 'adminController\appointmentcontroller@getTodayAppointments');
        Route::get('appointment/checked', 'adminController\appointmentcontroller@getCheckedAppointments');
        Route::get('appointment/unchecked', 'adminController\appointmentcontroller@getUncheckedAppointments');
        Route::get('appointment/getById/{id}', 'adminController\appointmentcontroller@getById');
        Route::post('appointment/checkHour/{id?}', 'adminController\appointmentcontroller@checkAvailableHours');
        Route::post('appointment/checkDate/{id?}', 'adminController\appointmentcontroller@checkAvailableDates');
        Route::get('appointment/search/{status}/{date}', 'adminController\appointmentcontroller@searchAppointments');

        Route::post('feedback/add', 'adminController\feedbackcontroller@addFeedback');
        Route::post('feedback/edit/{id}', 'adminController\feedbackcontroller@editFeedback');
        Route::get('feedback/delete/{id}', 'adminController\feedbackcontroller@deleteFeedback');
        Route::get('feedback/getAll', 'adminController\feedbackcontroller@getAll');
        Route::get('feedback/getById/{id}', 'adminController\feedbackcontroller@getById');
    });
});
