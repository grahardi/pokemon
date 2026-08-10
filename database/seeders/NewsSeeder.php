<?php

namespace Database\Seeders;

use App\Models\News;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'title' => 'Selamat Datang di Pokemon.id',
                'category' => 'Pengumuman',
                'excerpt' => 'Portal berita, info, dan katalog Pokemon lengkap berbahasa Indonesia resmi diluncurkan.',
                'body' => "Pokemon.id hadir sebagai portal komunitas Pokemon Indonesia yang menyajikan berita terbaru seputar franchise Pokemon, informasi seputar game, serta katalog lengkap ratusan Pokemon dari berbagai generasi.\n\nJelajahi katalog Pokemon lengkap dengan statistik, tipe, dan gambar resminya di menu Katalog.",
            ],
            [
                'title' => 'Mengenal Sistem Tipe Pokemon',
                'category' => 'Info',
                'excerpt' => 'Pahami keunggulan dan kelemahan setiap tipe Pokemon dalam pertarungan.',
                'body' => "Setiap Pokemon memiliki satu atau dua tipe yang menentukan keunggulan dan kelemahannya saat bertarung. Misalnya, Pokemon tipe Air unggul melawan tipe Api, namun lemah terhadap tipe Listrik.\n\nMemahami relasi antar tipe adalah kunci strategi dalam setiap pertandingan Pokemon, baik di game maupun trading card game.",
            ],
            [
                'title' => 'Sejarah Singkat Game Pokemon dari Generasi ke Generasi',
                'category' => 'Game',
                'excerpt' => 'Perjalanan seri utama Pokemon sejak 1996 hingga generasi terbaru.',
                'body' => "Sejak dirilis pertama kali pada tahun 1996 dengan Pokemon Red & Blue, seri game Pokemon telah berkembang melalui sembilan generasi utama, masing-masing membawa wilayah, Pokemon, dan mekanik permainan baru.\n\nLihat daftar lengkap game utama Pokemon di menu Game pada situs ini.",
            ],
        ];

        foreach ($items as $item) {
            News::query()->updateOrCreate(
                ['slug' => Str::slug($item['title'])],
                array_merge($item, [
                    'slug' => Str::slug($item['title']),
                    'published_at' => now(),
                ])
            );
        }
    }
}
