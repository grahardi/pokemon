<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sound_settings', function (Blueprint $table) {
            $table->id();
            $table->string('attack_sound_url')->nullable();
            $table->string('hit_sound_url')->nullable();
            $table->string('win_sound_url')->nullable();
            $table->string('lose_sound_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sound_settings');
    }
};
