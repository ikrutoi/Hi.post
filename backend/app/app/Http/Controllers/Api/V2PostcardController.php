<?php

namespace App\Http\Controllers\Api;

use App\Domain\Postcard\BackendCanon;
use App\Domain\Postcard\PostcardPayloadSanitizer;
use App\Http\Controllers\Controller;
use App\Models\UserPostcard;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * One Laravel row per postcard (IndexedDB canon).
 */
class V2PostcardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $rows = UserPostcard::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('client_updated_at')
            ->get()
            ->map(fn (UserPostcard $row) => $this->formatRow($row))
            ->values();

        return response()->json(['postcards' => $rows]);
    }

    public function upsert(Request $request, string $id): JsonResponse
    {
        abort_unless($this->isValidClientId($id), 404);

        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(BackendCanon::POSTCARD_STATUSES)],
            'price' => ['nullable', 'string', 'max:32'],
            'localId' => ['nullable', 'integer', 'min:0'],
            'createdAt' => ['required', 'integer', 'min:0'],
            'updatedAt' => ['required', 'integer', 'min:0'],
            'date' => ['required', 'array'],
            'date.year' => ['required', 'integer', 'min:0', 'max:9999'],
            'date.month' => ['required', 'integer', 'min:0', 'max:12'],
            'date.day' => ['required', 'integer', 'min:0', 'max:31'],
            'postcard' => ['nullable', 'array'],
            'card' => ['required', 'array'],
        ]);

        $payload = PostcardPayloadSanitizer::sanitize($validated['card']);
        $refs = PostcardPayloadSanitizer::sanitize($validated['postcard'] ?? []);
        $incomingUpdatedAt = (int) $validated['updatedAt'];

        $existing = UserPostcard::query()
            ->where('user_id', $request->user()->id)
            ->where('id', $id)
            ->first();

        if ($existing && (int) $existing->client_updated_at > $incomingUpdatedAt) {
            return response()->json($this->formatRow($existing));
        }

        $row = UserPostcard::query()->updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'id' => $id,
            ],
            [
                'status' => $validated['status'],
                'price' => (string) ($validated['price'] ?? ''),
                'local_id' => (int) ($validated['localId'] ?? 0),
                'dispatch_year' => (int) $validated['date']['year'],
                'dispatch_month' => (int) $validated['date']['month'],
                'dispatch_day' => (int) $validated['date']['day'],
                'payload' => [
                    'postcard' => $refs,
                    'card' => $payload,
                ],
                'client_created_at' => (int) $validated['createdAt'],
                'client_updated_at' => (int) $validated['updatedAt'],
            ],
        );

        return response()->json($this->formatRow($row->fresh() ?? $row));
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        abort_unless($this->isValidClientId($id), 404);

        UserPostcard::query()
            ->where('user_id', $request->user()->id)
            ->where('id', $id)
            ->delete();

        return response()->json(['message' => 'Postcard deleted']);
    }

    private function isValidClientId(string $id): bool
    {
        return $id !== '' && strlen($id) <= 64 && ! str_contains($id, '/');
    }

    /**
     * @return array<string, mixed>
     */
    private function formatRow(UserPostcard $row): array
    {
        $payload = $row->payload ?? [];

        return [
            'id' => $row->id,
            'localId' => $row->local_id,
            'status' => $row->status,
            'price' => $row->price,
            'createdAt' => $row->client_created_at,
            'updatedAt' => $row->client_updated_at,
            'date' => [
                'year' => $row->dispatch_year,
                'month' => $row->dispatch_month,
                'day' => $row->dispatch_day,
            ],
            'postcard' => $payload['postcard'] ?? [
                'cardphoto' => '',
                'cardtext' => '',
                'recipient' => '',
                'aroma' => '',
            ],
            'card' => $payload['card'] ?? [],
        ];
    }
}
