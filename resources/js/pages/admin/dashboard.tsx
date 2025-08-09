import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Ship, Clock, CheckCircle, Calendar, MapPin } from 'lucide-react';

interface FerryRoute {
    id: number;
    name: string;
    origin: string;
    destination: string;
}

interface FerrySchedule {
    id: number;
    ferry_name: string;
    departure_time: string;
    route: FerryRoute;
}

interface FerryBooking {
    id: number;
    booking_code: string;
    travel_date: string;
    passenger_name: string;
    adults_count: number;
    children_count: number;
    total_amount: number;
    payment_status: string;
    created_at: string;
    schedule: FerrySchedule;
}

interface Stats {
    total_bookings: number;
    pending_bookings: number;
    confirmed_bookings: number;
    total_routes: number;
}

interface Props {
    stats: Stats;
    recentBookings: FerryBooking[];
    [key: string]: unknown;
}

export default function AdminDashboard({ stats, recentBookings }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppShell>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">🚢 Ferry Admin Dashboard</h1>
                    <p className="text-gray-600">Manage bookings, routes, and schedules</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_bookings}</div>
                            <p className="text-xs text-muted-foreground">All time bookings</p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending_bookings}</div>
                            <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.confirmed_bookings}</div>
                            <p className="text-xs text-muted-foreground">Payments confirmed</p>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
                            <Ship className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_routes}</div>
                            <p className="text-xs text-muted-foreground">Ferry routes</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Bookings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Bookings</CardTitle>
                        <CardDescription>Latest ferry bookings from customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentBookings.length > 0 ? (
                                recentBookings.map((booking) => (
                                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold">{booking.booking_code}</h4>
                                                <Badge className={getStatusColor(booking.payment_status)}>
                                                    {booking.payment_status}
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {booking.passenger_name}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {booking.schedule.route.name}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(booking.travel_date)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                                <span>Ferry: {booking.schedule.ferry_name}</span>
                                                <span>Passengers: {booking.adults_count + booking.children_count}</span>
                                                <span className="font-semibold text-blue-600">
                                                    {formatCurrency(booking.total_amount)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatDate(booking.created_at)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Ship className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No recent bookings found</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}