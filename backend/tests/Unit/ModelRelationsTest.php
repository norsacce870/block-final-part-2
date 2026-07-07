<?php

namespace Tests\Unit;

use App\Models\Booking;
use App\Models\Category;
use App\Models\Film;
use App\Models\Room;
use App\Models\Screening;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelRelationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_film_belongs_to_a_category(): void
    {
        $category = Category::factory()->create();
        $film     = Film::factory()->create(['id_category' => $category->id_category]);

        $this->assertTrue($film->category->is($category));
    }

    public function test_category_has_many_films(): void
    {
        $category = Category::factory()->create();
        Film::factory()->count(3)->create(['id_category' => $category->id_category]);

        $this->assertCount(3, $category->films);
    }

    public function test_film_has_many_screenings(): void
    {
        $film = Film::factory()->create();
        Screening::factory()->count(2)->create(['id_film' => $film->id_film]);

        $this->assertCount(2, $film->screenings);
    }

    public function test_screening_belongs_to_a_film_and_a_room(): void
    {
        $film      = Film::factory()->create();
        $room      = Room::factory()->create();
        $screening = Screening::factory()->create([
            'id_film' => $film->id_film,
            'id_room' => $room->id_room,
        ]);

        $this->assertTrue($screening->film->is($film));
        $this->assertTrue($screening->room->is($room));
    }

    public function test_room_has_many_screenings(): void
    {
        $room = Room::factory()->create();
        Screening::factory()->count(4)->create(['id_room' => $room->id_room]);

        $this->assertCount(4, $room->screenings);
    }

    public function test_booking_belongs_to_a_user_and_a_screening(): void
    {
        $user      = User::factory()->create();
        $screening = Screening::factory()->create();
        $booking   = Booking::factory()->create([
            'id_user'      => $user->id,
            'id_screening' => $screening->id_screening,
        ]);

        $this->assertTrue($booking->user->is($user));
        $this->assertTrue($booking->screening->is($screening));
    }

    public function test_user_has_many_bookings(): void
    {
        $user = User::factory()->create();
        Booking::factory()->count(2)->create(['id_user' => $user->id]);

        $this->assertCount(2, $user->bookings);
    }

    public function test_screening_has_many_bookings(): void
    {
        $screening = Screening::factory()->create();
        Booking::factory()->count(3)->create(['id_screening' => $screening->id_screening]);

        $this->assertCount(3, $screening->bookings);
    }
}