<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id('id_booking');
            $table->unsignedTinyInteger('seats_count')->default(1);
            $table->enum('status', ['pending', 'confirmed', 'expired', 'cancelled'])
                  ->default('pending');
            $table->timestamp('expires_at')->nullable();
            $table->foreignId('id_user')
                  ->constrained('users', 'id')
                  ->cascadeOnDelete();
            $table->foreignId('id_screening')
                  ->constrained('screenings', 'id_screening')
                  ->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
