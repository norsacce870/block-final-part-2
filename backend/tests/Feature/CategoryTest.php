<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_list_categories(): void
    {
        Category::factory()->count(4)->create();

        $this->getJson('/api/categories')
             ->assertStatus(200)
             ->assertJsonCount(4);
    }

    public function test_admin_can_create_a_category(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')
             ->postJson('/api/categories', ['name' => 'Science-Fiction'])
             ->assertStatus(201)
             ->assertJsonPath('name', 'Science-Fiction');

        $this->assertDatabaseHas('categories', ['name' => 'Science-Fiction']);
    }

    public function test_creating_a_category_requires_a_unique_or_valid_name(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')
             ->postJson('/api/categories', ['name' => ''])
             ->assertStatus(422)
             ->assertJsonValidationErrors(['name']);
    }

    public function test_admin_can_update_a_category(): void
    {
        $admin    = User::factory()->create(['role' => 'admin']);
        $category = Category::factory()->create(['name' => 'Horreur']);

        $this->actingAs($admin, 'sanctum')
             ->putJson("/api/categories/{$category->id_category}", ['name' => 'Épouvante'])
             ->assertStatus(200)
             ->assertJsonPath('name', 'Épouvante');
    }

    public function test_admin_can_delete_a_category(): void
    {
        $admin    = User::factory()->create(['role' => 'admin']);
        $category = Category::factory()->create();

        $this->actingAs($admin, 'sanctum')
             ->deleteJson("/api/categories/{$category->id_category}")
             ->assertStatus(204);

        $this->assertDatabaseMissing('categories', ['id_category' => $category->id_category]);
    }

    public function test_regular_user_cannot_create_category(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($user, 'sanctum')
             ->postJson('/api/categories', ['name' => 'Interdit'])
             ->assertStatus(403);
    }

    public function test_guest_cannot_delete_category(): void
    {
        $category = Category::factory()->create();

        $this->deleteJson("/api/categories/{$category->id_category}")
             ->assertStatus(401);
    }
}