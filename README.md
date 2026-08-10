# Pokemon.id

Situs portal Pokemon Indonesia — Berita, Info, Game, dan Katalog Pokemon lengkap (809 Pokemon, generasi 1–7).

Dibangun dengan **Laravel 13**, **PostgreSQL**, dan **Bootstrap 5** (CDN, tanpa build step npm).

## Fitur

- **Katalog Pokemon** (`/katalog`) — pencarian nama/nomor dex, filter tipe, detail lengkap (stats, tipe, gambar official artwork), navigasi Pokemon sebelum/sesudah.
- **Berita** (`/berita`) — artikel berita & info seputar Pokemon.
- **Game** (`/game`) — daftar game utama Pokemon dari Gen 1–9 + Pokemon GO.
- **Beranda** (`/`) — hero, Pokemon pilihan acak, berita terbaru.

## Deploy ke server (aaPanel / SSH)

Repo ini adalah source code Laravel murni (tanpa folder `vendor/`). Jalankan langkah berikut di server:

```bash
git clone https://github.com/grahardi/pokemon.git
cd pokemon
composer install --no-dev --optimize-autoloader

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
