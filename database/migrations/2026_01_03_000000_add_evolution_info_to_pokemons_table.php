<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pokemons', function (Blueprint $table) {
            $table->unsignedInteger('evolution_chain_id')->nullable()->after('weight_kg');
            $table->unsignedInteger('evolves_from')->nullable()->after('evolution_chain_id');

            $table->index('evolution_chain_id');
        });
    }

    public function down(): void
    {
        Schema::table('pokemons', function (Blueprint $table) {
            $table->dropIndex(['evolution_chain_id']);
            $table->dropColumn(['evolution_chain_id', 'evolves_from']);
        });
    }
};
