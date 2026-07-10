<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@baobab.com'],
            [
                'first_name' => 'Admin',
                'last_name'  => 'Baobab',
                'password'   => Hash::make('password'),
                'role'       => 'admin',
            ]
        );
    }
}
