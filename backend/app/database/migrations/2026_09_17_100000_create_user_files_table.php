<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_files', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('original_path');
            $table->string('original_mime', 64);
            $table->unsignedInteger('original_size');
            $table->unsignedInteger('original_width')->nullable();
            $table->unsignedInteger('original_height')->nullable();
            $table->string('display_path')->nullable();
            $table->string('display_mime', 64)->nullable();
            $table->unsignedInteger('display_size')->nullable();
            $table->unsignedInteger('display_width')->nullable();
            $table->unsignedInteger('display_height')->nullable();
            $table->string('thumb_path')->nullable();
            $table->string('thumb_mime', 64)->nullable();
            $table->unsignedInteger('thumb_size')->nullable();
            $table->unsignedInteger('thumb_width')->nullable();
            $table->unsignedInteger('thumb_height')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_files');
    }
};
