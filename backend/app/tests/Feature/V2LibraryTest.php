<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class V2LibraryTest extends TestCase
{
    use RefreshDatabase;

    public function test_address_cardtext_and_cardphoto_roundtrip(): void
    {
        $token = $this->postJson('/api/register', [
            'name' => 'Ada',
            'email' => 'ada@hi.com',
            'password' => 'secret12',
        ])->assertCreated()->json('token');

        $this->withToken($token)
            ->putJson('/api/v2/addresses/addr1', [
                'id' => 'addr1',
                'localId' => 3,
                'listStatus' => 'inList',
                'favorite' => true,
                'updatedAt' => 200,
                'address' => [
                    'name' => 'Ada',
                    'street' => '1 Hi St',
                    'zip' => '10115',
                    'city' => 'Berlin',
                    'country' => 'DE',
                ],
            ])
            ->assertOk()
            ->assertJsonPath('address.street', '1 Hi St')
            ->assertJsonPath('updatedAt', 200);

        $this->withToken($token)
            ->putJson('/api/v2/cardtexts/txt1', [
                'id' => 'txt1',
                'status' => 'inLine',
                'title' => 'Hello',
                'plainText' => 'Hi',
                'value' => [['type' => 'paragraph', 'children' => [['text' => 'Hi']]]],
                'style' => ['align' => 'left'],
                'timestamp' => 50,
                'updatedAt' => 90,
            ])
            ->assertOk()
            ->assertJsonPath('plainText', 'Hi');

        $this->withToken($token)
            ->putJson('/api/v2/cardphotos/ph1', [
                'id' => 'ph1',
                'status' => 'inLine',
                'remoteFileId' => 'file-1',
                'url' => 'blob:http://localhost/x',
                'full' => ['url' => 'blob:dead', 'blob' => 'nope'],
                'timestamp' => 10,
                'updatedAt' => 11,
            ])
            ->assertOk()
            ->assertJsonPath('remoteFileId', 'file-1')
            ->assertJsonPath('url', '')
            ->assertJsonMissingPath('full.blob');

        $this->withToken($token)
            ->getJson('/api/v2/addresses')
            ->assertOk()
            ->assertJsonCount(1, 'items');

        $this->withToken($token)
            ->putJson('/api/v2/addresses/addr1', [
                'address' => ['name' => 'stale'],
                'updatedAt' => 100,
            ])
            ->assertOk()
            ->assertJsonPath('address.name', 'Ada');

        $this->withToken($token)
            ->deleteJson('/api/v2/cardtexts/txt1')
            ->assertOk();

        $this->withToken($token)
            ->getJson('/api/v2/cardtexts')
            ->assertJsonCount(0, 'items');
    }

    public function test_unknown_kind_is_not_found(): void
    {
        $token = $this->postJson('/api/register', [
            'name' => 'Ada',
            'email' => 'ada@hi.com',
            'password' => 'secret12',
        ])->assertCreated()->json('token');

        $this->withToken($token)
            ->getJson('/api/v2/senders')
            ->assertNotFound();
    }
}
