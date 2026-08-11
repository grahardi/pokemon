# Pokemon.id

Situs portal Pokemon Indonesia — Berita, Info, Game, dan Katalog Pokemon lengkap (905 Pokemon, Generasi 1–8).

Dibangun dengan **Laravel 13**, **PostgreSQL**, dan **Bootstrap 5** (CDN, tanpa build step npm).

## Fitur

- **Katalog Pokemon** (`/katalog`) — pencarian nama/nomor dex, filter tipe & generasi (Gen 1–8), detail lengkap (deskripsi karakter & desain orisinal, stats, generasi, kategori/genus, tinggi, berat, abilities dengan deskripsi Bahasa Indonesia, tabel Type Defense 18 tipe, moveset lengkap level-up & TM/TR, rantai evolusi, gambar official artwork), navigasi Pokemon sebelum/sesudah.

### Catatan soal data Abilities & Moveset

- **Abilities**: nama ability tetap Bahasa Inggris (istilah baku game, tidak ada lokalisasi resmi Bahasa Indonesia), tapi deskripsi efeknya ditulis ulang dalam Bahasa Indonesia (bukan terjemahan literal teks game, untuk menghindari isu hak cipta).
- **Moveset**: diambil dari data mekanik game (nama skill, tipe, power, akurasi, PP — ini adalah data faktual, bukan teks kreatif) menggunakan versi game terakhir yang tersedia untuk tiap Pokemon di dataset sumber (PokeAPI/pokedex, hanya mencakup hingga Gen 8). Tidak mencakup egg moves atau tutor moves untuk menjaga scope tetap wajar.
- **Sengaja tidak ada**: teks Pokedex resmi per game (flavor text) — itu teks kreatif berhak cipta Nintendo/Game Freak yang tidak direproduksi di situs ini.
- **Deskripsi karakter**: kalimat pembuka (tipe & generasi) digenerate otomatis dari data. Deskripsi fisik/desain tiap Pokemon ditulis orisinal (bukan terjemahan dari pokemondb atau sumber lain), mencakup seluruh 905 Pokemon.
- **Trainer Arena Tarung**: nama, gambar, dan warna avatar trainer sepenuhnya dikelola lewat panel admin (`/admin/trainers`) — bisa upload foto langsung (rasio potret, cocok untuk foto full body) atau isi URL manual. Kamu bertanggung jawab atas nama/gambar apa pun yang dimasukkan di sana.

### Atur persentase gacha Arena Tarung

Buka `/admin/gacha` untuk mengubah bobot 4 tier gacha (Legendaris, Evolusi Tahap 2, Non-Evolusi, Bonus Evolusi). Angka tidak wajib total 100% — sistem otomatis menghitung proporsi relatifnya, jadi bebas bereksperimen cari rasio yang pas.

### Atur suara custom Arena Tarung (opsional)

Buka `/admin/sound` untuk upload suara sendiri (serang, kena hit, menang, kalah) — format MP3/WAV/OGG, maks 2MB per file. Kalau tidak diupload, otomatis pakai suara sintesis bawaan (dibuat langsung di browser, tanpa file).

### Setup upload gambar trainer (sekali saja)

Upload foto trainer butuh symbolic link storage Laravel. Jalankan sekali di server:

```bash
php artisan storage:link
```

Tanpa ini, foto yang di-upload akan tersimpan tapi tidak bisa diakses lewat browser (404).
- **Berita** (`/berita`) — artikel berita & info seputar Pokemon.
- **Game** (`/game`) — daftar game utama Pokemon dari Gen 1–9 + Pokemon GO.
- **Beranda** (`/`) — hero slider, Pokemon pilihan acak, berita terbaru.
- **Arena Tarung** (`/tarung`) — mini-game battle vs bot: pilih avatar trainer lewat **carousel looping** (kartu tengah selalu default aktif, panah kiri/kanan tampil di mobile & desktop, klik kartu untuk "mencabutnya" baru tombol Pilih muncul) → isi nickname → pilih **Mode Battle** (1 lawan 1 instan) atau **Mode Challenge** (susun tim 3 Pokemon, masuk **Lobi Challenge** dengan level tracker **15 level** trainer berjenjang sampai boss Mewtwo/Arceus). Tiap kali menang/kalah 1 level, muncul **layar hasil duel 2 avatar trainer** (kamu vs lawan, satu ditandai MENANG satu KALAH) dengan animasi confetti (menang) atau kelopak bunga gugur (kalah) serta musik yang menyesuaikan, sebelum lanjut ke lobi manual lewat tombol. Level yang sudah dikalahkan bisa diulang untuk grinding. Tiap kelipatan 3x menang muncul **gacha 4-tier** (persentase diatur admin lewat `/admin/gacha`, default 10% legendaris / 20% evolusi tahap 2 / 30% non-evolusi / 40% bonus evolusi — evolusi Pokemon di tim sendiri, sekarang jadi bagian gacha, bukan tombol terpisah lagi) — hasilnya bisa dipilih untuk menggantikan/mengevolusikan anggota tim atau dibatalkan, progres level **tidak reset**. Skill punya **cooldown 1 giliran** setelah dipakai. Efek suara serang/kena hit/menang/kalah **bisa di-custom lewat upload di `/admin/sound`**, kalau tidak diisi otomatis pakai suara sintesis bawaan (Web Audio API, tanpa file eksternal). Dibangun dengan React + Inertia (public, tanpa perlu login).
- **Panel Admin** (`/admin`) — dashboard, CRUD Berita & Game, edit data Pokemon. Dibangun dengan **React + Inertia.js** (halaman publik tetap Blade untuk SEO, hanya area admin yang pakai React).

## Arsitektur

- Halaman publik (beranda, katalog, berita, game) → **Blade + Bootstrap 5 CDN**, tanpa build step, render server-side penuh (baik untuk SEO).
- Panel admin (`/admin/*`) → **React + Inertia.js**, butuh `npm run build` sekali saat deploy/update.

## Deploy ke server (aaPanel / SSH)

Repo ini adalah source code Laravel murni (tanpa folder `vendor/` dan `node_modules/`). Jalankan langkah berikut di server:

```bash
git clone https://github.com/grahardi/pokemon.git
cd pokemon
composer install --no-dev --optimize-autoloader
npm install
npm run build

cp .env.example .env
# edit .env: sesuaikan DB_DATABASE, DB_USERNAME, DB_PASSWORD, APP_URL

php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
```

Pastikan database PostgreSQL (`pokemon_id`) dan user-nya sudah dibuat di server sebelum migrate:

```sql
CREATE DATABASE pokemon_id;
CREATE USER pokemon_id WITH PASSWORD 'password_aman';
GRANT ALL PRIVILEGES ON DATABASE pokemon_id TO pokemon_id;
```

Arahkan document root Nginx di aaPanel ke folder `public/` proyek ini, lalu set permission storage:

```bash
chmod -R 775 storage bootstrap/cache
```

### Login Admin

Setelah `db:seed`, login di `/admin/login` dengan:
- Email: `admin@pokemon.id`
- Password: `ubah-password-ini`

**Segera ganti password** setelah login pertama (lewat `php artisan tinker` → `User::first()->update(['password' => Hash::make('password-baru')])`, atau tambahkan halaman ganti password nanti).

### Update setiap kali ada perubahan admin (React)

Karena panel admin pakai Vite/React, tiap kali ada perubahan di `resources/js/`, jalankan ulang:

```bash
npm run build
```

Butuh Node.js 18+ terinstal di server. Kalau aaPanel belum ada Node, bisa build di lokal/CI lalu upload folder `public/build/` saja.

## Update data Pokemon

Data seed katalog ada di `database/seeders/data/pokedex.json` (905 entri: nama, tipe, base stats, gambar dari sprite resmi PokeAPI). Untuk re-seed:

```bash
php artisan db:seed --class=PokemonSeeder --force
```

## Cache gambar Pokemon secara lokal (opsional, direkomendasikan)

Secara default, gambar Pokemon di-load langsung dari `raw.githubusercontent.com` (CDN GitHub). Supaya situs lebih cepat dan tidak bergantung ke server luar, jalankan command berikut di server untuk men-download semua 905 gambar ke lokal (otomatis dikompres ke WebP, max lebar 400px):

```bash
php artisan pokemon:cache-images
```

- Gambar disimpan di `public/images/pokemon/{dex_number}.webp` — **tidak ikut masuk ke git repo** (sudah di-gitignore), jadi tiap server perlu jalankan command ini sendiri.
- Situs otomatis pakai gambar lokal begitu tersedia, dan fallback ke CDN GitHub kalau belum di-cache — jadi aman dijalankan kapan saja tanpa bikin situs down.
- Command otomatis skip gambar yang sudah ada. Tambahkan `--force` untuk download ulang semua.
- Untuk retry sebagian: `php artisan pokemon:cache-images --only=1,4,7,150`
- Butuh ekstensi PHP **GD** untuk kompresi WebP (biasanya sudah aktif di aaPanel). Kalau tidak ada, otomatis fallback simpan sebagai PNG asli.
- Proses ini butuh waktu beberapa menit (905 request ke GitHub) — jalankan sekali saja, lalu cukup ulangi kalau ada Pokemon baru ditambahkan.

## Struktur utama

- `app/Models/{Pokemon,News,Game}.php`
- `app/Http/Controllers/{Pokemon,News,Game,Home}Controller.php`
- `database/migrations/*_create_{pokemons,news,games}_table.php`
- `database/seeders/{Pokemon,News,Game}Seeder.php`
- `resources/views/{home,pokemon,news,games,layouts,partials}`

## Catatan

Fan-site tidak resmi. Pokémon dan seluruh karakter terkait merupakan hak cipta Nintendo, Game Freak, dan Creatures Inc.
