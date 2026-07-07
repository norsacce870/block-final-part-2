<?php

namespace Tests\Feature;

use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoomTest extends TestCase
{
    use RefreshDatabase;

    // Contrairement aux films/séances/catégories, les salles n'ont AUCUNE
    // route publique : tout le CRUD (y compris index) est sous le middleware
    // admin dans routes/api.php.

    public function test_guest_cannot_list_rooms(): void
    {
        Room::factory()->count(2)->create();

        $this->getJson('/api/rooms')->assertStatus(401);
    }

    public function test_regular_user_cannot_list_rooms(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        Room::factory()->count(2)->create();

        $this->actingAs($user, 'sanctum')
             ->getJson('/api/rooms')
             ->assertStatus(403);
    }

    public function test_admin_can_list_rooms(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Room::factory()->count(3)->create();

        $this->actingAs($admin, 'sanctum')
             ->getJson('/api/rooms')
             ->assertStatus(200)
             ->assertJsonCount(3);
    }

    public function test_admin_can_create_a_room(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/rooms', [
                'name'     => 'Salle 5',
                'capacity' => 120,
                'format'   => 'imax',
                'price'    => 14.00,
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('rooms', ['name' => 'Salle 5', 'capacity' => 120]);
    }

    public function test_admin_can_update_a_room(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $room  = Room::factory()->create(['capacity' => 100]);

        $this->actingAs($admin, 'sanctum')
             ->putJson("/api/rooms/{$room->id_room}", [
                 'name'     => $room->name,
                 'capacity' => 150,
                 'format'   => $room->format,
                 'price'    => $room->price,
             ])
             ->assertStatus(200)
             ->assertJsonPath('capacity', 150);
    }

    public function test_admin_can_delete_a_room(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $room  = Room::factory()->create();

        $this->actingAs($admin, 'sanctum')
             ->deleteJson("/api/rooms/{$room->id_room}")
             ->assertStatus(204);

        $this->assertDatabaseMissing('rooms', ['id_room' => $room->id_room]);
    }
}