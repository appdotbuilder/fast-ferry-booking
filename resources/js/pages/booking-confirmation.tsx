import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, MapPin, Users, CreditCard, Copy, Phone, Mail, Calendar, Anchor } from 'lucide-react';

interface BankAccount {
    bank: string;
    account_number: string;
    account_name: string;
}

interface FerryRoute {
    id: number;
    name: string;
    origin: string;
    destination: string;
    duration_formatted: string;
    cancellation_policy: string;
}

interface FerrySchedule {
    id: number;
    ferry_name: string;
    departure_time: string;
    arrival_time: string;
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
    schedule: FerrySchedule;
}

interface Props {
    booking: FerryBooking;
    bankAccount: BankAccount;
    [key: string]: unknown;
}

export default function BookingConfirmation({ booking, bankAccount }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">✅ Booking Confirmed!</h1>
                            <p className="text-gray-600">Your ferry ticket has been reserved</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Booking Status */}
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                    <div>
                                        <h3 className="font-semibold text-green-900">Booking Reserved</h3>
                                        <p className="text-green-700">Booking Code: <strong>{booking.booking_code}</strong></p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                    Payment Pending
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Booking Details */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Anchor className="h-5 w-5" />
                                        Trip Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-lg font-semibold">
                                            <MapPin className="h-5 w-5 text-blue-600" />
                                            {booking.schedule.route.name}
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">Ferry</p>
                                                <p className="font-medium">{booking.schedule.ferry_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Duration</p>
                                                <p className="font-medium">{booking.schedule.route.duration_formatted}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">Departure</p>
                                                <p className="font-medium">{booking.schedule.departure_time}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Arrival</p>
                                                <p className="font-medium">{booking.schedule.arrival_time}</p>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-600" />
                                                <span className="font-medium">{formatDate(booking.travel_date)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Passenger Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-gray-600 text-sm">Main Passenger</p>
                                        <p className="font-medium">{booking.passenger_name}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Email</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {booking.passenger_email}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Phone</p>
                                            <p className="font-medium flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {booking.passenger_phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600">Adults</p>
                                                <p className="font-medium">{booking.adults_count} passenger{booking.adults_count > 1 ? 's' : ''}</p>
                                            </div>
                                            {booking.children_count > 0 && (
                                                <div>
                                                    <p className="text-gray-600">Children</p>
                                                    <p className="font-medium">{booking.children_count} passenger{booking.children_count > 1 ? 's' : ''}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Payment Information */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Payment Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center py-4">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {formatCurrency(booking.total_amount)}
                                        </div>
                                        <p className="text-gray-600">Total Amount</p>
                                    </div>

                                    {booking.payment_method === 'bank_transfer' ? (
                                        <div className="space-y-4">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-semibold text-blue-900 mb-3">Bank Transfer Details</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">Bank:</span>
                                                        <span className="font-medium">{bankAccount.bank}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">Account Number:</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono font-medium">{bankAccount.account_number}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => copyToClipboard(bankAccount.account_number)}
                                                                className="h-6 w-6 p-0"
                                                            >
                                                                <Copy className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-600">Account Name:</span>
                                                        <span className="font-medium">{bankAccount.account_name}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <div className="flex items-start gap-2">
                                                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                                                    <div className="text-sm">
                                                        <p className="font-medium text-yellow-900">Payment Instructions:</p>
                                                        <ol className="mt-2 space-y-1 text-yellow-800 list-decimal list-inside">
                                                            <li>Transfer the exact amount to the bank account above</li>
                                                            <li>Use booking code <strong>{booking.booking_code}</strong> as reference</li>
                                                            <li>Send payment confirmation to our WhatsApp</li>
                                                            <li>Payment will be verified within 1-2 hours</li>
                                                        </ol>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                                                <div className="text-sm">
                                                    <p className="font-medium text-green-900">Office Payment:</p>
                                                    <p className="mt-1 text-green-800">
                                                        Please pay at the ferry terminal counter before departure. 
                                                        Show this booking code: <strong>{booking.booking_code}</strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Important Notes */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Important Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                                            <span>Please arrive at the terminal 30 minutes before departure</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                                            <span>Bring valid ID for all passengers</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                                            <span>Keep this booking confirmation until your trip is complete</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                                            <span>{booking.schedule.route.cancellation_policy}</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-4">
                        <Button onClick={() => window.print()} variant="outline">
                            Print Confirmation
                        </Button>
                        <Button onClick={() => window.location.href = '/'}>
                            Book Another Trip
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}