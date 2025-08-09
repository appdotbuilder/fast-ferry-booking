<?php

namespace Database\Factories;

use App\Models\FerryRoute;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FerrySchedule>
 */
class FerryScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $ferryNames = [
            'Sea Explorer',
            'Ocean Breeze',
            'Island Hopper',
            'Wave Rider',
            'Coral Princess',
            'Maritime Express',
            'Blue Horizon',
            'Seafarer',
            'Tide Runner',
            'Pacific Dream'
        ];
        
        $departureHour = fake()->numberBetween(6, 20);
        $departureMinute = fake()->randomElement([0, 30]);
        $departureTime = sprintf('%02d:%02d', $departureHour, $departureMinute);
        
        // Calculate arrival time (add route duration)
        $route = FerryRoute::inRandomOrder()->first();
        if ($route) {
            $arrivalHour = $departureHour + $route->duration_hours;
            $arrivalMinute = $departureMinute + $route->duration_minutes;
            
            if ($arrivalMinute >= 60) {
                $arrivalHour += 1;
                $arrivalMinute -= 60;
            }
            
            $arrivalTime = sprintf('%02d:%02d', $arrivalHour, $arrivalMinute);
        } else {
            $arrivalTime = sprintf('%02d:%02d', $departureHour + 2, $departureMinute);
        }
        
        return [
            'ferry_route_id' => FerryRoute::factory(),
            'ferry_name' => fake()->randomElement($ferryNames),
            'departure_time' => $departureTime,
            'arrival_time' => $arrivalTime,
            'total_seats' => fake()->numberBetween(50, 200),
            'price_multiplier' => fake()->randomFloat(2, 0.8, 1.5),
            'special_facilities' => fake()->optional()->sentence(),
            'is_active' => true,
        ];
    }
}