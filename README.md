# Pokemon.id

Situs portal Pokemon Indonesia — Berita, Info, Game, dan Katalog Pokemon lengkap (809 Pokemon, generasi 1–7).

Dibangun dengan **Laravel 13**, **PostgreSQL**, dan **Bootstrap 5** (CDN, tanpa build step npm).

## Fitur

- **Katalog Pokemon** (`/katalog`) — pencarian nama/nomor dex, filter tipe, detail lengkap (stats, tipe, gambar official artwork), navigasi Pokemon sebelum/sesudah.
- **Berita** (`/berita`) — artikel berita & info seputar Pokemon.
- **Game** (`/game`) — daftar game utama Pokemon dari Gen 1–9 + Pokemon GO.
- **Beranda** (`/`) — hero slider, Pokemon pilihan acak, berita terbaru.
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

Data seed katalog ada di `database/seeders/data/pokedex.json` (809 entri: nama, tipe, base stats, gambar dari sprite resmi PokeAPI). Untuk re-seed:

```bash
php artisan db:seed --class=PokemonSeeder --force
```

## Struktur utama

- `app/Models/{Pokemon,News,Game}.php`
- `app/Http/Controllers/{Pokemon,News,Game,Home}Controller.php`
- `database/migrations/*_create_{pokemons,news,games}_table.php`
- `database/seeders/{Pokemon,News,Game}Seeder.php`
- `resources/views/{home,pokemon,news,games,layouts,partials}`

## Catatan

Fan-site tidak resmi. Pokémon dan seluruh karakter terkait merupakan hak cipta Nintendo, Game Freak, dan Creatures Inc.
