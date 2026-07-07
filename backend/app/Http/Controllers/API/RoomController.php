<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        return response()->json(Room::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:100|unique:rooms,name',
            'capacity' => 'required|integer|min:1',
            'format' => 'required|in:standard,imax,vip',
            'price'  => 'required|numeric|min:0',
        ]);

        $room = Room::create($validated);

        return response()->json($room, 201);
    }

    public function show(Room $room)
    {
        return response()->json($room);
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:100|unique:rooms,name,' . $room->id_room . ',id_room',
            'capacity' => 'required|integer|min:1',
            'format' => 'required|in:standard,imax,vip',
            'price'  => 'required|numeric|min:0',
        ]);

        $room->update($validated);

        return response()->json($room);
    }

    public function destroy(Room $room)
    {
        $room->delete();

        return response()->json(null, 204);
    }
}
