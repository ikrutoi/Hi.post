<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Opaque PostcardHydrated[] backup (sync payload v1). Live vehicle until a new schema.
 * Do not flatten this JSON onto frozen `postcards`.
 *
 * @see \App\Domain\Postcard\BackendCanon
 */
class UserPostcardSnapshot extends Model
{
    protected $fillable = [
        'user_id',
        'payload_version',
        'payload',
    ];

    protected function casts(): array
    {
        return [
            'payload_version' => 'integer',
            'payload' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
