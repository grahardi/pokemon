<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        $games = [
            ['title' => 'Pokémon Red & Blue', 'platform' => 'Game Boy', 'generation' => 'Gen 1', 'release_date' => '1996-02-27', 'description' => 'Game Pokemon pertama yang memperkenalkan 151 Pokemon original dan wilayah Kanto.'],
            ['title' => 'Pokémon Gold & Silver', 'platform' => 'Game Boy Color', 'generation' => 'Gen 2', 'release_date' => '1999-11-21', 'description' => 'Memperkenalkan wilayah Johto, sistem waktu day/night, dan breeding Pokemon.'],
            ['title' => 'Pokémon Ruby & Sapphire', 'platform' => 'Game Boy Advance', 'generation' => 'Gen 3', 'release_date' => '2002-11-21', 'description' => 'Wilayah Hoenn dengan grafis GBA dan fitur double battle.'],
            ['title' => 'Pokémon Diamond & Pearl', 'platform' => 'Nintendo DS', 'generation' => 'Gen 4', 'release_date' => '2006-09-28', 'description' => 'Wilayah Sinnoh, memperkenalkan online trading via Nintendo Wi-Fi Connection.'],
            ['title' => 'Pokémon Black & White', 'platform' => 'Nintendo DS', 'generation' => 'Gen 5', 'release_date' => '2010-09-18', 'description' => 'Wilayah Unova dengan cerita yang lebih matang dan seluruh Pokemon baru di awal game.'],
            ['title' => 'Pokémon X & Y', 'platform' => 'Nintendo 3DS', 'generation' => 'Gen 6', 'release_date' => '2013-10-12', 'description' => 'Wilayah Kalos, game 3D pertama dalam seri utama dan pengenalan Mega Evolution.'],
            ['title' => 'Pokémon Sun & Moon', 'platform' => 'Nintendo 3DS', 'generation' => 'Gen 7', 'release_date' => '2016-11-18', 'description' => 'Wilayah Alola dengan sistem Trial menggantikan Gym, serta Z-Move.'],
            ['title' => 'Pokémon Sword & Shield', 'platform' => 'Nintendo Switch', 'generation' => 'Gen 8', 'release_date' => '2019-11-15', 'description' => 'Wilayah Galar dengan fitur Dynamax/Gigantamax dan Wild Area open-world.'],
            ['title' => 'Pokémon Legends: Arceus', 'platform' => 'Nintendo Switch', 'generation' => 'Gen 8', 'release_date' => '2022-01-28', 'description' => 'Wilayah Hisui (Sinnoh kuno) dengan gameplay action-adventure open-world dan mekanik menangkap baru, memperkenalkan varian Hisuian dan evolusi baru seperti Wyrdeer, Kleavor, dan Enamorus.'],
            ['title' => 'Pokémon Scarlet & Violet', 'platform' => 'Nintendo Switch', 'generation' => 'Gen 9', 'release_date' => '2022-11-18', 'description' => 'Wilayah Paldea, game open-world penuh pertama dalam seri utama.'],
            ['title' => 'Pokémon GO', 'platform' => 'Mobile (iOS/Android)', 'generation' => 'Spin-off', 'release_date' => '2016-07-06', 'description' => 'Game augmented reality berbasis lokasi untuk menangkap Pokemon di dunia nyata.'],
            ['title' => 'Pokémon Unite', 'platform' => 'Nintendo Switch / Mobile', 'generation' => 'Spin-off', 'release_date' => '2021-07-21', 'description' => 'Game MOBA 5v5 di mana pemain mengendalikan satu Pokemon untuk bertarung merebut poin di arena.'],
            ['title' => 'Pokémon Trading Card Game', 'platform' => 'Kartu Fisik / TCG Live / TCG Pocket', 'generation' => 'Spin-off', 'release_date' => '1996-10-20', 'description' => 'Permainan kartu koleksi strategis yang sudah eksis sejak 1996, kini juga tersedia dalam versi digital.'],
            ['title' => 'Pokémon Mystery Dungeon: Rescue Team DX', 'platform' => 'Nintendo Switch', 'generation' => 'Spin-off', 'release_date' => '2020-03-06', 'description' => 'Roguelike RPG di mana pemain berperan langsung sebagai Pokemon menjelajahi dungeon acak.'],
            ['title' => 'New Pokemon Snap', 'platform' => 'Nintendo Switch', 'generation' => 'Spin-off', 'release_date' => '2021-04-30', 'description' => 'Game fotografi santai yang mengajak pemain memotret Pokemon di habitat aslinya.'],
            ['title' => 'Pokémon Sleep', 'platform' => 'Mobile (iOS/Android)', 'generation' => 'Spin-off', 'release_date' => '2023-07-20', 'description' => 'Aplikasi unik yang menggamifikasi kebiasaan tidur dengan menemukan Pokemon berdasarkan pola tidur pemain.'],
        ];

        foreach ($games as $game) {
            Game::query()->updateOrCreate(
                ['slug' => Str::slug($game['title'])],
                array_merge($game, ['slug' => Str::slug($game['title'])])
            );
        }
    }
}
