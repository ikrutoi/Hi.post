<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class V2PostcardTest extends TestCase
{
    use RefreshDatabase;

    public function test_upsert_list_and_delete_roundtrip(): void
    {
        $token = $this->postJson('/api/register', [
            'name' => 'Ada',
            'email' => 'ada@hi.com',
            'password' => 'secret12',
        ])->assertCreated()->json('token');

        $id = 'pc_phase3_one';
        $body = [
            'status' => 'cart',
            'price' => '1.20',
            'localId' => 7,
            'createdAt' => 1700000000000,
            'updatedAt' => 1700000001000,
            'date' => ['year' => 2026, 'month' => 9, 'day' => 17],
            'postcard' => [
                'cardphoto' => 'img1',
                'cardtext' => 'txt1',
                'recipient' => 'rec1',
                'aroma' => '0',
            ],
            'card' => [
                'id' => $id,
                'thumbnailUrl' => 'blob:http://localhost/dead',
                'cardphoto' => [
                    'appliedData' => [
                        'id' => 'img1',
                        'remoteFileId' => 'file-uuid',
                        'blob' => 'should-drop',
                        'full' => ['url' => 'blob:http://localhost/x', 'blob' => 'nope'],
                    ],
                ],
                'envelope' => [
                    'recipient' => ['applied' => ['rec1']],
                    'isComplete' => true,
                ],
            ],
        ];

        $this->withToken($token)
            ->putJson("/api/v2/postcards/{$id}", $body)
            ->assertOk()
            ->assertJsonPath('id', $id)
            ->assertJsonPath('status', 'cart')
            ->assertJsonPath('localId', 7)
            ->assertJsonPath('card.cardphoto.appliedData.remoteFileId', 'file-uuid')
            ->assertJsonMissingPath('card.cardphoto.appliedData.blob')
            ->assertJsonPath('card.thumbnailUrl', '')
            ->assertJsonPath('card.cardphoto.appliedData.full.url', '');

        $this->withToken($token)
            ->getJson('/api/v2/postcards')
            ->assertOk()
            ->assertJsonCount(1, 'postcards')
            ->assertJsonPath('postcards.0.id', $id);

        $this->withToken($token)
            ->putJson("/api/v2/postcards/{$id}", array_merge($body, [
                'status' => 'ready',
                'updatedAt' => 1700000002000,
            ]))
            ->assertOk()
            ->assertJsonPath('status', 'ready');

        $this->withToken($token)
            ->getJson('/api/v2/postcards')
            ->assertJsonCount(1, 'postcards');

        $this->withToken($token)
            ->deleteJson("/api/v2/postcards/{$id}")
            ->assertOk();

        $this->withToken($token)
            ->getJson('/api/v2/postcards')
            ->assertJsonCount(0, 'postcards');
    }

    public function test_stale_upsert_does_not_overwrite_newer_row(): void
    {
        $token = $this->postJson('/api/register', [
            'name' => 'Ada',
            'email' => 'ada@hi.com',
            'password' => 'secret12',
        ])->assertCreated()->json('token');

        $id = 'pc_lww';
        $base = [
            'status' => 'cart',
            'price' => '1',
            'localId' => 1,
            'createdAt' => 100,
            'date' => ['year' => 2026, 'month' => 9, 'day' => 17],
            'postcard' => [
                'cardphoto' => '',
                'cardtext' => '',
                'recipient' => '',
                'aroma' => '0',
            ],
            'card' => ['id' => $id, 'thumbnailUrl' => ''],
        ];

        $this->withToken($token)
            ->putJson("/api/v2/postcards/{$id}", array_merge($base, [
                'status' => 'ready',
                'updatedAt' => 200,
            ]))
            ->assertOk()
            ->assertJsonPath('status', 'ready');

        $this->withToken($token)
            ->putJson("/api/v2/postcards/{$id}", array_merge($base, [
                'status' => 'cart',
                'updatedAt' => 150,
            ]))
            ->assertOk()
            ->assertJsonPath('status', 'ready')
            ->assertJsonPath('updatedAt', 200);
    }

    public function test_guest_cannot_write_v2_postcards(): void
    {
        $this->putJson('/api/v2/postcards/x', [
            'status' => 'cart',
            'createdAt' => 1,
            'updatedAt' => 1,
            'date' => ['year' => 2026, 'month' => 1, 'day' => 1],
            'card' => ['id' => 'x'],
        ])->assertUnauthorized();
    }

    public function test_snapshot_write_is_gone(): void
    {
        $token = $this->postJson('/api/register', [
            'name' => 'Ada',
            'email' => 'ada@hi.com',
            'password' => 'secret12',
        ])->assertCreated()->json('token');

        $this->withToken($token)
            ->putJson('/api/sync/postcards', [
                'version' => 1,
                'exportedAt' => now()->toIso8601String(),
                'postcards' => [],
            ])
            ->assertStatus(410);
    }
}
