<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_users_can_register(): void
{
    $response = $this->postJson('/api/register', [ // Utilisation de postJson pour les APIs
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    // On vérifie le statut 201 créé par le contrôleur
    $response->assertStatus(201);
    
    // On s'assure que le token et la structure de l'utilisateur sont bien renvoyés
    $response->assertJsonStructure([
        'token',
        'user' => [
            'id',
            'first_name',
            'last_name',
            'email',
            'role'
        ]
    ]);
}




}
