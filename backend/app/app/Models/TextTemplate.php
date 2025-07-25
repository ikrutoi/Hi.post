<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TextTemplate extends Model
{
    protected $fillable = ['user_id', 'title', 'content'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
