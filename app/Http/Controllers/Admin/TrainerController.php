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
        $data['image_url'] = $this->handleImageUpload($request) ?? $data['image_url'];

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
        $uploaded = $this->handleImageUpload($request);

        if ($uploaded) {
            // Hapus file lama kalau sebelumnya juga hasil upload (bukan URL eksternal)
            if ($trainer->image_url && str_starts_with($trainer->image_url, '/storage/trainers/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $trainer->image_url));
            }
            $data['image_url'] = $uploaded;
        }

        $trainer->update($data);

        return redirect()->route('admin.trainers.index')->with('success', 'Trainer berhasil diperbarui.');
    }

    public function destroy(Trainer $trainer): RedirectResponse
    {
        if ($trainer->image_url && str_starts_with($trainer->image_url, '/storage/trainers/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $trainer->image_url));
        }

        $trainer->delete();

        return redirect()->route('admin.trainers.index')->with('success', 'Trainer berhasil dihapus.');
    }

    private function handleImageUpload(Request $request): ?string
    {
        if (! $request->hasFile('image')) {
            return null;
        }

        $path = $request->file('image')->store('trainers', 'public');

        return '/storage/' . $path;
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
            'order' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);
    }
}
