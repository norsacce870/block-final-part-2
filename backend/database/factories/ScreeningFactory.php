<?php

namespace Database\Factories;

use App\Models\Film;
use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

class ScreeningFactory extends Factory
{
    public function definition(): array
    {
        return [
            'date'            => fake()->dateTimeBetween('+1 day', '+30 days')->format('Y-m-d'),
            'time'            => fake()->time('H:i:s'),
            'seats_remaining' => 80,
            'id_film'         => Film::factory(),
            'id_room'         => Room::factory(),
        ];
    }

    public function today(string $time = '20:00:00'): static
    {
        return $this->state([
            'date' => now()->format('Y-m-d'),
            'time' => $time,
        ]);
    }

    public function full(): static
    {
        return $this->state(['seats_remaining' => 0]);
    }
}
