import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { Anchor, Calendar, Clock, MapPin, Users, CreditCard, Ship, Info } from 'lucide-react';

interface FerrySchedule {
    id: number;
    ferry_name: string;
    departure_time: string;
    arrival_time: string;
    total_seats: number;
    price_multiplier: number;
    adult_price: number;
    child_price: number;
    special_facilities: string | null;
}

interface FerryRoute {
    id: number;
    name: string;
    origin: string;
    destination: string;
    base_price_adult: number;
    base_price_child: number;
    duration_hours: number;
    duration_minutes: number;
    duration_formatted: string;
    facilities_array: string[];
    cancellation_policy: string;
    active_schedules: FerrySchedule[];
}

interface Props {
    routes: FerryRoute[];
    [key: string]: unknown;
}

export default function Welcome({ routes }: Props) {
    const [selectedRoute, setSelectedRoute] = useState<FerryRoute | null>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<FerrySchedule | null>(null);
    const [showSchedules, setShowSchedules] = useState(false);
    const [availableSeats, setAvailableSeats] = useState<number | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        ferry_schedule_id: '',
        travel_date: '',
        passenger_name: '',
        passenger_email: '',
        passenger_phone: '',
        adults_count: 1,
        children_count: 0,
        payment_method: 'bank_transfer'
    });

    const handleRouteSelect = (routeId: string) => {
        const route = routes.find(r => r.id.toString() === routeId);
        setSelectedRoute(route || null);
        setSelectedSchedule(null);
        setShowSchedules(true);
        setData('ferry_schedule_id', '');
    };

    const handleScheduleSelect = (scheduleId: string) => {
        if (!selectedRoute) return;
        
        const schedule = selectedRoute.active_schedules.find(s => s.id.toString() === scheduleId);
        setSelectedSchedule(schedule || null);
        setData('ferry_schedule_id', scheduleId);
        
        // Simulate available seats (in real app, this would be an API call)
        setAvailableSeats(schedule ? schedule.total_seats - Math.floor(Math.random() * 50) : null);
    };

    const calculateTotal = () => {
        if (!selectedSchedule) return 0;
        return (data.adults_count * selectedSchedule.adult_price) + (data.children_count * selectedSchedule.child_price);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/bookings');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-3">
                        <Ship className="h-8 w-8 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">🚢 Ferry Booking System</h1>
                            <p className="text-gray-600">Fast, reliable ferry travel across Indonesia</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Booking Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Book Your Ferry Ticket
                                </CardTitle>
                                <CardDescription>
                                    Select your route, schedule, and passenger details
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Route Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="route">Route</Label>
                                        <Select onValueChange={handleRouteSelect}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your route" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {routes.map((route) => (
                                                    <SelectItem key={route.id} value={route.id.toString()}>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4" />
                                                            {route.name} • {route.duration_formatted}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.ferry_schedule_id && (
                                            <p className="text-sm text-red-600">{errors.ferry_schedule_id}</p>
                                        )}
                                    </div>

                                    {/* Schedule Selection */}
                                    {showSchedules && selectedRoute && (
                                        <div className="space-y-2">
                                            <Label>Ferry Schedule</Label>
                                            <div className="grid gap-3">
                                                {selectedRoute.active_schedules.map((schedule) => (
                                                    <div
                                                        key={schedule.id}
                                                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                            selectedSchedule?.id === schedule.id
                                                                ? 'border-blue-500 bg-blue-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                        onClick={() => handleScheduleSelect(schedule.id.toString())}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-semibold flex items-center gap-2">
                                                                    <Anchor className="h-4 w-4" />
                                                                    {schedule.ferry_name}
                                                                </h4>
                                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="h-4 w-4" />
                                                                        {schedule.departure_time} - {schedule.arrival_time}
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Users className="h-4 w-4" />
                                                                        {schedule.total_seats} seats
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-semibold text-blue-600">
                                                                    {formatCurrency(schedule.adult_price)}
                                                                </p>
                                                                <p className="text-xs text-gray-500">per adult</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Travel Date */}
                                    {selectedSchedule && (
                                        <div className="space-y-2">
                                            <Label htmlFor="travel_date">Travel Date</Label>
                                            <Input
                                                id="travel_date"
                                                type="date"
                                                min={new Date().toISOString().split('T')[0]}
                                                value={data.travel_date}
                                                onChange={(e) => setData('travel_date', e.target.value)}
                                                required
                                            />
                                            {errors.travel_date && (
                                                <p className="text-sm text-red-600">{errors.travel_date}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Passenger Count */}
                                    {selectedSchedule && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="adults">Adults</Label>
                                                <Input
                                                    id="adults"
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={data.adults_count}
                                                    onChange={(e) => setData('adults_count', parseInt(e.target.value))}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="children">Children</Label>
                                                <Input
                                                    id="children"
                                                    type="number"
                                                    min="0"
                                                    max="10"
                                                    value={data.children_count}
                                                    onChange={(e) => setData('children_count', parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Passenger Details */}
                                    {selectedSchedule && data.travel_date && (
                                        <div className="space-y-4">
                                            <h3 className="font-semibold">Passenger Details</h3>
                                            <div className="grid gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <Input
                                                        id="name"
                                                        value={data.passenger_name}
                                                        onChange={(e) => setData('passenger_name', e.target.value)}
                                                        placeholder="Enter main passenger name"
                                                        required
                                                    />
                                                    {errors.passenger_name && (
                                                        <p className="text-sm text-red-600">{errors.passenger_name}</p>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="email">Email</Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={data.passenger_email}
                                                            onChange={(e) => setData('passenger_email', e.target.value)}
                                                            placeholder="your@email.com"
                                                            required
                                                        />
                                                        {errors.passenger_email && (
                                                            <p className="text-sm text-red-600">{errors.passenger_email}</p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone">Phone Number</Label>
                                                        <Input
                                                            id="phone"
                                                            value={data.passenger_phone}
                                                            onChange={(e) => setData('passenger_phone', e.target.value)}
                                                            placeholder="+62 812 3456 7890"
                                                            required
                                                        />
                                                        {errors.passenger_phone && (
                                                            <p className="text-sm text-red-600">{errors.passenger_phone}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Payment Method */}
                                    {selectedSchedule && data.passenger_name && (
                                        <div className="space-y-2">
                                            <Label>Payment Method</Label>
                                            <div className="grid gap-3">
                                                <div
                                                    className={`border rounded-lg p-4 cursor-pointer ${
                                                        data.payment_method === 'bank_transfer' 
                                                            ? 'border-blue-500 bg-blue-50' 
                                                            : 'border-gray-200'
                                                    }`}
                                                    onClick={() => setData('payment_method', 'bank_transfer')}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <CreditCard className="h-5 w-5" />
                                                        <div>
                                                            <h4 className="font-medium">Bank Transfer</h4>
                                                            <p className="text-sm text-gray-600">Transfer to Mandiri 1610003228298</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`border rounded-lg p-4 cursor-pointer ${
                                                        data.payment_method === 'office' 
                                                            ? 'border-blue-500 bg-blue-50' 
                                                            : 'border-gray-200'
                                                    }`}
                                                    onClick={() => setData('payment_method', 'office')}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <MapPin className="h-5 w-5" />
                                                        <div>
                                                            <h4 className="font-medium">Pay at Office</h4>
                                                            <p className="text-sm text-gray-600">Manual payment at ferry terminal</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    {selectedSchedule && data.passenger_name && (
                                        <Button 
                                            type="submit" 
                                            size="lg" 
                                            className="w-full" 
                                            disabled={processing}
                                        >
                                            {processing ? 'Processing...' : `Book Now - ${formatCurrency(calculateTotal())}`}
                                        </Button>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Route Info */}
                        {selectedRoute && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-5 w-5" />
                                        Route Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold">{selectedRoute.name}</h4>
                                        <p className="text-sm text-gray-600">Duration: {selectedRoute.duration_formatted}</p>
                                    </div>
                                    
                                    <div>
                                        <h5 className="font-medium mb-2">Facilities</h5>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            {selectedRoute.facilities_array.map((facility, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                                    {facility}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <h5 className="font-medium mb-2">Cancellation Policy</h5>
                                        <p className="text-sm text-gray-600">{selectedRoute.cancellation_policy}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Seat Availability */}
                        {availableSeats !== null && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Seat Availability
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">{availableSeats}</div>
                                        <p className="text-sm text-gray-600">seats available</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Features */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Why Choose Us?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        🚀 Fast & reliable ferries
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        💺 Comfortable seating
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        🔒 Safe & secure travel
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        💳 Flexible payment options
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}