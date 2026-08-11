<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TrainerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Trainers/Index', [
            'trainers' => Trainer::query()->orderBy('order')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Trainers/Form', ['trainer' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);
        $data['image_url'] = $this->handleFileUpload($request, 'image', 'trainers') ?? $data['image_url'];
        $data['pick_sound_url'] = $this->handleFileUpload($request, 'pick_sound', 'trainers/sounds') ?? $data['pick_sound_url'];

        Trainer::create($data);

        return redirect()->route('admin.trainers.index')->with('success', 'Trainer berhasil ditambahkan.');
    }

    public function edit(Trainer $trainer): Response
    {
        return Inertia::render('Admin/Trainers/Form', ['trainer' => $trainer]);
    }

    public function update(Request $request, Trainer $trainer): RedirectResponse
    {
        $data = $this->validateData($request);

        $uploadedImage = $this->handleFileUpload($request, 'image', 'trainers');
        if ($uploadedImage) {
            $this->deleteOldFile($trainer->image_url, '/storage/trainers/');
            $data['image_url'] = $uploadedImage;
        }

        $uploadedSound = $this->handleFileUpload($request, 'pick_sound', 'trainers/sounds');
        if ($uploadedSound) {
            $this->deleteOldFile($trainer->pick_sound_url, '/storage/trainers/sounds/');
            $data['pick_sound_url'] = $uploadedSound;
        }

        $trainer->update($data);

        return redirect()->route('admin.trainers.index')->with('success', 'Trainer berhasil diperbarui.');
    }

    public function destroy(Trainer $trainer): RedirectResponse
    {
        $this->deleteOldFile($trainer->image_url, '/storage/trainers/');
        $this->deleteOldFile($trainer->pick_sound_url, '/storage/trainers/sounds/');

        $trainer->delete();

        return redirect()->route('admin.trainers.index')->with('success', 'Trainer berhasil dihapus.');
    }

    public function resetSound(Trainer $trainer): RedirectResponse
    {
        $this->deleteOldFile($trainer->pick_sound_url, '/storage/trainers/sounds/');
        $trainer->update(['pick_sound_url' => null]);

        return redirect()->route('admin.trainers.edit', $trainer)->with('success', 'Suara pilih dikembalikan ke default global.');
    }

    private function handleFileUpload(Request $request, string $field, string $folder): ?string
    {
        if (! $request->hasFile($field)) {
            return null;
        }

        $path = $request->file($field)->store($folder, 'public');

        return '/storage/' . $path;
    }

    private function deleteOldFile(?string $url, string $prefix): void
    {
        if ($url && str_starts_with($url, $prefix)) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $url));
        }
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'subtitle' => ['nullable', 'string', 'max:100'],
            'icon' => ['required', 'string', 'max:50'],
            'gradient_from' => ['required', 'string', 'max:20'],
            'gradient_to' => ['required', 'string', 'max:20'],
            'image' => ['nullable', 'image', 'max:4096'],
            'image_url' => ['nullable', 'string', 'max:255'],
            'pick_sound' => ['nullable', 'file', 'mimes:mp3,wav,ogg,mpga', 'max:2048'],
            'pick_sound_url' => ['nullable', 'string', 'max:255'],
            'order' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);
    }
}
