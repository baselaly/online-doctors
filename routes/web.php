<?php

Route::group(['middleware' => 'web'], function () {

    Route::get('/{path?}', function () {
        return view('welocme');
    })->where('path', '[\/\w\.-]*');

    // Route::get('/payment', function () {
    //     return view('admin');
    // });

    // Route::post('/payment/create', ['as' => 'payment.create', 'uses' => 'userController\usercontroller@createPayment']);

    // Route::get('/payment/execute', ['as' => 'payment.execute', 'uses' => 'userController\usercontroller@executePayment']);

    // Route::get('/payment/cancel', ['as' => 'payment.cancel', 'uses' => 'userController\usercontroller@cancelPayment']);

});
