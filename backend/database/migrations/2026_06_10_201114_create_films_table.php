<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('films', function (Blueprint $table) {
            $table->id('id_film');
            $table->string('title', 255);
            $table->text('synopsis')->nullable();
            $table->unsignedSmallInteger('duration_min')->nullable();
            $table->string('poster', 255)->nullable();
            $table->text('actors')->nullable();
            $table->date('release_date')->nullable();
            $table->enum('status', ['showing', 'coming_soon'])
                  ->default('coming_soon');
            $table->foreignId('id_category')
                  ->nullable()
                  ->constrained('categories', 'id_category')
                  ->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('films');
    }
};
