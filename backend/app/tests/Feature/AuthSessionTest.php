<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthSessionTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_returns_account_passport_payload(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Ada',
            'email' => 'ada@hi.com',
            'password' => 'secret12',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('user.name', 'Ada')
            ->assertJsonPath('user.email', 'ada@hi.com')
            ->assertJsonPath('user.passportEmblemForm', 'triangles')
            ->assertJsonStructure([
                'token',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'avatarUrl',
                    'passportColors',
                    'passportEmblemForm',
                    'passportCode',
                ],
            ]);

        $this->assertCount(24, $response->json('user.passportColors'));
    }

    public function test_login_me_update_and_logout(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Ada',
            'email' => 'ada@hi.com',
            'password' => 'secret12',
        ])->assertCreated();

        $login = $this->postJson('/api/login', [
            'email' => 'ada@hi.com',
            'password' => 'secret12',
        ])->assertOk();

        $token = $login->json('token');

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('email', 'ada@hi.com')
            ->assertJsonPath('passportEmblemForm', 'triangles');

        $this->withToken($token)
            ->patchJson('/api/me', [
                'name' => 'Ada Lovelace',
                'passportEmblemForm' => 'waves',
            ])
            ->assertOk()
            ->assertJsonPath('name', 'Ada Lovelace')
            ->assertJsonPath('passportEmblemForm', 'waves');

        $this->withToken($token)
            ->postJson('/api/logout')
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);

        $this->app['auth']->forgetGuards();

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertUnauthorized();
    }

    public function test_inactive_user_cannot_read_me(): void
    {
        $user = User::factory()->create([
            'is_active' => false,
            'role' => 'user',
        ]);
        $token = $user->createToken('HiPostToken')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertForbidden();
    }
}
