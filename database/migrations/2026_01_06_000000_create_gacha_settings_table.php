<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gacha_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('legendary_percent')->default(10);
            $table->unsignedInteger('second_evo_percent')->default(20);
            $table->unsignedInteger('non_evo_percent')->default(30);
            $table->unsignedInteger('bonus_evolution_percent')->default(50);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gacha_settings');
    }
};
