<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        Trainer::create($this->validateData($request));

        return redirect()->route('admin.trainers.index')->with('success', 'Trainer berhasil ditambahkan.');
    }

    public function edit(Trainer $trainer): Response
    {
        return Inertia::render('Admin/Trainers/Form', ['trainer' => $trainer]);
    }

    public function update(Request $request, Trainer $trainer): RedirectResponse
    {
        $trainer->update($this->validateData($request));

        return redirect()->route('admin.trainers.index')->with('success', 'Trainer berhasil diperbarui.');
    }

    public function destroy(Trainer $trainer): RedirectResponse
    {
        $trainer->delete();

        return redirect()->route('admin.trainers.index')->with('success', 'Trainer berhasil dihapus.');
    }

    private function validateData(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'subtitle' => ['nullable', 'string', 'max:100'],
            'icon' => ['required', 'string', 'max:50'],
            'gradient_from' => ['required', 'string', 'max:20'],
            'gradient_to' => ['required', 'string', 'max:20'],
            'image_url' => ['nullable', 'string', 'max:255'],
            'order' => ['required', 'integer', 'min:0'],
            'is_active' => ['boolean'],
        ]);
    }
}
