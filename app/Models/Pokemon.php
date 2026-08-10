<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokemon extends Model
{
    use HasFactory;

    protected $table = 'pokemons';

    protected $appends = ['display_image', 'generation_label'];

    protected $fillable = [
        'dex_number',
        'slug',
        'name',
        'name_japanese',
        'types',
        'generation',
        'genus',
        'height_m',
        'weight_kg',
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

    public function getGenerationLabelAttribute(): string
    {
        $regions = [
            1 => 'Kanto', 2 => 'Johto', 3 => 'Hoenn', 4 => 'Sinnoh',
            5 => 'Unova', 6 => 'Kalos', 7 => 'Alola', 8 => 'Galar/Hisui',
        ];

        $region = $regions[$this->generation] ?? '';

        return "Gen {$this->generation}" . ($region ? " ({$region})" : '');
    }

    /**
     * Kembalikan gambar lokal (cache) kalau sudah di-download lewat
     * `php artisan pokemon:cache-images`, kalau belum fallback ke CDN GitHub.
     */
    public function getDisplayImageAttribute(): ?string
    {
        foreach (['webp', 'png'] as $ext) {
            $localPath = "images/pokemon/{$this->dex_number}.{$ext}";
            if (file_exists(public_path($localPath))) {
                return asset($localPath);
            }
        }

        return $this->image_url;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
