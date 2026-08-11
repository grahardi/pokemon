<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SoundSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SoundSettingController extends Controller
{
    private const SLOTS = ['attack', 'hit', 'win', 'lose'];

    public function edit(): Response
    {
        return Inertia::render('Admin/SoundSetting/Edit', [
            'setting' => SoundSetting::current(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'attack' => ['nullable', 'file', 'mimes:mp3,wav,ogg,mpga', 'max:2048'],
            'hit' => ['nullable', 'file', 'mimes:mp3,wav,ogg,mpga', 'max:2048'],
            'win' => ['nullable', 'file', 'mimes:mp3,wav,ogg,mpga', 'max:2048'],
            'lose' => ['nullable', 'file', 'mimes:mp3,wav,ogg,mpga', 'max:2048'],
        ]);

        $setting = SoundSetting::current();
        $data = [];

        foreach (self::SLOTS as $slot) {
            if ($request->hasFile($slot)) {
                $this->deleteOldFile($setting, $slot);
                $path = $request->file($slot)->store('sounds', 'public');
                $data["{$slot}_sound_url"] = '/storage/' . $path;
            }
        }

        $setting->update($data);

        return redirect()->route('admin.sound.edit')->with('success', 'Pengaturan suara berhasil disimpan.');
    }

    public function reset(Request $request): RedirectResponse
    {
        $slot = $request->string('slot')->toString();

        if (! in_array($slot, self::SLOTS, true)) {
            return redirect()->route('admin.sound.edit')->with('error', 'Slot suara tidak valid.');
        }

        $setting = SoundSetting::current();
        $this->deleteOldFile($setting, $slot);
        $setting->update(["{$slot}_sound_url" => null]);

        return redirect()->route('admin.sound.edit')->with('success', 'Suara dikembalikan ke default (sintesis otomatis).');
    }

    private function deleteOldFile(SoundSetting $setting, string $slot): void
    {
        $url = $setting->{"{$slot}_sound_url"};

        if ($url && str_starts_with($url, '/storage/sounds/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $url));
        }
    }
}
