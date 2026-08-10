<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pokemons', function (Blueprint $table) {
            $table->unsignedTinyInteger('generation')->default(1)->after('types');
            $table->string('genus')->nullable()->after('generation');
            $table->decimal('height_m', 4, 1)->nullable()->after('genus');
            $table->decimal('weight_kg', 5, 1)->nullable()->after('height_m');

            $table->index('generation');
        });
    }

    public function down(): void
    {
        Schema::table('pokemons', function (Blueprint $table) {
            $table->dropIndex(['generation']);
            $table->dropColumn(['generation', 'genus', 'height_m', 'weight_kg']);
        });
    }
};
