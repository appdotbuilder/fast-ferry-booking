<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateFerryBookingRequest;
use App\Models\FerryBooking;
use Inertia\Inertia;

class AdminBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookings = FerryBooking::with('schedule.route')
            ->latest()
            ->paginate(20);
        
        return Inertia::render('admin/bookings', [
            'bookings' => $bookings
        ]);
    }

    /**
     * Update the specified resource in storage.
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