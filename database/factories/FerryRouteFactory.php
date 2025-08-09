<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FerryRoute>
 */
class FerryRouteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $origins = ['Jakarta', 'Batam', 'Bintan', 'Tanjung Pinang', 'Singapore'];
        $destinations = ['Jakarta', 'Batam', 'Bintan', 'Tanjung Pinang', 'Singapore'];
        
        $origin = fake()->randomElement($origins);
        $destination = fake()->randomElement(array_diff($destinations, [$origin]));
        
        $facilities = [
            'Air Conditioning',
            'Comfortable Seating',
            'Onboard Toilet',
            'Life Jackets',
            'Entertainment System',
            'Snack Bar',
            'WiFi',
            'Charging Ports'
        ];
        
        return [
            'name' => $origin . ' - ' . $destination,
            'origin' => $origin,
            'destination' => $destination,
            'base_price_adult' => fake()->numberBetween(150000, 500000),
            'base_price_child' => fake()->numberBetween(100000, 300000),
            'duration_hours' => fake()->numberBetween(1, 8),
            'duration_minutes' => fake()->randomElement([0, 15, 30, 45]),
            'facilities' => json_encode(fake()->randomElements($facilities, random_int(3, 6))),
            'cancellation_policy' => 'Cancellation allowed up to 24 hours before departure with 90% refund. Cancellation within 24 hours will result in 50% refund. No refund for no-shows.',
            'is_active' => true,
        ];
    }
}