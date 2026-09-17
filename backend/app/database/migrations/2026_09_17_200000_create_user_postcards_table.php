<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_postcards', function (Blueprint $table) {
            $table->string('id', 64);
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('status', 32);
            $table->string('price')->default('');
            $table->unsignedInteger('local_id')->default(0);
            $table->unsignedSmallInteger('dispatch_year')->default(0);
            $table->unsignedTinyInteger('dispatch_month')->default(0);
            $table->unsignedTinyInteger('dispatch_day')->default(0);
            $table->json('payload');
            $table->unsignedBigInteger('client_created_at');
            $table->unsignedBigInteger('client_updated_at');
            $table->timestamps();

            $table->primary(['user_id', 'id']);
            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'client_updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_postcards');
    }
};
