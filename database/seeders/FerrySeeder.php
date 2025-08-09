<?php

namespace Database\Seeders;

use App\Models\FerryRoute;
use App\Models\FerrySchedule;
use App\Models\FerryBooking;
use Illuminate\Database\Seeder;

class FerrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create ferry routes with realistic data
        $routes = [
            [
                'name' => 'Jakarta - Batam',
                'origin' => 'Jakarta',
                'destination' => 'Batam',
                'base_price_adult' => 350000,
                'base_price_child' => 250000,
                'duration_hours' => 12,
                'duration_minutes' => 0,
                'facilities' => json_encode(['Air Conditioning', 'Comfortable Seating', 'Onboard Restaurant', 'Entertainment System', 'WiFi']),
                'cancellation_policy' => 'Free cancellation up to 24 hours before departure. 50% refund for cancellations within 24 hours.',
                'is_active' => true,
            ],
            [
                'name' => 'Batam - Singapore',
                'origin' => 'Batam',
                'destination' => 'Singapore',
                'base_price_adult' => 180000,
                'base_price_child' => 120000,
                'duration_hours' => 1,
                'duration_minutes' => 30,
                'facilities' => json_encode(['Air Conditioning', 'Comfortable Seating', 'Life Jackets', 'Onboard Toilet']),
                'cancellation_policy' => 'Cancellation allowed up to 2 hours before departure with 80% refund.',
                'is_active' => true,
            ],
            [
                'name' => 'Tanjung Pinang - Bintan',
                'origin' => 'Tanjung Pinang',
                'destination' => 'Bintan',
                'base_price_adult' => 45000,
                'base_price_child' => 30000,
                'duration_hours' => 0,
                'duration_minutes' => 45,
                'facilities' => json_encode(['Life Jackets', 'Basic Seating', 'Onboard Toilet']),
                'cancellation_policy' => 'No refund for cancellations within 1 hour of departure.',
                'is_active' => true,
            ],
        ];

        foreach ($routes as $routeData) {
            $route = FerryRoute::create($routeData);
            
            // Create schedules for each route
            $schedules = [
                [
                    'ferry_name' => 'Sea Explorer',
                    'departure_time' => '08:00',
                    'arrival_time' => '20:00',
                    'total_seats' => 150,
                    'price_multiplier' => 1.0,
                ],
                [
                    'ferry_name' => 'Ocean Breeze',
                    'departure_time' => '14:00',
                    'arrival_time' => '02:00',
                    'total_seats' => 120,
                    'price_multiplier' => 1.2,
                ],
            ];

            foreach ($schedules as $scheduleData) {
                // Adjust arrival time based on route duration
                $depTime = explode(':', $scheduleData['departure_time']);
                $arrHour = (int)$depTime[0] + $route->duration_hours;
                $arrMinute = (int)$depTime[1] + $route->duration_minutes;
                
                if ($arrMinute >= 60) {
                    $arrHour += 1;
                    $arrMinute -= 60;
                }
                
                $scheduleData['arrival_time'] = sprintf('%02d:%02d', $arrHour % 24, $arrMinute);
                $scheduleData['ferry_route_id'] = $route->id;
                $scheduleData['is_active'] = true;
                
                FerrySchedule::create($scheduleData);
            }
        }

        // Create some sample bookings
        FerryBooking::factory(20)->create();
    }
}