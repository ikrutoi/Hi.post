<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostcardController;
use App\Http\Controllers\System\ImageController as SystemImageController;
use App\Http\Controllers\User\ImageController as UserImageController;
use app\Http\Controllers\User\TextController as UserTextController;
use app\Http\Controllers\User\SenderController as UserSenderController;
use app\Http\Controllers\User\RecipientController as UserRecipientController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\AuthController;

Route::get('templates/images/system', [SystemImageController::class, 'index']);

Route::apiResource('postcards', PostcardController::class);
Route::apiResource('templates/images', UserImageController::class);
Route::apiResource('templates/texts', UserTextController::class);
Route::apiResource('templates/senders', UserSenderController::class);
Route::apiResource('templates/recipients', UserRecipientController::class);

Route::get('/analytics/users', [AnalyticsController::class, 'userStats']);
Route::get('/analytics/upcoming', [AnalyticsController::class, 'upcomingStats']);
Route::get('/analytics/range', [AnalyticsController::class, 'dynamicRange']);

Route::post('/login', [AuthController::class, 'login']);
Route::middleware(['auth:sanctum', \App\Http\Middleware\EnsureUserIsActive::class])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware('auth:sanctum')->get('/analytics/user-postcard-stats', [AnalyticsController::class, 'userCartAndHubStats']);

