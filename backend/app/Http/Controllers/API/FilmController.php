<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Film;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FilmController extends Controller
{
    public function index(Request $request)
    {
        $query = Film::with('category')->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        if ($request->has('page')) {
            return response()->json($query->paginate(15));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'synopsis'     => 'nullable|string',
            'duration_min' => 'nullable|integer|min:1',
            'poster'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'actors'       => 'nullable|string',
            'director' => 'nullable|string|max:255',
            'release_date' => 'nullable|date',
            'status'       => 'required|in:showing,coming_soon',
            'id_category'  => 'nullable|exists:categories,id_category',
            'trailer_url' => 'nullable|url|max:500',
        ]);

        if ($request->hasFile('poster')) {
            $path = $request->file('poster')->store('posters', 'public');
            $validated['poster'] = $path;
        }

        $film = Film::create($validated);

        return response()->json($film->load('category'), 201);
    }

    public function show(Film $film)
    {
        return response()->json($film->load('category'));
    }

    public function update(Request $request, Film $film)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'synopsis'     => 'nullable|string',
            'duration_min' => 'nullable|integer|min:1',
            'poster'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'actors'       => 'nullable|string',
            'director' => 'nullable|string|max:255',
            'release_date' => 'nullable|date',
            'status'       => 'required|in:showing,coming_soon',
            'id_category'  => 'nullable|exists:categories,id_category',
            'trailer_url' => 'nullable|url|max:500',
        ]);

        if ($request->hasFile('poster')) {
            if ($film->poster) {
                Storage::disk('public')->delete($film->poster);
            }
            $path = $request->file('poster')->store('posters', 'public');
            $validated['poster'] = $path;
        }

        $film->update($validated);

        return response()->json($film->load('category'));
    }

    public function destroy(Film $film)
    {
        $film->delete();

        return response()->json(null, 204);
    }
}
