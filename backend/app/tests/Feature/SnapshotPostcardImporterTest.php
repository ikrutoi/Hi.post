<?php

namespace Tests\Feature;

use App\Domain\Postcard\SnapshotPostcardImporter;
use App\Models\User;
use App\Models\UserPostcard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SnapshotPostcardImporterTest extends TestCase
{
    use RefreshDatabase;

    public function test_imports_snapshot_rows_when_user_has_no_v2(): void
    {
        $user = User::factory()->create();
        $imported = (new SnapshotPostcardImporter)->importList($user->id, [
            [
                'id' => 'from-snap',
                'status' => 'ready',
                'price' => '3.00',
                'localId' => 4,
                'createdAt' => 10,
                'updatedAt' => 20,
                'date' => ['year' => 2026, 'month' => 9, 'day' => 18],
                'postcard' => [
                    'cardphoto' => 'img',
                    'cardtext' => '',
                    'recipient' => '',
                    'aroma' => '0',
                ],
                'card' => [
                    'id' => 'from-snap',
                    'thumbnailUrl' => 'blob:http://localhost/x',
                    'cardphoto' => [
                        'appliedData' => ['blob' => 'drop-me', 'full' => ['url' => 'blob:dead']],
                    ],
                ],
            ],
            [
                'id' => 'bad-status',
                'status' => 'draft',
                'card' => ['id' => 'bad-status'],
            ],
        ]);

        $this->assertSame(1, $imported);
        $row = UserPostcard::query()->where('user_id', $user->id)->first();
        $this->assertNotNull($row);
        $this->assertSame('from-snap', $row->id);
        $this->assertSame('ready', $row->status);
        $this->assertSame(2026, $row->dispatch_year);
        $this->assertArrayNotHasKey('blob', $row->payload['card']['cardphoto']['appliedData']);
        $this->assertSame('', $row->payload['card']['thumbnailUrl']);
    }

    public function test_skips_import_when_v2_already_has_rows(): void
    {
        $user = User::factory()->create();
        UserPostcard::query()->create([
            'id' => 'existing',
            'user_id' => $user->id,
            'status' => 'cart',
            'price' => '',
            'local_id' => 1,
            'dispatch_year' => 2026,
            'dispatch_month' => 1,
            'dispatch_day' => 1,
            'payload' => ['postcard' => [], 'card' => ['id' => 'existing']],
            'client_created_at' => 1,
            'client_updated_at' => 1,
        ]);

        $imported = (new SnapshotPostcardImporter)->importList($user->id, [
            [
                'id' => 'from-snap',
                'status' => 'ready',
                'createdAt' => 1,
                'updatedAt' => 1,
                'date' => ['year' => 2026, 'month' => 1, 'day' => 2],
                'card' => ['id' => 'from-snap'],
            ],
        ]);

        $this->assertSame(0, $imported);
        $this->assertSame(1, UserPostcard::query()->where('user_id', $user->id)->count());
    }
}
