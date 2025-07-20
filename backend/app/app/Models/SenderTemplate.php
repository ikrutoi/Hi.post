<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SenderTemplate extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'address_line',
        'city',
        'zip',
        'country',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function postcards()
    {
        return $this->hasMany(Postcard::class);
    }
}
