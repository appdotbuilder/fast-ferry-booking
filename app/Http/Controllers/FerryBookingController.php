<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFerryBookingRequest;
use App\Http\Requests\UpdateFerryBookingRequest;
use App\Models\FerryBooking;
use App\Models\FerryRoute;
use App\Models\FerrySchedule;
use Inertia\Inertia;

class FerryBookingController extends Controller
{
    /**
     * Display the ferry booking page.
     */
    public function index()
    {
        $routes = FerryRoute::with('activeSchedules')->active()->get();
        
        return Inertia::render('welcome', [
            'routes' => $routes
        ]);
    }

    /**
     * Get schedules for a specific route.
     */
    public function show(FerryRoute $ferryRoute)
    {
        $schedules = $ferryRoute->activeSchedules()->with('route')->get();
        
        return response()->json([
            'schedules' => $schedules
        ]);
    }

    /**
     * Store a newly created booking.
     */
    public function store(StoreFerryBookingRequest $request)
    {
        $validated = $request->validated();
        
        $schedule = FerrySchedule::with('route')->findOrFail($validated['ferry_schedule_id']);
        
        // Check seat availability
        $totalPassengers = (int) ($validated['adults_count'] + $validated['children_count']);
        $availableSeats = $schedule->getAvailableSeats($validated['travel_date']);
        
        if ($totalPassengers > $availableSeats) {
            return back()->withErrors(['seats' => 'Not enough seats available. Only ' . $availableSeats . ' seats remaining.']);
        }
        
        // Calculate total amount
        $adultPrice = $schedule->adult_price;
        $childPrice = $schedule->child_price;
        $totalAmount = ($validated['adults_count'] * $adultPrice) + ($validated['children_count'] * $childPrice);
        
        // Create booking
        $booking = FerryBooking::create([
            'booking_code' => FerryBooking::generateBookingCode(),
            'ferry_schedule_id' => $validated['ferry_schedule_id'],
            'travel_date' => $validated['travel_date'],
            'passenger_name' => $validated['passenger_name'],
            'passenger_email' => $validated['passenger_email'],
            'passenger_phone' => $validated['passenger_phone'],
            'adults_count' => $validated['adults_count'],
            'children_count' => $validated['children_count'],
            'total_amount' => $totalAmount,
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending',
        ]);
        
        return Inertia::render('booking-confirmation', [
            'booking' => $booking->load('schedule.route'),
            'bankAccount' => [
                'bank' => 'Bank Mandiri',
                'account_number' => '1610003228298',
                'account_name' => 'Ferry Booking System'
            ]
        ]);
    }

    /**
     * Update the specified booking (admin only).
     */
    public function update(UpdateFerryBookingRequest $request, FerryBooking $ferryBooking)
    {
        $validated = $request->validated();
        
        if ($validated['payment_status'] === 'confirmed') {
            $validated['payment_confirmed_at'] = now();
        }
        
        $ferryBooking->update($validated);
        
        return redirect()->route('admin.bookings.index')
            ->with('success', 'Booking updated successfully.');
    }
}