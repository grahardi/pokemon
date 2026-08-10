<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokemon extends Model
{
    use HasFactory;

    protected $table = 'pokemons';

    protected $appends = ['display_image', 'generation_label', 'weaknesses'];

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
        'evolution_chain_id',
        'evolves_from',
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
     * Hitung kelemahan tipe (attacking type yang memberi damage >1x)
     * berdasarkan kombinasi tipe Pokemon ini, memakai chart di config/pokemon.php.
     *
     * @return array<int, array{type: string, multiplier: float}>
     */
    public function getWeaknessesAttribute(): array
    {
        $chart = config('pokemon.chart', []);
        $defenderTypes = $this->types ?? [];
        $results = [];

        foreach ($chart as $attackType => $rules) {
            $multiplier = 1.0;

            foreach ($defenderTypes as $defType) {
                if (in_array($defType, $rules['double'] ?? [], true)) {
                    $multiplier *= 2;
                } elseif (in_array($defType, $rules['half'] ?? [], true)) {
                    $multiplier *= 0.5;
                } elseif (in_array($defType, $rules['none'] ?? [], true)) {
                    $multiplier *= 0;
                }
            }

            if ($multiplier > 1) {
                $results[] = ['type' => $attackType, 'multiplier' => $multiplier];
            }
        }

        usort($results, fn ($a, $b) => $b['multiplier'] <=> $a['multiplier']);

        return $results;
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
