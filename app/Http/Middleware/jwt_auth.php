<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class jwt_auth
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
        if ($request->header('Authorization')) {
            try
            {
                if (!$user = JWTAuth::parseToken()->authenticate()) {
                    return response()->json([
                        'code' => 401,
                        'response' => 'not authorized',
                    ], 401);
                }
            } catch (TokenExpiredException $e) {
                return response()->json([
                    'code' => 401,
                    'response' => 'token_expired',
                ], 401);
            } catch (JWTException $e) {
                return response()->json([
                    'code' => 500,
                    'response' => 'token_absent',
                ], 500);
            }
            return $next($request);
        }
        return response()->json('not token', 500);
    }
}
