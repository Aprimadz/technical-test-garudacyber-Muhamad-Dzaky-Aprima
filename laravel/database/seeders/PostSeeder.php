<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user1 = User::factory()->create([
            'name' => 'Budi',
            'email' => 'budi@gmail.com',
            'password' => bcrypt('password123'),
        ]);

        $user2 = User::factory()->create([
            'name' => 'Rudi',
            'email' => 'rudi@gmail.com',
            'password' => bcrypt('rudi123')
        ]);

        Post::factory(12)->create(['user_id' => $user1->id]);
        Post::factory(12)->create(['user_id' => $user2->id]);
    }
}
