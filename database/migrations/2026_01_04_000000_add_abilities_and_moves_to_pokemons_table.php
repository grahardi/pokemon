<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pokemons', function (Blueprint $table) {
            $table->json('abilities')->nullable()->after('evolves_from');
            $table->json('moves_level')->nullable()->after('abilities');
            $table->json('moves_machine')->nullable()->after('moves_level');
        });
    }

    public function down(): void
    {
        Schema::table('pokemons', function (Blueprint $table) {
            $table->dropColumn(['abilities', 'moves_level', 'moves_machine']);
        });
    }
};
