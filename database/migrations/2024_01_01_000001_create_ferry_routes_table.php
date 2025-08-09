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
        Schema::create('ferry_routes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Route name (e.g., Jakarta - Batam)');
            $table->string('origin')->comment('Origin port');
            $table->string('destination')->comment('Destination port');
            $table->decimal('base_price_adult', 10, 2)->comment('Base price for adults');
            $table->decimal('base_price_child', 10, 2)->comment('Base price for children');
            $table->integer('duration_hours')->comment('Journey duration in hours');
            $table->integer('duration_minutes')->comment('Journey duration minutes');
            $table->text('facilities')->nullable()->comment('Ferry facilities (JSON)');
            $table->text('cancellation_policy')->nullable()->comment('Cancellation and refund policy');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['origin', 'destination']);
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ferry_routes');
    }
};