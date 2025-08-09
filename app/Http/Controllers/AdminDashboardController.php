<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\FerryBooking;
use App\Models\FerryRoute;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        $stats = [
            'total_bookings' => FerryBooking::count(),
            'pending_bookings' => FerryBooking::pending()->count(),
            'confirmed_bookings' => FerryBooking::confirmed()->count(),
            'total_routes' => FerryRoute::active()->count(),
        ];
        
        $recentBookings = FerryBooking::with('schedule.route')
            ->latest()
            ->take(10)
            ->get();
        
        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings
        ]);
    }
}