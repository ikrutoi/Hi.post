<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Postcard\BackendCanon;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserPostcard;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Admin/stats over IndexedDB-canon `user_postcards`, not frozen `postcards`.
 */
class AnalyticsController extends Controller
{
    /** @var list<string> */
    private const CART_STATUSES = ['cart', 'cartBlocked'];

    /** @var list<string> */
    private const HUB_STATUSES = ['ready', 'sent', 'delivered', 'error'];

    public function userStats(): JsonResponse
    {
        $byStatus = UserPostcard::query()
            ->selectRaw('status, count(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        return response()->json([
            'total_users' => User::query()->count(),
            'active_users' => User::query()->where('is_active', true)->count(),
            'postcards' => UserPostcard::query()->count(),
            'by_status' => collect(BackendCanon::POSTCARD_STATUSES)
                ->mapWithKeys(fn (string $status) => [$status => (int) ($byStatus[$status] ?? 0)]),
        ]);
    }

    public function upcomingStats(): JsonResponse
    {
        $now = Carbon::today();

        return response()->json([
            'next_10_days' => $this->countDispatchBetween($now, $now->copy()->addDays(10)),
            'next_1_month' => $this->countDispatchBetween($now, $now->copy()->addMonth()),
            'next_6_months' => $this->countDispatchBetween($now, $now->copy()->addMonths(6)),
            'next_12_months' => $this->countDispatchBetween($now, $now->copy()->addMonths(12)),
        ]);
    }

    public function dynamicRange(Request $request): JsonResponse
    {
        $days = min((int) $request->query('days', 30), 365);
        $now = Carbon::today();
        $targetDate = $now->copy()->addDays($days);

        return response()->json([
            'range_days' => $days,
            'orders_count' => $this->countDispatchBetween($now, $targetDate),
        ]);
    }

    public function userCartAndHubStats(Request $request): JsonResponse
    {
        $rows = UserPostcard::query()
            ->where('user_id', $request->user()->id)
            ->get();

        $cartItems = $rows->whereIn('status', self::CART_STATUSES);
        $hubItems = $rows->whereIn('status', self::HUB_STATUSES);

        return response()->json([
            'user_id' => $request->user()->id,
            'cart_count' => $cartItems->count(),
            'hub_count' => $hubItems->count(),
            'average_price' => round(
                $cartItems->avg(fn (UserPostcard $row) => $row->priceAmount()) ?? 0,
                2,
            ),
        ]);
    }

    private function countDispatchBetween(Carbon $from, Carbon $to): int
    {
        $start = $from->copy()->startOfDay();
        $end = $to->copy()->endOfDay();

        return UserPostcard::query()
            ->get()
            ->filter(function (UserPostcard $row) use ($start, $end) {
                $date = $row->dispatchDate();

                return $date !== null && $date->betweenIncluded($start, $end);
            })
            ->count();
    }
}
