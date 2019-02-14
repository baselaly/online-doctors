<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;

class doctor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = JWTAuth::parseToken()->authenticate();
        if (!$user) {
            return response()->json('no user found', 401);
        }
        if ($user->role_id == 2) {
            return $next($request);
        }
        return response()->json('not authorized', 401);
    }
}
