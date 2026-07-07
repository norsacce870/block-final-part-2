<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Screening;
use Illuminate\Http\Request;

class ScreeningController extends Controller
{
    public function index()
    {
        return response()->json(
            Screening::with(['film', 'room'])->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date'            => 'required|date',
            'time'            => 'required|date_format:H:i',
            'seats_remaining' => 'required|integer|min:0',
            'id_film'         => 'required|exists:films,id_film',
            'id_room'         => 'required|exists:rooms,id_room',
        ]);

        $screening = Screening::create($validated);

        return response()->json($screening->load(['film', 'room']), 201);
    }

    public function show(Screening $screening)
    {
        return response()->json($screening->load(['film', 'room']));
    }

    public function update(Request $request, Screening $screening)
    {
        $validated = $request->validate([
            'date'            => 'required|date',
            'time'            => 'required|date_format:H:i',
            'seats_remaining' => 'required|integer|min:0',
            'id_film'         => 'required|exists:films,id_film',
            'id_room'         => 'required|exists:rooms,id_room',
        ]);

        $screening->update($validated);

        return response()->json($screening->load(['film', 'room']));
    }

    public function destroy(Screening $screening)
    {
        $screening->delete();

        return response()->json(null, 204);
    }
}
