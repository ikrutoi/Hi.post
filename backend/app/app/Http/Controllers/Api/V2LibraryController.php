<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserLibraryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Phase 5: address / cardtext / cardphoto templates as IndexedDB-shaped JSON.
 * Do not write legacy recipient_templates, text_templates, or user image_templates.
 */
class V2LibraryController extends Controller
{
    public const KINDS = ['addresses', 'cardtexts', 'cardphotos'];

    public function index(Request $request, string $kind): JsonResponse
    {
        abort_unless($this->isKind($kind), 404);

        $items = UserLibraryItem::query()
            ->where('user_id', $request->user()->id)
            ->where('kind', $kind)
            ->orderByDesc('client_updated_at')
            ->get()
            ->map(fn (UserLibraryItem $row) => $this->formatRow($row))
            ->values();

        return response()->json(['items' => $items]);
    }

    public function upsert(Request $request, string $kind, string $id): JsonResponse
    {
        abort_unless($this->isKind($kind) && $this->isValidClientId($id), 404);

        $validated = $request->validate([
            'updatedAt' => ['nullable', 'integer', 'min:0'],
            'timestamp' => ['nullable', 'integer', 'min:0'],
        ]);

        $body = $request->all();
        unset($body['updatedAt']);
        $payload = $this->sanitize(is_array($body) ? $body : []);
        $incomingUpdatedAt = (int) (
            $validated['updatedAt']
            ?? $validated['timestamp']
            ?? (int) round(microtime(true) * 1000)
        );

        $existing = UserLibraryItem::query()
            ->where('user_id', $request->user()->id)
            ->where('kind', $kind)
            ->where('id', $id)
            ->first();

        if ($existing && (int) $existing->client_updated_at > $incomingUpdatedAt) {
            return response()->json($this->formatRow($existing));
        }

        $row = UserLibraryItem::query()->updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'kind' => $kind,
                'id' => $id,
            ],
            [
                'payload' => $payload,
                'client_updated_at' => $incomingUpdatedAt,
            ],
        );

        return response()->json($this->formatRow($row->fresh() ?? $row));
    }

    public function destroy(Request $request, string $kind, string $id): JsonResponse
    {
        abort_unless($this->isKind($kind) && $this->isValidClientId($id), 404);

        UserLibraryItem::query()
            ->where('user_id', $request->user()->id)
            ->where('kind', $kind)
            ->where('id', $id)
            ->delete();

        return response()->json(['message' => 'Library item deleted']);
    }

    private function isKind(string $kind): bool
    {
        return in_array($kind, self::KINDS, true);
    }

    private function isValidClientId(string $id): bool
    {
        return $id !== '' && strlen($id) <= 64 && ! str_contains($id, '/');
    }

    /**
     * @param  mixed  $value
     * @return mixed
     */
    private function sanitize(mixed $value): mixed
    {
        if (is_array($value)) {
            $out = [];
            foreach ($value as $key => $item) {
                if ($key === 'blob') {
                    continue;
                }
                $out[$key] = $this->sanitize($item);
            }

            return $out;
        }

        if (is_string($value) && str_starts_with($value, 'blob:')) {
            return '';
        }

        return $value;
    }

    /**
     * @return array<string, mixed>
     */
    private function formatRow(UserLibraryItem $row): array
    {
        $payload = is_array($row->payload) ? $row->payload : [];
        $payload['id'] = $row->id;
        $payload['updatedAt'] = $row->client_updated_at;

        return $payload;
    }
}
