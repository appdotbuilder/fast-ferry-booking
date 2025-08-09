<?php

namespace Database\Factories;

use App\Models\FerryBooking;
use App\Models\FerrySchedule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FerryBooking>
 */
class FerryBookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $adultsCount = fake()->numberBetween(1, 4);
        $childrenCount = fake()->numberBetween(0, 3);
        
        return [
            'booking_code' => FerryBooking::generateBookingCode(),
            'ferry_schedule_id' => FerrySchedule::factory(),
            'travel_date' => fake()->dateTimeBetween('now', '+30 days')->format('Y-m-d'),
            'passenger_name' => fake()->name(),
            'passenger_email' => fake()->safeEmail(),
            'passenger_phone' => fake()->phoneNumber(),
            'adults_count' => $adultsCount,
            'children_count' => $childrenCount,
            'total_amount' => fake()->numberBetween(200000, 1500000),
            'payment_method' => fake()->randomElement(['office', 'bank_transfer']),
            'payment_status' => fake()->randomElement(['pending', 'confirmed', 'cancelled']),
            'payment_notes' => fake()->optional()->sentence(),
            'payment_confirmed_at' => fake()->optional()->dateTimeBetween('-7 days', 'now'),
        ];
    }
}