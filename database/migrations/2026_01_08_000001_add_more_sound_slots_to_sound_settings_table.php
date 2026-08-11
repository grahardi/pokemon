<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sound_settings', function (Blueprint $table) {
            $table->string('pick_sound_url')->nullable()->after('lose_sound_url');
            $table->string('battle_start_sound_url')->nullable()->after('pick_sound_url');
            $table->string('pokemon_faint_sound_url')->nullable()->after('battle_start_sound_url');
            $table->string('enemy_faint_sound_url')->nullable()->after('pokemon_faint_sound_url');
            $table->string('gacha_sound_url')->nullable()->after('enemy_faint_sound_url');
            $table->string('gacha_legendary_sound_url')->nullable()->after('gacha_sound_url');
        });
    }

    public function down(): void
    {
        Schema::table('sound_settings', function (Blueprint $table) {
            $table->dropColumn([
                'pick_sound_url',
                'battle_start_sound_url',
                'pokemon_faint_sound_url',
                'enemy_faint_sound_url',
                'gacha_sound_url',
                'gacha_legendary_sound_url',
            ]);
        });
    }
};
