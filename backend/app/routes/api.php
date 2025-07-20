<?php

use Illuminate\Support\Facades\Route;
use app\Http\Controllers\Api\PostcardController;
use app\Http\Controllers\Api\ImageTemplateController;
use app\Http\Controllers\Api\TextTemplateController;
use app\Http\Controllers\Api\SenderTemplateController;
use app\Http\Controllers\Api\RecipientTemplateController;

Route::apiResource('postcards', PostcardController::class);
Route::apiResource('templates/images', ImageTemplateController::class);
Route::apiResource('templates/texts', TextTemplateController::class);
Route::apiResource('templates/senders', SenderTemplateController::class);
Route::apiResource('templates/recipients', RecipientTemplateController::class);

