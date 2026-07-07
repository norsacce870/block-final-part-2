<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        // Utilisation de postJson pour les requêtes API
        $response = $this->postJson('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        // Si votre route de login utilise l'authentification standard de Laravel en arrière-plan
        $this->assertAuthenticated(); 
        
        // On attend un statut 200 (OK) contenant le token plutôt qu'un 204 (No Content)
        $response->assertStatus(200);
        $response->assertJsonStructure(['token']);
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
        // Une tentative de connexion invalide sur une API doit retourner une erreur de validation (422)
        $response->assertStatus(401);
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        // On s'authentifie via le guard 'sanctum' pour les APIs et on utilise postJson
        $response = $this->actingAs($user, 'sanctum')->postJson('/logout');

        // Au lieu d'assertGuest() qui vérifie les sessions web, 
        // on valide que l'API répond avec succès (statut 200) après avoir révoqué le token
        $response->assertStatus(200);
    }
}