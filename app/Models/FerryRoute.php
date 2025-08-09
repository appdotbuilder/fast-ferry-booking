<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\FerryRoute
 *
 * @property int $id
 * @property string $name
 * @property string $origin
 * @property string $destination
 * @property float $base_price_adult
 * @property float $base_price_child
 * @property int $duration_hours
 * @property int $duration_minutes
 * @property string|null $facilities
 * @property string|null $cancellation_policy
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\FerrySchedule> $schedules
 * @property-read int|null $schedules_count
 * @property-read string $duration_formatted
 * @property-read array $facilities_array
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|FerryRoute newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FerryRoute newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|FerryRoute query()
 * @method static \Illuminate\Database\Eloquent\Builder|FerryRoute active()
 * @method static \Database\Factories\FerryRouteFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class FerryRoute extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'origin',
        'destination',
        'base_price_adult',
        'base_price_child',
        'duration_hours',
        'duration_minutes',
        'facilities',
        'cancellation_policy',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'base_price_adult' => 'decimal:2',
        'base_price_child' => 'decimal:2',
        'duration_hours' => 'integer',
        'duration_minutes' => 'integer',
        'is_active' => 'boolean',
        'facilities' => 'json',
    ];

    /**
     * Get the schedules for this route.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(FerrySchedule::class);
    }

    /**
     * Get active schedules for this route.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function activeSchedules(): HasMany
    {
        return $this->hasMany(FerrySchedule::class)->where('is_active', true);
    }

    /**
     * Scope a query to only include active routes.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get formatted duration string.
     *
     * @return string
     */
    public function getDurationFormattedAttribute(): string
    {
        $hours = $this->duration_hours;
        $minutes = $this->duration_minutes;
        
        if ($hours > 0 && $minutes > 0) {
            return "{$hours}h {$minutes}m";
        } elseif ($hours > 0) {
            return "{$hours}h";
        } else {
            return "{$minutes}m";
        }
    }

    /**
     * Get facilities as array.
     *
     * @return array
     */
    public function getFacilitiesArrayAttribute(): array
    {
        return $this->facilities ? json_decode($this->facilities, true) : [];
    }
}