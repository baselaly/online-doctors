<?php

Route::group(['middleware' => 'web'], function () {

    Route::get('/{path?}', function () {
        return view('welcome');
    })->where( 'path', '[\/\w\.-]*' );

});
