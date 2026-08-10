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
            [
                'title' => 'Mengenal Pokemon GO: Game AR yang Mengubah Cara Bermain Pokemon',
                'category' => 'Game',
                'excerpt' => 'Game mobile berbasis lokasi dan augmented reality yang mengajak pemain menangkap Pokemon di dunia nyata.',
                'body' => "Pokemon GO dikembangkan oleh Niantic bekerja sama dengan The Pokemon Company, dan pertama kali dirilis pada Juli 2016 untuk perangkat iOS dan Android. Berbeda dari game utama yang berbasis giliran di dunia fiksi, Pokemon GO memanfaatkan GPS ponsel dan teknologi augmented reality (AR) sehingga pemain benar-benar berjalan di dunia nyata untuk menemukan dan menangkap Pokemon.\n\nMekanisme utamanya meliputi menangkap Pokemon liar dengan melempar Poke Ball di layar sentuh, mengunjungi PokeStop untuk mengambil item, bertarung di Gym untuk merebut wilayah, serta mengikuti Raid Battle bersama pemain lain untuk melawan Pokemon kuat. Game ini juga mengenalkan sistem Buddy Pokemon, Egg hatching lewat berjalan kaki, serta event musiman dan Community Day yang menghadirkan Pokemon langka dalam waktu terbatas.\n\nPokemon GO tercatat sebagai salah satu game mobile paling sukses sepanjang masa, mendorong jutaan orang di seluruh dunia untuk keluar rumah dan berinteraksi langsung dengan pemain lain, sekaligus memperkenalkan konsep gaming berbasis lokasi ke pasar yang lebih luas.",
            ],
            [
                'title' => 'Pokemon Unite: MOBA 5v5 Ala Dunia Pokemon',
                'category' => 'Game',
                'excerpt' => 'Game pertarungan tim strategis bergaya MOBA yang menghadirkan Pokemon favorit dalam format 5 lawan 5.',
                'body' => "Pokemon Unite adalah game bergenre MOBA (Multiplayer Online Battle Arena) yang dikembangkan oleh TiMi Studio Group bersama The Pokemon Company, dirilis pada 2021 untuk Nintendo Switch dan perangkat mobile. Dalam game ini, dua tim beranggotakan lima pemain saling berhadapan di sebuah arena, mengendalikan satu Pokemon masing-masing untuk mengalahkan Pokemon liar dan lawan demi mengumpulkan poin sebanyak-banyaknya sebelum waktu habis.\n\nSetiap Pokemon punya peran berbeda seperti Attacker, Defender, Speedster, All-Rounder, atau Supporter, dengan kemampuan unik yang bisa ditingkatkan seiring pertandingan berjalan lewat sistem leveling khas MOBA. Berbeda dari game utama, pertarungan di Pokemon Unite berjalan secara real-time, bukan berbasis giliran.\n\nGame ini dirancang untuk pemain kasual maupun kompetitif, lengkap dengan mode ranked, event musiman, dan turnamen esport resmi yang terus digelar oleh The Pokemon Company.",
            ],
            [
                'title' => 'Pokemon Trading Card Game: Dari Kartu Fisik ke Versi Digital',
                'category' => 'Game',
                'excerpt' => 'Mengenal permainan kartu koleksi Pokemon yang sudah eksis sejak 1996 dan kini juga hadir dalam versi digital.',
                'body' => "Pokemon Trading Card Game (Pokemon TCG) pertama kali dirilis di Jepang pada Oktober 1996, hanya beberapa bulan setelah game video pertamanya, dan dikembangkan oleh Creatures Inc. Dalam permainan ini, dua pemain saling berhadapan menggunakan dek berisi 60 kartu yang terdiri dari kartu Pokemon, kartu Trainer, dan kartu Energy, dengan tujuan mengambil seluruh kartu Prize milik mereka lebih dulu, biasanya dengan cara mengalahkan Pokemon lawan.\n\nSetiap kartu Pokemon memiliki HP, jenis serangan, dan efek unik, sementara kartu Trainer memberi efek strategis tambahan seperti penyembuhan atau penarikan kartu. Kombinasi strategi dek-building dan pengambilan keputusan saat bertarung membuat TCG populer sebagai permainan kompetitif hingga digelar turnamen resmi tingkat dunia (Pokemon World Championships).\n\nUntuk menjangkau pemain digital, Pokemon TCG kini juga hadir dalam bentuk aplikasi seperti Pokemon TCG Live dan Pokemon TCG Pocket, yang memungkinkan pemain mengumpulkan kartu serta bertarung online tanpa kartu fisik.",
            ],
            [
                'title' => 'Pokemon Mystery Dungeon: Jadi Pokemon dan Jelajahi Dungeon',
                'category' => 'Game',
                'excerpt' => 'Seri spin-off RPG unik di mana pemain berperan sebagai Pokemon, bukan pelatih.',
                'body' => "Pokemon Mystery Dungeon adalah seri spin-off roguelike RPG yang dikembangkan oleh Chunsoft (kini Spike Chunsoft), pertama dirilis pada 2005 untuk Game Boy Advance dan Nintendo DS dengan judul Red Rescue Team dan Blue Rescue Team. Hal yang membuat seri ini unik adalah pemain tidak berperan sebagai pelatih manusia, melainkan langsung menjelma menjadi seekor Pokemon yang menjelajahi dungeon secara acak bersama partner Pokemon lainnya.\n\nGameplay-nya mengusung format dungeon crawler berbasis giliran, di mana pemain bergerak petak demi petak, bertarung dengan Pokemon liar, mengumpulkan item, dan menaiki level lantai dungeon yang layout-nya selalu berubah setiap kali dimainkan (procedurally generated). Seri ini juga dikenal dengan cerita yang emosional dan mendalam dibanding game Pokemon pada umumnya.\n\nBeberapa judul populer dalam seri ini antara lain Explorers of Time/Darkness/Sky (2007-2009) dan Pokemon Mystery Dungeon: Rescue Team DX (2020), remake untuk Nintendo Switch dengan grafis bergaya diorama yang lebih modern.",
            ],
            [
                'title' => 'New Pokemon Snap: Fotografi Pokemon di Alam Liar',
                'category' => 'Game',
                'excerpt' => 'Game rail-shooter santai yang mengajak pemain memotret Pokemon dalam habitat aslinya.',
                'body' => "New Pokemon Snap adalah game fotografi yang dikembangkan oleh Bandai Namco bersama The Pokemon Company, dirilis untuk Nintendo Switch pada April 2021 sebagai sekuel dari Pokemon Snap (1999) di Nintendo 64. Alih-alih menangkap dan bertarung, tujuan utama game ini adalah memotret Pokemon di habitat alaminya menggunakan kamera khusus sambil menaiki kendaraan penjelajah otomatis (on-rails) bernama NEO-ONE.\n\nPemain dapat berinteraksi dengan lingkungan menggunakan berbagai item, seperti melempar Fluffruit untuk memancing perhatian Pokemon atau memutar melodi khusus untuk memicu perilaku unik, lalu dinilai berdasarkan kualitas komposisi, pose, dan momen yang berhasil diabadikan lewat sistem penilaian bernama Pokemon Photodex.\n\nGame ini menonjolkan sisi eksplorasi dan keindahan visual dunia Pokemon dari sudut pandang yang jarang dieksplorasi di game utama, menampilkan Pokemon dalam interaksi sosial dan perilaku alami yang detail.",
            ],
            [
                'title' => 'Pokemon Sleep: Ubah Kebiasaan Tidur Jadi Permainan',
                'category' => 'Game',
                'excerpt' => 'Aplikasi unik yang mengajak pemain mencatat pola tidur untuk "menangkap" Pokemon yang sedang beristirahat.',
                'body' => "Pokemon Sleep adalah aplikasi mobile yang dikembangkan oleh The Pokemon Company bersama Select Button, dirilis pada Juli 2023. Konsepnya cukup unik: alih-alih fokus pada pertarungan, game ini mendorong pemain untuk membangun kebiasaan tidur yang baik dengan cara merekam durasi dan kualitas tidur menggunakan sensor di ponsel atau perangkat Pokemon Go Plus +.\n\nSetiap kali pemain tidur, data tersebut digunakan untuk 'menemukan' Pokemon yang sedang beristirahat di sekitar area penelitian dalam game, lengkap dengan animasi tidur unik untuk tiap spesies. Pemain juga mengelola karakter riset bernama Snorlax dan Professor Neroli, mengumpulkan bahan makanan untuk memasak, serta menyusun tim Pokemon berdasarkan gaya tidur (Dozing, Snoozing, Slumbering) untuk memaksimalkan hasil penelitian.\n\nIde besar di balik Pokemon Sleep adalah gamifikasi kesehatan tidur, menjadikannya salah satu pendekatan paling tidak biasa dalam sejarah franchise Pokemon.",
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
