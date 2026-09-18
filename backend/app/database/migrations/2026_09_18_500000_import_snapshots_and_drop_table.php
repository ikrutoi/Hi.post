<?php

use App\Domain\Postcard\SnapshotPostcardImporter;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('user_postcard_snapshots')) {
            $importer = new SnapshotPostcardImporter;

            foreach (DB::table('user_postcard_snapshots')->orderBy('id')->get() as $row) {
                $payload = $row->payload;
                if (is_string($payload)) {
                    $payload = json_decode($payload, true) ?? [];
                }
                if (! is_array($payload)) {
                    continue;
                }
                $postcards = $payload['postcards'] ?? [];
                if (! is_array($postcards)) {
                    continue;
                }
                $importer->importList((int) $row->user_id, $postcards);
            }

            Schema::drop('user_postcard_snapshots');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('user_postcard_snapshots')) {
            return;
        }

        Schema::create('user_postcard_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('payload_version')->default(1);
            $table->json('payload');
            $table->timestamps();
        });
    }
};
