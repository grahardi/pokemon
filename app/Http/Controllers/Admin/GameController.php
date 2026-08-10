<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Games/Index', [
            'games' => Game::query()->orderBy('release_date')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Games/Form', ['game' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);
        $data['slug'] = $this->uniqueSlug($data['title']);

        Game::create($data);

        return redirect()->route('admin.games.index')->with('success', 'Game berhasil ditambahkan.');
    }

    public function edit(Game $game): Response
    {
        return Inertia::render('Admin/Games/Form', ['game' => $game]);
    }

    public function update(Request $request, Game $game): RedirectResponse
    {
        $data = $this->validateData($request);

        if ($data['title'] !== $game->title) {
            $data['slug'] = $this->uniqueSlug($data['title'], $game->id);
        }

        $game->update($data);

        return redirect()->route('admin.games.index')->with('success', 'Game berhasil diperbarui.');
    }

    public function destroy(Game $game): RedirectResponse
    {
        $game->delete();

        return redirect()->route('admin.games.index')->with('success', 'Game berhasil dihapus.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'platform' => ['nullable', 'string', 'max:100'],
            'generation' => ['nullable', 'string', 'max:50'],
            'release_date' => ['nullable', 'date'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 1;

        while (Game::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = $base . '-' . (++$i);
        }

        return $slug;
    }
}
