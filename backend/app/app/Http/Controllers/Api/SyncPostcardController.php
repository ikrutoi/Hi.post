<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserPostcardSnapshot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SyncPostcardController extends Controller
{
    private const MAX_PAYLOAD_BYTES = 10 * 1024 * 1024;

    public const SUPPORTED_PAYLOAD_VERSION = 1;

    public function show(Request $request): JsonResponse
    {
        $snapshot = UserPostcardSnapshot::query()
            ->where('user_id', $request->user()->id)
            ->first();

        if (! $snapshot) {
            return response()->json([
                'message' => 'No cloud backup found',
            ], 404);
        }

        return response()->json($this->formatSnapshot($snapshot));
    }

    public function update(Request $request): JsonResponse
    {
        if (strlen($request->getContent()) > self::MAX_PAYLOAD_BYTES) {
            throw ValidationException::withMessages([
                'payload' => ['Snapshot payload is too large'],
            ]);
        }

        $validated = $request->validate([
            'version' => 'required|integer|in:' . self::SUPPORTED_PAYLOAD_VERSION,
            'exportedAt' => 'nullable|date',
            'postcards' => 'required|array',
        ]);

        $payload = [
            'version' => $validated['version'],
            'exportedAt' => $validated['exportedAt'] ?? now()->toIso8601String(),
            'postcards' => $validated['postcards'],
        ];

        $snapshot = UserPostcardSnapshot::query()->updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'payload_version' => $validated['version'],
                'payload' => $payload,
            ],
        );

        return response()->json($this->formatSnapshot($snapshot->fresh()));
    }

    public function destroy(Request $request): JsonResponse
    {
        UserPostcardSnapshot::query()
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json(['message' => 'Cloud backup deleted']);
    }

    /**
     * @return array{
     *   version: int,
     *   exportedAt: string|null,
     *   postcards: array<int, mixed>,
     *   updatedAt: string
     * }
     */
    private function formatSnapshot(UserPostcardSnapshot $snapshot): array
    {
        $payload = $snapshot->payload ?? [];

        return [
            'version' => (int) ($payload['version'] ?? $snapshot->payload_version),
            'exportedAt' => $payload['exportedAt'] ?? null,
            'postcards' => $payload['postcards'] ?? [],
            'updatedAt' => $snapshot->updated_at?->toIso8601String(),
        ];
    }
}
