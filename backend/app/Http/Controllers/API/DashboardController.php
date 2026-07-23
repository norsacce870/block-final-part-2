<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Film;
use App\Models\Screening;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'films_showing'      => Film::where('status', 'showing')->count(),
            'films_coming_soon'  => Film::where('status', 'coming_soon')->count(),
            'screenings_count'   => Screening::count(),
            'bookings_total'     => Booking::count(),
            'bookings_pending'   => Booking::where('status', 'pending')->count(),
            'bookings_confirmed' => Booking::where('status', 'confirmed')->count(),
            'recent_bookings'    => Booking::with(['user', 'screening.film', 'screening.room'])
                ->orderByDesc('created_at')
                ->limit(6)
                ->get(),
        ]);
    }
}
