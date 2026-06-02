<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
