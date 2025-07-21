<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('image_templates', function (Blueprint $table) {
            $table->enum('type', ['system', 'user'])->default('user')->after('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('image_templates', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
