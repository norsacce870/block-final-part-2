<?php

use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\RoomController;
use App\Http\Controllers\API\FilmController;
use App\Http\Controllers\API\ScreeningController;
use App\Http\Controllers\API\BookingController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;


// Routes publiques
Route::get('/films', [FilmController::class, 'index']);
Route::get('/films/{film}', [FilmController::class, 'show']);
Route::get('/screenings', [ScreeningController::class, 'index']);
Route::get('/screenings/{screening}', [ScreeningController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

// Routes utilisateur connecté
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);
    Route::put('/user', [UserController::class, 'update']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);
});

// Routes admin uniquement
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::apiResource('/categories', CategoryController::class)
        ->except(['index']);
    Route::apiResource('/rooms', RoomController::class);
    Route::apiResource('/films', FilmController::class)
        ->except(['index', 'show']);
    Route::apiResource('/screenings', ScreeningController::class)
        ->except(['index', 'show']);
    Route::put('/bookings/{booking}', [BookingController::class, 'update']);
});
