<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UserFileTest extends TestCase
{
    use RefreshDatabase;

    public function test_upload_roundtrips_original_and_thumb(): void
    {
        Storage::fake('local');

        $register = $this->postJson('/api/register', [
            'name' => 'Ada',
            'email' => 'ada@hi.com',
            'password' => 'secret12',
        ])->assertCreated();

        $token = $register->json('token');
        $original = UploadedFile::fake()->image('card.jpg', 80, 60);
        $thumb = UploadedFile::fake()->image('thumb.jpg', 24, 24);
        $originalBytes = $original->getContent();
        $thumbBytes = $thumb->getContent();

        $created = $this->withToken($token)
            ->post('/api/files', [
                'original' => $original,
                'thumb' => $thumb,
                'originalWidth' => 80,
                'originalHeight' => 60,
                'thumbWidth' => 24,
                'thumbHeight' => 24,
            ], ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('original.width', 80)
            ->assertJsonPath('thumb.width', 24);

        $id = $created->json('id');
        $this->assertNotEmpty($id);
        $this->assertSame("/api/files/{$id}/display", $created->json('display.url'));

        $this->withToken($token)
            ->get("/api/files/{$id}/original")
            ->assertOk()
            ->assertHeader('content-type', 'image/jpeg');

        $downloadedOriginal = $this->withToken($token)
            ->get("/api/files/{$id}/original")
            ->streamedContent();
        $downloadedThumb = $this->withToken($token)
            ->get("/api/files/{$id}/thumb")
            ->streamedContent();
        $downloadedDisplay = $this->withToken($token)
            ->get("/api/files/{$id}/display")
            ->streamedContent();

        $this->assertSame($originalBytes, $downloadedOriginal);
        $this->assertSame($thumbBytes, $downloadedThumb);
        $this->assertSame($originalBytes, $downloadedDisplay);

        $this->withToken($token)
            ->deleteJson("/api/files/{$id}")
            ->assertOk();

        $this->app['auth']->forgetGuards();

        $this->withToken($token)
            ->getJson("/api/files/{$id}")
            ->assertNotFound();
    }

    public function test_guest_cannot_upload_files(): void
    {
        Storage::fake('local');

        $this->post('/api/files', [
            'original' => UploadedFile::fake()->image('card.jpg'),
        ], ['Accept' => 'application/json'])
            ->assertUnauthorized();
    }
}
