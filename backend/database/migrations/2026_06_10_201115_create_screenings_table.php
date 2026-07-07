<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('screenings', function (Blueprint $table) {
            $table->id('id_screening');
            $table->date('date');
            $table->time('time');
            $table->unsignedSmallInteger('seats_remaining');
            $table->foreignId('id_film')
                  ->constrained('films', 'id_film')
                  ->cascadeOnDelete();
            $table->foreignId('id_room')
                  ->constrained('rooms', 'id_room')
                  ->restrictOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('screenings');
    }
};
