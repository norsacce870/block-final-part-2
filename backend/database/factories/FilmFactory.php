<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class FilmFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title'        => fake()->words(3, true),
            'synopsis'     => fake()->paragraph(),
            'duration_min' => fake()->numberBetween(80, 180),
            'actors'       => fake()->name() . ', ' . fake()->name(),
            'director'     => fake()->name(),
            'release_date' => fake()->date(),
            'trailer_url'  => null,
            'status'       => fake()->randomElement(['showing', 'coming_soon']),
            'id_category'  => Category::factory(),
        ];
    }

    public function showing(): static
    {
        return $this->state(['status' => 'showing']);
    }

    public function comingSoon(): static
    {
        return $this->state(['status' => 'coming_soon']);
    }
}