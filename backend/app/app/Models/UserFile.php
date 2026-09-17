<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserFile extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'original_path',
        'original_mime',
        'original_size',
        'original_width',
        'original_height',
        'display_path',
        'display_mime',
        'display_size',
        'display_width',
        'display_height',
        'thumb_path',
        'thumb_mime',
        'thumb_size',
        'thumb_width',
        'thumb_height',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pathForVariant(string $variant): ?string
    {
        return match ($variant) {
            'original' => $this->original_path,
            'display' => $this->display_path ?: $this->original_path,
            'thumb' => $this->thumb_path,
            default => null,
        };
    }

    public function mimeForVariant(string $variant): ?string
    {
        return match ($variant) {
            'original' => $this->original_mime,
            'display' => $this->display_mime ?: $this->original_mime,
            'thumb' => $this->thumb_mime,
            default => null,
        };
    }
}
