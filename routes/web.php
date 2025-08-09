<?php

use App\Http\Controllers\AdminBookingController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\FerryBookingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Ferry booking routes (public)
Route::get('/', [FerryBookingController::class, 'index'])->name('home');
Route::get('/routes/{ferryRoute}/schedules', [FerryBookingController::class, 'show'])->name('ferry.schedules');
Route::post('/bookings', [FerryBookingController::class, 'store'])->name('bookings.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Admin routes (require authentication)
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/bookings', [AdminBookingController::class, 'index'])->name('bookings.index');
        Route::patch('/bookings/{ferryBooking}', [AdminBookingController::class, 'update'])->name('bookings.update');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
