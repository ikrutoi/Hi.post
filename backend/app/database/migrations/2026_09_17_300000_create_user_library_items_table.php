<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_library_items', function (Blueprint $table) {
            $table->string('kind', 32);
            $table->string('id', 64);
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->json('payload');
            $table->unsignedBigInteger('client_updated_at');
            $table->timestamps();

            $table->primary(['user_id', 'kind', 'id']);
            $table->index(['user_id', 'kind', 'client_updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_library_items');
    }
};
