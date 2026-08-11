<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SoundSetting extends Model
{
    protected $fillable = [
        'attack_sound_url',
        'hit_sound_url',
        'win_sound_url',
        'lose_sound_url',
        'pick_sound_url',
        'battle_start_sound_url',
        'pokemon_faint_sound_url',
        'enemy_faint_sound_url',
        'gacha_sound_url',
        'gacha_legendary_sound_url',
    ];

    /**
     * Ambil satu-satunya baris pengaturan suara, buat default kalau belum ada.
     */
    public static function current(): self
    {
        return static::query()->first() ?? static::query()->create([]);
    }
}
