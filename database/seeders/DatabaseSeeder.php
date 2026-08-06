<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'lipangbenjoy41@gmail.com',
            'password' => Hash::make('bench1914'),
            'email_verified_at' => now(),
        ]);
    }
}