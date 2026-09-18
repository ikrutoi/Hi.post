<?php

namespace Tests\Feature;

use App\Models\UserPostcard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnalyticsV2Test extends TestCase
{
    use RefreshDatabase;

    public function test_stats_read_user_postcards_not_legacy_table(): void
    {
        $register = $this->postJson('/api/register', [
            'name' => 'Ada',
            'email' => 'ada@hi.com',
            'password' => 'secret12',
        ])->assertCreated();

        $token = $register->json('token');
        $userId = $register->json('user.id');
        $soon = now()->addDays(4);

        $this->insertRow($userId, 'pc-cart', 'cart', '1.50', $soon);
        $this->insertRow($userId, 'pc-ready', 'ready', '2.00', $soon);
        $this->insertRow($userId, 'pc-old', 'sent', '9.00', now()->subYear());

        $this->getJson('/api/analytics/users')
            ->assertOk()
            ->assertJsonPath('total_users', 1)
            ->assertJsonPath('postcards', 3)
            ->assertJsonPath('by_status.cart', 1)
            ->assertJsonPath('by_status.ready', 1)
            ->assertJsonPath('by_status.sent', 1);

        $this->getJson('/api/analytics/upcoming')
            ->assertOk()
            ->assertJsonPath('next_10_days', 2);

        $this->getJson('/api/analytics/range?days=10')
            ->assertOk()
            ->assertJsonPath('range_days', 10)
            ->assertJsonPath('orders_count', 2);

        $this->withToken($token)
            ->getJson('/api/analytics/user-postcard-stats')
            ->assertOk()
            ->assertJsonPath('cart_count', 1)
            ->assertJsonPath('hub_count', 2)
            ->assertJsonPath('average_price', 1.5);
    }

    private function insertRow(
        int $userId,
        string $id,
        string $status,
        string $price,
        \DateTimeInterface $dispatch,
    ): void {
        UserPostcard::query()->create([
            'id' => $id,
            'user_id' => $userId,
            'status' => $status,
            'price' => $price,
            'local_id' => 1,
            'dispatch_year' => (int) $dispatch->format('Y'),
            'dispatch_month' => (int) $dispatch->format('n'),
            'dispatch_day' => (int) $dispatch->format('j'),
            'payload' => ['postcard' => [], 'card' => ['id' => $id]],
            'client_created_at' => 1,
            'client_updated_at' => 1,
        ]);
    }
}
