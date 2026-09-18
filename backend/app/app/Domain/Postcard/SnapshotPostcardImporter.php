<?php

namespace App\Domain\Postcard;

use App\Models\UserPostcard;

final class SnapshotPostcardImporter
{
    /**
     * Copy opaque snapshot rows into `user_postcards` when the user has none.
     *
     * @param  list<mixed>  $postcards
     */
    public function importList(int $userId, array $postcards): int
    {
        if (UserPostcard::query()->where('user_id', $userId)->exists()) {
            return 0;
        }

        $imported = 0;
        foreach ($postcards as $raw) {
            if (! is_array($raw)) {
                continue;
            }
            if ($this->insertOne($userId, $raw)) {
                $imported++;
            }
        }

        return $imported;
    }

    /**
     * @param  array<string, mixed>  $raw
     */
    private function insertOne(int $userId, array $raw): bool
    {
        $id = isset($raw['id']) ? (string) $raw['id'] : '';
        if ($id === '' || strlen($id) > 64 || str_contains($id, '/')) {
            return false;
        }

        $status = isset($raw['status']) ? (string) $raw['status'] : '';
        if (! in_array($status, BackendCanon::POSTCARD_STATUSES, true)) {
            return false;
        }

        $card = $raw['card'] ?? null;
        if (! is_array($card)) {
            return false;
        }

        $date = is_array($raw['date'] ?? null) ? $raw['date'] : [];
        $cardDate = is_array($card['date'] ?? null) ? $card['date'] : [];
        $year = (int) ($date['year'] ?? $cardDate['year'] ?? 0);
        $month = (int) ($date['month'] ?? $cardDate['month'] ?? 0);
        $day = (int) ($date['day'] ?? $cardDate['day'] ?? 0);

        $refs = is_array($raw['postcard'] ?? null) ? $raw['postcard'] : [];

        UserPostcard::query()->create([
            'id' => $id,
            'user_id' => $userId,
            'status' => $status,
            'price' => (string) ($raw['price'] ?? ''),
            'local_id' => (int) ($raw['localId'] ?? 0),
            'dispatch_year' => $year,
            'dispatch_month' => $month,
            'dispatch_day' => $day,
            'payload' => [
                'postcard' => PostcardPayloadSanitizer::sanitize($refs),
                'card' => PostcardPayloadSanitizer::sanitize($card),
            ],
            'client_created_at' => (int) ($raw['createdAt'] ?? 0),
            'client_updated_at' => (int) ($raw['updatedAt'] ?? $raw['createdAt'] ?? 0),
        ]);

        return true;
    }
}
