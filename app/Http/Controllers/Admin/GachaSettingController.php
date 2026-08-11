<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GachaSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GachaSettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/GachaSetting/Edit', [
            'setting' => GachaSetting::current(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'legendary_percent' => ['required', 'integer', 'min:0', 'max:100'],
            'second_evo_percent' => ['required', 'integer', 'min:0', 'max:100'],
            'non_evo_percent' => ['required', 'integer', 'min:0', 'max:100'],
            'bonus_evolution_percent' => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        GachaSetting::current()->update($data);

        return redirect()->route('admin.gacha.edit')->with('success', 'Pengaturan gacha berhasil disimpan.');
    }
}
