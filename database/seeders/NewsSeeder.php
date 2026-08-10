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
                'title' => 'Sejarah Pokemon: Dari Game Boy Hingga Fenomena Global',
                'category' => 'Sejarah',
                'excerpt' => 'Perjalanan Pokemon sejak pertama kali dirilis di Jepang tahun 1996 hingga menjadi salah satu waralaba media terbesar di dunia.',
                'body' => "Pokemon lahir dari ide Satoshi Tajiri, pendiri Game Freak, yang terinspirasi dari hobinya menangkap serangga semasa kecil di pinggiran Tokyo. Setelah bertahun-tahun pengembangan, Pokemon Red dan Green resmi dirilis di Jepang pada 27 Februari 1996 untuk konsol Game Boy, hasil kerja sama Game Freak, Creatures Inc., dan Nintendo.\n\nKonsep inti permainan ini sederhana namun revolusioner: pemain menjelajahi dunia, menangkap makhluk-makhluk unik bernama Pokemon, melatihnya, dan mempertukarkannya dengan pemain lain lewat kabel link cable — sebuah fitur yang saat itu terasa sangat inovatif karena mendorong interaksi sosial antar pemain.\n\nKesuksesan game ini di Jepang kemudian merambat ke Amerika Utara pada 1998 dengan judul Pokemon Red dan Blue, disusul peluncuran serial animasi, Pokemon Trading Card Game, dan berbagai merchandise. Sejak saat itu, Pokemon berkembang menjadi salah satu waralaba media terlaris sepanjang masa, mencakup sembilan generasi game utama, puluhan spin-off seperti Pokemon GO, film layar lebar, hingga produk mainan dan pakaian di seluruh dunia.\n\nHingga kini, filosofi inti yang dibawa sejak generasi pertama — mengumpulkan, melatih, dan bertarung dengan Pokemon bersama teman — tetap menjadi jantung dari setiap game utama yang dirilis.",
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
            [
                'title' => 'Evolusi Pokemon: Lebih dari Sekadar Berubah Bentuk',
                'category' => 'Info',
                'excerpt' => 'Mengenal berbagai cara Pokemon berevolusi, mulai dari level, batu evolusi, hingga persahabatan.',
                'body' => "Evolusi adalah proses seekor Pokemon berubah menjadi spesies lain yang umumnya lebih kuat, dengan penampilan dan terkadang tipe yang berbeda. Berbeda dengan evolusi biologis di dunia nyata, evolusi Pokemon terjadi secara instan dan dipicu oleh berbagai kondisi tertentu.\n\nCara paling umum adalah evolusi berbasis level — Pokemon berevolusi otomatis setelah mencapai level tertentu, seperti Bulbasaur yang berevolusi menjadi Ivysaur di level 16. Ada juga evolusi menggunakan batu evolusi (evolution stone) seperti Fire Stone atau Water Stone, evolusi berdasarkan tingkat kedekatan/persahabatan dengan pelatih, evolusi berdasarkan waktu (siang/malam), hingga evolusi lewat perdagangan (trading) antar pemain.\n\nBeberapa Pokemon bahkan memiliki syarat evolusi unik, seperti lokasi spesifik atau membawa item tertentu. Memahami jalur evolusi tiap Pokemon adalah bagian penting dari strategi membangun tim yang kuat.",
            ],
            [
                'title' => 'Apa Itu Pokemon Legendaris dan Mitos?',
                'category' => 'Info',
                'excerpt' => 'Mengenal kategori Pokemon langka yang jadi incaran para trainer di setiap game.',
                'body' => "Pokemon Legendaris (Legendary) dan Mitos (Mythical) adalah dua kategori Pokemon istimewa yang biasanya hanya ada satu individu per game, memiliki base stat total yang sangat tinggi, dan sering menjadi maskot atau bagian penting dari cerita utama.\n\nPokemon Legendaris umumnya dapat ditemukan dalam permainan biasa setelah memenuhi syarat tertentu, seperti Mewtwo di Kanto atau Zacian dan Zamazenta di Galar. Pokemon Mitos, di sisi lain, biasanya hanya bisa didapatkan lewat event khusus atau distribusi resmi dari Nintendo dan tidak muncul secara alami dalam permainan, contohnya Mew dan Meltan.\n\nKarena kelangkaan dan kekuatannya, Pokemon-Pokemon ini sering jadi incaran utama para trainer, baik untuk battle kompetitif maupun sekadar melengkapi koleksi Pokedex.",
            ],
        ];

        foreach ($items as $i => $item) {
            News::query()->updateOrCreate(
                ['slug' => Str::slug($item['title'])],
                array_merge($item, [
                    'slug' => Str::slug($item['title']),
                    'published_at' => now()->subDays((count($items) - $i) * 2),
                ])
            );
        }
    }
}
