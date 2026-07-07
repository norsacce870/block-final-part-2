<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class RoomFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'     => fake()->words(2, true),
            'capacity' => fake()->numberBetween(50, 200),
            'format'   => fake()->randomElement(['standard', 'imax', 'vip']),
            'price'    => fake()->randomElement([9.00, 14.00, 22.00]),
        ];
    }
}