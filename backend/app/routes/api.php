<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PostcardController;
use App\Http\Controllers\System\ImageController as SystemImageController;
use App\Http\Controllers\User\ImageController as UserImageController;
use App\Http\Controllers\User\RecipientController as UserRecipientController;
use App\Http\Controllers\User\SenderController as UserSenderController;
use App\Http\Controllers\User\TextController as UserTextController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Api\SyncPostcardController;
use App\Http\Controllers\Api\UserFileController;
use App\Http\Controllers\Api\V2LibraryController;
use App\Http\Controllers\Api\V2PostcardController;
use App\Http\Controllers\AuthController;

Route::get('templates/images/system', [SystemImageController::class, 'index']);

/** Frozen legacy CRUD (410). Cloud copy is /v2 + /files. System catalog stays above. */
Route::apiResource('postcards', PostcardController::class);
Route::apiResource('templates/images', UserImageController::class);
Route::apiResource('templates/texts', UserTextController::class);
Route::apiResource('templates/recipients', UserRecipientController::class);
Route::apiResource('templates/senders', UserSenderController::class);

Route::get('/analytics/users', [AnalyticsController::class, 'userStats']);
Route::get('/analytics/upcoming', [AnalyticsController::class, 'upcomingStats']);
Route::get('/analytics/range', [AnalyticsController::class, 'dynamicRange']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware(['auth:sanctum', \App\Http\Middleware\EnsureUserIsActive::class])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::patch('/me', [AuthController::class, 'update']);
    Route::patch('/me/avatar', [AuthController::class, 'updateAvatar']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/files', [UserFileController::class, 'store']);
    Route::get('/files/{id}', [UserFileController::class, 'show']);
    Route::get('/files/{id}/{variant}', [UserFileController::class, 'variant']);
    Route::delete('/files/{id}', [UserFileController::class, 'destroy']);

    Route::get('/v2/postcards', [V2PostcardController::class, 'index']);
    Route::put('/v2/postcards/{id}', [V2PostcardController::class, 'upsert']);
    Route::delete('/v2/postcards/{id}', [V2PostcardController::class, 'destroy']);

    Route::get('/v2/{kind}', [V2LibraryController::class, 'index'])
        ->whereIn('kind', V2LibraryController::KINDS);
    Route::put('/v2/{kind}/{id}', [V2LibraryController::class, 'upsert'])
        ->whereIn('kind', V2LibraryController::KINDS);
    Route::delete('/v2/{kind}/{id}', [V2LibraryController::class, 'destroy'])
        ->whereIn('kind', V2LibraryController::KINDS);

    Route::get('/sync/postcards', [SyncPostcardController::class, 'show']);
    Route::put('/sync/postcards', [SyncPostcardController::class, 'update']);
    Route::delete('/sync/postcards', [SyncPostcardController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->get('/analytics/user-postcard-stats', [AnalyticsController::class, 'userCartAndHubStats']);

