<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Screening;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->isAdmin()) {
            $query = Booking::with(['user', 'screening.film', 'screening.room'])
                ->orderByDesc('created_at');

            if ($request->has('page')) {
                return response()->json($query->paginate(15));
            }

            return response()->json($query->get());
        }

        return response()->json(
            Booking::with(['screening.film', 'screening.room'])
                ->where('id_user', $user->id)
                ->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'seats_count'  => 'required|integer|min:1',
            'id_screening' => 'required|exists:screenings,id_screening',
        ]);

        try {
            $booking = DB::transaction(function () use ($validated) {
                // Verrou pessimiste : bloque la ligne le temps de la transaction pour que
                // deux réservations concurrentes sur la même séance ne lisent jamais le
                // même seats_remaining avant d'écrire (évite la surréservation).
                $screening = Screening::where('id_screening', $validated['id_screening'])
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($screening->seats_remaining < $validated['seats_count']) {
                    throw new \DomainException('Not enough seats available.');
                }

                $screeningDateTime = \Carbon\Carbon::parse($screening->date . ' ' . $screening->time);
                $expiresAt = $screeningDateTime->subHours(3);

                if ($expiresAt->isPast()) {
                    throw new \DomainException('Cette séance débute dans moins de 3h. Réservez sur place.');
                }

                $booking = Booking::create([
                    'seats_count'  => $validated['seats_count'],
                    'status'       => 'pending',
                    'expires_at'   => $expiresAt,
                    'id_user'      => Auth::id(),
                    'id_screening' => $validated['id_screening'],
                ]);

                $screening->decrement('seats_remaining', $validated['seats_count']);

                return $booking;
            });
        } catch (\DomainException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json($booking->load(['screening.film', 'screening.room']), 201);
    }

    public function show(Booking $booking)
    {
        if ($booking->id_user !== Auth::id() && !Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($booking->load(['screening.film', 'screening.room']));
    }

    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,expired,cancelled',
        ]);

        $oldStatus = $booking->status;
        $booking->update($validated);

        if (
            in_array($validated['status'], ['expired', 'cancelled'])
            && !in_array($oldStatus, ['expired', 'cancelled'])
        ) {
            $booking->screening->increment('seats_remaining', $booking->seats_count);
        }

        return response()->json($booking->load(['screening.film', 'screening.room']));
    }

    public function destroy(Booking $booking)
    {
        if ($booking->id_user !== Auth::id() && !Auth::user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if (!in_array($booking->status, ['expired', 'cancelled'])) {
            $booking->screening->increment('seats_remaining', $booking->seats_count);
        }

        $booking->delete();

        return response()->json(null, 204);
    }
}
