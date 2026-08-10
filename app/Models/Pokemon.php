<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokemon extends Model
{
    use HasFactory;

    protected $fillable = [
        'dex_number',
        'slug',
        'name',
        'name_japanese',
        'types',
        'hp',
        'attack',
        'defense',
        'sp_attack',
        'sp_defense',
        'speed',
        'description',
        'image_url',
    ];

    protected $casts = [
        'types' => 'array',
    ];

    public function getTotalStatsAttribute(): int
    {
        return $this->hp + $this->attack + $this->defense
            + $this->sp_attack + $this->sp_defense + $this->speed;
    }

    public function getFormattedDexAttribute(): string
    {
        return '#' . str_pad((string) $this->dex_number, 3, '0', STR_PAD_LEFT);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
