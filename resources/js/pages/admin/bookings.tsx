import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { router } from '@inertiajs/react';
import { Users, MapPin, Calendar, CreditCard, CheckCircle, X } from 'lucide-react';

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
    passenger_email: string;
    passenger_phone: string;
    adults_count: number;
    children_count: number;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    payment_notes: string | null;
    created_at: string;
    schedule: FerrySchedule;
}

interface PaginationData {
    data: FerryBooking[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    bookings: PaginationData;
    [key: string]: unknown;
}

export default function AdminBookings({ bookings }: Props) {
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

    const handleStatusUpdate = (bookingId: number, newStatus: string) => {
        router.patch(`/admin/bookings/${bookingId}`, {
            payment_status: newStatus,
            payment_notes: newStatus === 'confirmed' ? 'Payment verified by admin' : 'Cancelled by admin'
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AppShell>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">📋 Booking Management</h1>
                    <p className="text-gray-600">Manage and validate ferry bookings</p>
                </div>

                {/* Bookings List */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Bookings</CardTitle>
                        <CardDescription>
                            Total {bookings.total} bookings • Page {bookings.current_page} of {bookings.last_page}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {bookings.data.length > 0 ? (
                                bookings.data.map((booking) => (
                                    <div key={booking.id} className="border rounded-lg p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-semibold">{booking.booking_code}</h3>
                                                <Badge className={getStatusColor(booking.payment_status)}>
                                                    {booking.payment_status}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-2">
                                                {booking.payment_status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Confirm
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            Cancel
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Passenger</p>
                                                <p className="font-medium flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    {booking.passenger_name}
                                                </p>
                                                <p className="text-sm text-gray-600">{booking.passenger_email}</p>
                                                <p className="text-sm text-gray-600">{booking.passenger_phone}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-600">Route</p>
                                                <p className="font-medium flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {booking.schedule.route.name}
                                                </p>
                                                <p className="text-sm text-gray-600">Ferry: {booking.schedule.ferry_name}</p>
                                                <p className="text-sm text-gray-600">Departure: {booking.schedule.departure_time}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-600">Travel Details</p>
                                                <p className="font-medium flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {formatDate(booking.travel_date)}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {booking.adults_count} adult{booking.adults_count > 1 ? 's' : ''}
                                                    {booking.children_count > 0 && `, ${booking.children_count} child${booking.children_count > 1 ? 'ren' : ''}`}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-600">Payment</p>
                                                <p className="font-semibold text-lg text-blue-600">
                                                    {formatCurrency(booking.total_amount)}
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                    <CreditCard className="h-3 w-3" />
                                                    {booking.payment_method === 'bank_transfer' ? 'Bank Transfer' : 'Office Payment'}
                                                </p>
                                                <p className="text-xs text-gray-500">Booked: {formatDate(booking.created_at)}</p>
                                            </div>
                                        </div>

                                        {booking.payment_notes && (
                                            <div className="bg-gray-50 rounded p-3 mt-4">
                                                <p className="text-sm">
                                                    <strong>Notes:</strong> {booking.payment_notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">No bookings found</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {bookings.last_page > 1 && (
                            <div className="flex justify-center mt-6 space-x-2">
                                {Array.from({ length: bookings.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === bookings.current_page ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => router.get(`/admin/bookings?page=${page}`)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}