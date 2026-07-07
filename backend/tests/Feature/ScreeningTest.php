<?php

namespace Tests\Feature;

use App\Models\Film;
use App\Models\Room;
use App\Models\Screening;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScreeningTest extends TestCase
{
    use RefreshDatabase;

    // ── Public endpoints ──────────────────────────────────────────────────────

    public function test_anyone_can_list_screenings(): void
    {
        Screening::factory()->count(3)->create();

        $this->getJson('/api/screenings')
             ->assertStatus(200)
             ->assertJsonCount(3);
    }

    public function test_anyone_can_view_a_single_screening(): void
    {
        $screening = Screening::factory()->create();

        $this->getJson("/api/screenings/{$screening->id_screening}")
             ->assertStatus(200)
             ->assertJsonPath('id_screening', $screening->id_screening);
    }

    public function test_viewing_nonexistent_screening_returns_404(): void
    {
        $this->getJson('/api/screenings/9999')->assertStatus(404);
    }

    // ── Admin CRUD ────────────────────────────────────────────────────────────

    public function test_admin_can_create_a_screening(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $film  = Film::factory()->create();
        $room  = Room::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/screenings', [
                'date'            => now()->addDays(2)->format('Y-m-d'),
                'time'            => '20:00',
                'seats_remaining' => 80,
                'id_film'         => $film->id_film,
                'id_room'         => $room->id_room,
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('screenings', [
            'id_film' => $film->id_film,
            'id_room' => $room->id_room,
        ]);
    }

    public function test_creating_a_screening_requires_valid_time_format(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $film  = Film::factory()->create();
        $room  = Room::factory()->create();

        $this->actingAs($admin, 'sanctum')
             ->postJson('/api/screenings', [
                 'date'            => now()->addDays(2)->format('Y-m-d'),
                 'time'            => '20h00', // format invalide
                 'seats_remaining' => 80,
                 'id_film'         => $film->id_film,
                 'id_room'         => $room->id_room,
             ])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['time']);
    }

    public function test_creating_a_screening_requires_an_existing_film(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $room  = Room::factory()->create();

        $this->actingAs($admin, 'sanctum')
             ->postJson('/api/screenings', [
                 'date'            => now()->addDays(2)->format('Y-m-d'),
                 'time'            => '20:00',
                 'seats_remaining' => 80,
                 'id_film'         => 9999,
                 'id_room'         => $room->id_room,
             ])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['id_film']);
    }

    public function test_admin_can_update_a_screening(): void
    {
        $admin     = User::factory()->create(['role' => 'admin']);
        $screening = Screening::factory()->create(['seats_remaining' => 80]);

        $this->actingAs($admin, 'sanctum')
             ->putJson("/api/screenings/{$screening->id_screening}", [
                 'date'            => $screening->date,
                 'time'            => substr($screening->time, 0, 5),
                 'seats_remaining' => 60,
                 'id_film'         => $screening->id_film,
                 'id_room'         => $screening->id_room,
             ])
             ->assertStatus(200)
             ->assertJsonPath('seats_remaining', 60);
    }

    public function test_admin_can_delete_a_screening(): void
    {
        $admin     = User::factory()->create(['role' => 'admin']);
        $screening = Screening::factory()->create();

        $this->actingAs($admin, 'sanctum')
             ->deleteJson("/api/screenings/{$screening->id_screening}")
             ->assertStatus(204);

        $this->assertDatabaseMissing('screenings', ['id_screening' => $screening->id_screening]);
    }

    // ── Authorization ─────────────────────────────────────────────────────────

    public function test_regular_user_cannot_create_screening(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $film = Film::factory()->create();
        $room = Room::factory()->create();

        $this->actingAs($user, 'sanctum')
             ->postJson('/api/screenings', [
                 'date'            => now()->addDays(2)->format('Y-m-d'),
                 'time'            => '20:00',
                 'seats_remaining' => 80,
                 'id_film'         => $film->id_film,
                 'id_room'         => $room->id_room,
             ])
             ->assertStatus(403);
    }

    public function test_regular_user_cannot_delete_screening(): void
    {
        $user      = User::factory()->create(['role' => 'user']);
        $screening = Screening::factory()->create();

        $this->actingAs($user, 'sanctum')
             ->deleteJson("/api/screenings/{$screening->id_screening}")
             ->assertStatus(403);
    }

    public function test_guest_cannot_create_screening(): void
    {
        $film = Film::factory()->create();
        $room = Room::factory()->create();

        $this->postJson('/api/screenings', [
            'date'            => now()->addDays(2)->format('Y-m-d'),
            'time'            => '20:00',
            'seats_remaining' => 80,
            'id_film'         => $film->id_film,
            'id_room'         => $room->id_room,
        ])->assertStatus(401);
    }
}