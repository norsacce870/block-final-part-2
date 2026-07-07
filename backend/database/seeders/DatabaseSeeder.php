<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Room;
use App\Models\Film;
use App\Models\Screening;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'first_name' => 'Admin',
            'last_name'  => 'Baobab',
            'email'      => 'admin@baobab.com',
            'password'   => Hash::make('password'),
            'role'       => 'admin',
        ]);

        // User de test
        User::create([
            'first_name' => 'Marie',
            'last_name'  => 'Grace',
            'email'      => 'user@baobab.com',
            'password'   => Hash::make('password'),
            'role'       => 'user',
        ]);

        // Catégories
        $action   = Category::create(['name' => 'Action']);
        $drama    = Category::create(['name' => 'Drama']);
        $comedy   = Category::create(['name' => 'Comedy']);

        // Salles
        $room1 = Room::create(['name' => 'Salle 1', 'capacity' => 100]);
        $room2 = Room::create(['name' => 'Salle 2', 'capacity' => 80]);

        // Films
        $film1 = Film::create([
            'title'        => 'The Last Horizon',
            'synopsis'     => 'An epic adventure across the universe.',
            'duration_min' => 120,
            'actors'       => 'John Doe, Jane Smith',
            'status'       => 'showing',
            'id_category'  => $action->id_category,
        ]);

        $film2 = Film::create([
            'title'        => 'Silent Waves',
            'synopsis'     => 'A drama about loss and redemption.',
            'duration_min' => 95,
            'actors'       => 'Alice Brown, Bob White',
            'status'       => 'showing',
            'id_category'  => $drama->id_category,
        ]);

        $film3 = Film::create([
            'title'        => 'Coming Soon: Laughter Road',
            'synopsis'     => 'A comedy coming this summer.',
            'duration_min' => 105,
            'actors'       => 'Chris Green',
            'release_date' => '2026-08-15',
            'status'       => 'coming_soon',
            'id_category'  => $comedy->id_category,
        ]);

        // Screenings
        Screening::create([
            'date'            => '2026-06-15',
            'time'            => '18:00',
            'seats_remaining' => 100,
            'id_film'         => $film1->id_film,
            'id_room'         => $room1->id_room,
        ]);

        Screening::create([
            'date'            => '2026-06-15',
            'time'            => '20:30',
            'seats_remaining' => 80,
            'id_film'         => $film2->id_film,
            'id_room'         => $room2->id_room,
        ]);
    }
}
