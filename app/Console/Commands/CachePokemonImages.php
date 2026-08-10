<?php

namespace App\Console\Commands;

use App\Models\Pokemon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class CachePokemonImages extends Command
{
    protected $signature = 'pokemon:cache-images
                            {--force : Download ulang meski file lokal sudah ada}
                            {--only= : Hanya download nomor dex tertentu, pisahkan dengan koma (mis. 1,4,7)}';

    protected $description = 'Download gambar official artwork Pokemon dari GitHub dan simpan lokal di public/images/pokemon (WebP, dikompres) agar tidak bergantung ke CDN luar.';

    public function handle(): int
    {
        $dir = public_path('images/pokemon');
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $query = Pokemon::query()->orderBy('dex_number');

        if ($only = $this->option('only')) {
            $ids = array_map('trim', explode(',', $only));
            $query->whereIn('dex_number', $ids);
        }

        $pokemons = $query->get(['id', 'dex_number', 'name']);
        $total = $pokemons->count();
        $useWebp = function_exists('imagewebp') && function_exists('imagecreatefrompng');

        if (! $useWebp) {
            $this->warn('Ekstensi GD (imagewebp) tidak terdeteksi di server ini — gambar akan disimpan sebagai PNG tanpa kompresi tambahan.');
        }

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $downloaded = 0;
        $skipped = 0;
        $failed = [];

        foreach ($pokemons as $pokemon) {
            $ext = $useWebp ? 'webp' : 'png';
            $target = "{$dir}/{$pokemon->dex_number}.{$ext}";

            if ((file_exists($target) || file_exists("{$dir}/{$pokemon->dex_number}.png") || file_exists("{$dir}/{$pokemon->dex_number}.webp")) && ! $this->option('force')) {
                $skipped++;
                $bar->advance();
                continue;
            }

            $url = sprintf(
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/%d.png',
                $pokemon->dex_number
            );

            try {
                $response = Http::timeout(20)->retry(3, 500)->get($url);

                if (! $response->successful()) {
                    $failed[] = $pokemon->dex_number . ' (' . $pokemon->name . ')';
                    $bar->advance();
                    continue;
                }

                if ($useWebp) {
                    $tmpPng = tempnam(sys_get_temp_dir(), 'pkmn') . '.png';
                    file_put_contents($tmpPng, $response->body());
                    $this->convertToWebp($tmpPng, $target);
                    @unlink($tmpPng);
                } else {
                    file_put_contents($target, $response->body());
                }

                $downloaded++;
            } catch (\Throwable $e) {
                $failed[] = $pokemon->dex_number . ' (' . $pokemon->name . '): ' . $e->getMessage();
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Selesai. Downloaded: {$downloaded}, Sudah ada (skip): {$skipped}, Gagal: " . count($failed));

        if ($failed) {
            $this->warn('Daftar yang gagal:');
            foreach ($failed as $f) {
                $this->line(" - {$f}");
            }
            $this->line('Jalankan ulang perintah ini (otomatis skip yang sudah berhasil) untuk retry yang gagal.');
        }

        return self::SUCCESS;
    }

    private function convertToWebp(string $sourcePath, string $targetPath): void
    {
        $image = @imagecreatefrompng($sourcePath);

        if (! $image) {
            copy($sourcePath, $targetPath);
            return;
        }

        // Batasi lebar maksimal 400px biar file kecil, jaga aspect ratio
        $maxWidth = 400;
        $width = imagesx($image);
        $height = imagesy($image);

        if ($width > $maxWidth) {
            $newHeight = (int) round($height * ($maxWidth / $width));
            $resized = imagecreatetruecolor($maxWidth, $newHeight);
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
            imagecopyresampled($resized, $image, 0, 0, 0, 0, $maxWidth, $newHeight, $width, $height);
            imagedestroy($image);
            $image = $resized;
        }

        imagewebp($image, $targetPath, 82);
        imagedestroy($image);
    }
}
