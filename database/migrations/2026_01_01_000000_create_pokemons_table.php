<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pokemons', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('dex_number')->unique();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('name_japanese')->nullable();
            $table->json('types');
            $table->unsignedSmallInteger('hp')->default(0);
            $table->unsignedSmallInteger('attack')->default(0);
            $table->unsignedSmallInteger('defense')->default(0);
            $table->unsignedSmallInteger('sp_attack')->default(0);
            $table->unsignedSmallInteger('sp_defense')->default(0);
            $table->unsignedSmallInteger('speed')->default(0);
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->timestamps();

            $table->index('name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pokemons');
    }
};
