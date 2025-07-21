<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\ImageTemplate;
use Illuminate\Http\JsonResponse;

class ImageController extends Controller
{
    public function index(): JsonResponse
    {
        $images = ImageTemplate::where('type', 'system')->get();

        return response()->json($images);
    }
}

