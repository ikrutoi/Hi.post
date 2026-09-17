<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserLibraryItem extends Model
{
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'kind',
        'id',
        'payload',
        'client_updated_at',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'client_updated_at' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
