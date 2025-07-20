<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImageTemplate extends Model
{
protected $fillable = [
        'user_id',
        'title',
        'image_path',
        'mime_type',
        'size',
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
