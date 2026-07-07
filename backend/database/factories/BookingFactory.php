<?php

namespace Database\Factories;

use App\Models\Screening;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'seats_count'  => fake()->numberBetween(1, 4),
            'status'       => 'pending',
            'expires_at'   => now()->addHours(3),
            'id_user'      => User::factory(),
            'id_screening' => Screening::factory(),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(['status' => 'confirmed']);
    }

    public function cancelled(): static
    {
        return $this->state(['status' => 'cancelled']);
    }

    public function expired(): static
    {
        return $this->state([
            'status'     => 'expired',
            'expires_at' => now()->subHour(),
        ]);
    }
}
