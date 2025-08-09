<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\FerrySchedule
 *
 * @property int $id
 * @property int $ferry_route_id
 * @property string $ferry_name
 * @property string $departure_time
 * @property string $arrival_time
 * @property int $total_seats
 * @property float $price_multiplier
 * @property string|null $special_facilities
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\FerryRoute $route
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\FerryBooking> $bookings
 * @property-read int|null $bookings_count
 * @property-read float $adult_price
 * @property-read float $child_price
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|FerrySchedule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FerrySchedule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FerrySchedule query()
 * @method static \Illuminate\Database\Eloquent\Builder|FerrySchedule active()
 * @method static \Database\Factories\FerryScheduleFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class FerrySchedule extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'ferry_route_id',
        'ferry_name',
        'departure_time',
        'arrival_time',
        'total_seats',
        'price_multiplier',
        'special_facilities',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'ferry_route_id' => 'integer',
        'total_seats' => 'integer',
        'price_multiplier' => 'decimal:2',
        'is_active' => 'boolean',
        'departure_time' => 'datetime:H:i',
        'arrival_time' => 'datetime:H:i',
    ];

    /**
     * Get the route this schedule belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function route(): BelongsTo
    {
        return $this->belongsTo(FerryRoute::class, 'ferry_route_id');
    }

    /**
     * Get the bookings for this schedule.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(FerryBooking::class);
    }

    /**
     * Scope a query to only include active schedules.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the calculated adult price for this schedule.
     *
     * @return float
     */
    public function getAdultPriceAttribute(): float
    {
        return $this->route->base_price_adult * $this->price_multiplier;
    }

    /**
     * Get the calculated child price for this schedule.
     *
     * @return float
     */
    public function getChildPriceAttribute(): float
    {
        return $this->route->base_price_child * $this->price_multiplier;
    }

    /**
     * Get available seats for a specific date.
     *
     * @param string $date
     * @return int
     */
    public function getAvailableSeats(string $date): int
    {
        $bookedSeats = $this->bookings()
            ->where('travel_date', $date)
            ->where('payment_status', '!=', 'cancelled')
            ->sum('adults_count');
        
        $bookedChildSeats = $this->bookings()
            ->where('travel_date', $date)
            ->where('payment_status', '!=', 'cancelled')
            ->sum('children_count');

        return $this->total_seats - ($bookedSeats + $bookedChildSeats);
    }
}