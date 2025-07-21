<?php

use Illuminate\Support\Facades\Route;
use app\Http\Controllers\Api\PostcardController;
use App\Http\Controllers\System\ImageController as SystemImageController;
use App\Http\Controllers\User\ImageController as UserImageController;
use app\Http\Controllers\User\TextController as UserTextController;
use app\Http\Controllers\User\SenderController as UserSenderController;
use app\Http\Controllers\User\RecipientController as UserRecipientController;

Route::get('templates/images/system', [SystemImageController::class, 'index']);

Route::apiResource('postcards', PostcardController::class);
Route::apiResource('templates/images', UserImageController::class);
Route::apiResource('templates/texts', UserTextController::class);
Route::apiResource('templates/senders', UserSenderController::class);
Route::apiResource('templates/recipients', UserRecipientController::class);

