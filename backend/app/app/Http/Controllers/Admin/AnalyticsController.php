<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Postcard;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    public function upcomingStats(): JsonResponse
    {
        $now = Carbon::today();

        $stats = [
            'next_10_days'    => Postcard::whereBetween('send_date', [$now, $now->copy()->addDays(10)])->count(),
            'next_1_month'    => Postcard::whereBetween('send_date', [$now, $now->copy()->addMonth()])->count(),
            'next_6_months'   => Postcard::whereBetween('send_date', [$now, $now->copy()->addMonths(6)])->count(),
            'next_12_months'  => Postcard::whereBetween('send_date', [$now, $now->copy()->addMonths(12)])->count(),
        ];

        return response()->json($stats);
    }

    public function dynamicRange(Request $request): JsonResponse
    {
        $days = (int) $request->query('days', 30);
        $days = min($days, 365); 

        $now = Carbon::today();
        $targetDate = $now->copy()->addDays($days);

        $count = Postcard::whereBetween('send_date', [$now, $targetDate])->count();

        return response()->json([
            'range_days' => $days,
            'orders_count' => $count,
        ]);
    }

    public function userCartAndHubStats(Request $request): JsonResponse
    {
        $user = $request->user();

        $cartItems = Postcard::where('user_id', $user->id)
            ->where('status', 'pending')
            ->get();

        $hubItems = Postcard::where('user_id', $user->id)
            ->where(function ($query) {
                $query->whereNull('send_date')
                    ->orWhere('send_date', '<', Carbon::today());
            })
            ->get();

        $cartCount = $cartItems->count();
        $hubCount = $hubItems->count();

        $averagePrice = $cartItems->avg('price');

        return response()->json([
            'user_id'         => $user->id,
            'cart_count'      => $cartCount,
            'hub_count'       => $hubCount,
            'average_price'   => round($averagePrice ?? 0, 2),
        ]);
    }
}
