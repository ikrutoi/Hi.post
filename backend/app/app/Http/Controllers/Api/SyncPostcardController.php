<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

/** Retired opaque snapshot. Cloud copy is /api/v2/postcards. */
class SyncPostcardController extends Controller
{
    public function show(): JsonResponse
    {
        return $this->gone();
    }

    public function update(): JsonResponse
    {
        return $this->gone();
    }

    public function destroy(): JsonResponse
    {
        return $this->gone();
    }

    private function gone(): JsonResponse
    {
        return response()->json([
            'message' => 'Snapshot backup is gone. Use /api/v2/postcards.',
        ], 410);
    }
}
