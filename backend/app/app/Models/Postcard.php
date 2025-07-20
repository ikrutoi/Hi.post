<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Postcard extends Model
{
    protected $fillable = [
        'user_id', 'image_path', 'message', 'send_date', 'price', 'status',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function image() {
        return $this->asOne(ImageTemplate::class);
    }

    public function text() {
        return $this->hasOne(TextTemplate::class);
    }

    public function senderAddress() {
        return $this->hasOne(SenderTemplate::class);
    }

    public function recipientAddress() {
        return $this->hasOne(RecipientTemplate::class);
    }
}
