<?php

namespace App\Http\Controllers\Api;

use App\Domain\Postcard\BackendCanon;
use App\Http\Controllers\Controller;
use App\Models\UserPostcardSnapshot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Read-only legacy snapshot (phase 4). Writes go to /api/v2/postcards.
 */
class SyncPostcardController extends Controller
{
    public const SUPPORTED_PAYLOAD_VERSION = BackendCanon::SYNC_PAYLOAD_VERSION;

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
        return response()->json([
            'message' => 'Snapshot backup is read-only. Use /api/v2/postcards.',
        ], 410);
    }

    public function destroy(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Snapshot backup is read-only. Use /api/v2/postcards.',
        ], 410);
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
