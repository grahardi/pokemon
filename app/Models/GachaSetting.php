<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GachaSetting extends Model
{
    protected $fillable = [
        'legendary_percent',
        'second_evo_percent',
        'non_evo_percent',
        'bonus_evolution_percent',
    ];

    /**
     * Ambil satu-satunya baris pengaturan gacha, buat default kalau belum ada.
     */
    public static function current(): self
    {
        return static::query()->first() ?? static::query()->create([]);
    }
}
