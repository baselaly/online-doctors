<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <base href="/" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Payment</title>
        <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet">
    </head>
    <body>
    <div>
        <form action="{{ route('payment.create') }}" method="post">
            {{ csrf_field() }}
            <input type="submit" value="Pay NOW"/>
        </form>
    </div>
    </body>
</html>
