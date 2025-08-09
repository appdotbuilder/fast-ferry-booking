<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ferry_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ferry_route_id')->constrained()->cascadeOnDelete();
            $table->string('ferry_name')->comment('Name of the ferry');
            $table->time('departure_time')->comment('Daily departure time');
            $table->time('arrival_time')->comment('Daily arrival time');
            $table->integer('total_seats')->comment('Total available seats');
            $table->decimal('price_multiplier', 3, 2)->default(1.00)->comment('Price multiplier for this schedule');
            $table->text('special_facilities')->nullable()->comment('Special facilities for this ferry');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['ferry_route_id', 'departure_time']);
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ferry_schedules');
    }
};