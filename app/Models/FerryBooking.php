<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\FerryBooking
 *
 * @property int $id
 * @property string $booking_code
 * @property int $ferry_schedule_id
 * @property string $travel_date
 * @property string $passenger_name
 * @property string $passenger_email
 * @property string $passenger_phone
 * @property int $adults_count
 * @property int $children_count
 * @property float $total_amount
 * @property string $payment_method
 * @property string $payment_status
 * @property string|null $payment_notes
 * @property \Illuminate\Support\Carbon|null $payment_confirmed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\FerrySchedule $schedule
 * @property-read int $total_passengers
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|FerryBooking newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FerryBooking newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FerryBooking query()
 * @method static \Illuminate\Database\Eloquent\Builder|FerryBooking pending()
 * @method static \Illuminate\Database\Eloquent\Builder|FerryBooking confirmed()
 * @method static \Database\Factories\FerryBookingFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class FerryBooking extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'booking_code',
        'ferry_schedule_id',
        'travel_date',
        'passenger_name',
        'passenger_email',
        'passenger_phone',
        'adults_count',
        'children_count',
        'total_amount',
        'payment_method',
        'payment_status',
        'payment_notes',
        'payment_confirmed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'ferry_schedule_id' => 'integer',
        'travel_date' => 'date',
        'adults_count' => 'integer',
        'children_count' => 'integer',
        'total_amount' => 'decimal:2',
        'payment_confirmed_at' => 'datetime',
    ];

    /**
     * Get the schedule this booking belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function schedule(): BelongsTo
    {
        return $this->belongsTo(FerrySchedule::class, 'ferry_schedule_id');
    }

    /**
     * Scope a query to only include pending bookings.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending($query)
    {
        return $query->where('payment_status', 'pending');
    }

    /**
     * Scope a query to only include confirmed bookings.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeConfirmed($query)
    {
        return $query->where('payment_status', 'confirmed');
    }

    /**
     * Get the total number of passengers.
     *
     * @return int
     */
    public function getTotalPassengersAttribute(): int
    {
        return $this->adults_count + $this->children_count;
    }

    /**
     * Generate a unique booking code.
     *
     * @return string
     */
    public static function generateBookingCode(): string
    {
        do {
            $code = 'FB' . random_int(10000000, 99999999);
        } while (self::where('booking_code', $code)->exists());

        return $code;
    }
}