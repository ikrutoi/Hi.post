<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Legacy apiResource endpoints that must not grow. Tables stay until a later drop.
 */
abstract class FrozenResourceController extends Controller
{
    abstract protected function successorMessage(): string;

    public function index(): JsonResponse
    {
        return $this->gone();
    }

    public function store(Request $request): JsonResponse
    {
        return $this->gone();
    }

    public function show(string $id): JsonResponse
    {
        return $this->gone();
    }

    public function update(Request $request, string $id): JsonResponse
    {
        return $this->gone();
    }

    public function destroy(string $id): JsonResponse
    {
        return $this->gone();
    }

    protected function gone(): JsonResponse
    {
        return response()->json([
            'message' => $this->successorMessage(),
        ], 410);
    }
}
