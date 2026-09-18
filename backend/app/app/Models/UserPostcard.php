<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPostcard extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'status',
        'price',
        'local_id',
        'dispatch_year',
        'dispatch_month',
        'dispatch_day',
        'payload',
        'client_created_at',
        'client_updated_at',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'local_id' => 'integer',
            'dispatch_year' => 'integer',
            'dispatch_month' => 'integer',
            'dispatch_day' => 'integer',
            'client_created_at' => 'integer',
            'client_updated_at' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function dispatchDate(): ?Carbon
    {
        $year = (int) $this->dispatch_year;
        $month = (int) $this->dispatch_month;
        $day = (int) $this->dispatch_day;
        if ($year < 1 || $month < 1 || $day < 1) {
            return null;
        }

        $date = Carbon::createSafe($year, $month, $day);
        if ($date === false) {
            return null;
        }

        return $date->startOfDay();
    }

    public function priceAmount(): float
    {
        return (float) str_replace(',', '.', (string) $this->price);
    }
}
