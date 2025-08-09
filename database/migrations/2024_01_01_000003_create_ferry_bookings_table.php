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
        Schema::create('ferry_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code', 10)->unique()->comment('Unique booking reference');
            $table->foreignId('ferry_schedule_id')->constrained()->cascadeOnDelete();
            $table->date('travel_date')->comment('Date of travel');
            $table->string('passenger_name')->comment('Main passenger name');
            $table->string('passenger_email')->comment('Contact email');
            $table->string('passenger_phone')->comment('Contact phone');
            $table->integer('adults_count')->comment('Number of adult passengers');
            $table->integer('children_count')->default(0)->comment('Number of child passengers');
            $table->decimal('total_amount', 10, 2)->comment('Total booking amount');
            $table->enum('payment_method', ['office', 'bank_transfer'])->comment('Payment method chosen');
            $table->enum('payment_status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $table->text('payment_notes')->nullable()->comment('Admin notes for payment validation');
            $table->timestamp('payment_confirmed_at')->nullable();
            $table->timestamps();
            
            $table->index(['ferry_schedule_id', 'travel_date']);
            $table->index('booking_code');
            $table->index('payment_status');
            $table->index('travel_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ferry_bookings');
    }
};