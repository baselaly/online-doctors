<?php

Route::group(['middleware' => 'api'], function () {
    require_once 'routes/admin.php';
    require_once 'routes/user.php';
    require_once 'routes/doctor.php';

});
