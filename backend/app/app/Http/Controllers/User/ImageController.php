<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Frozen user image-template CRUD. System catalog stays on GET templates/images/system.
 * User cardphoto templates: /api/v2/cardphotos + /api/files.
 */
class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'User image templates use /api/v2/cardphotos.',
        ], 410);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
