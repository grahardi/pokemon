<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PokemonController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::prefix('katalog')->name('pokemon.')->group(function () {
    Route::get('/', [PokemonController::class, 'index'])->name('index');
    Route::get('/{pokemon}', [PokemonController::class, 'show'])->name('show');
});

Route::prefix('berita')->name('news.')->group(function () {
    Route::get('/', [NewsController::class, 'index'])->name('index');
    Route::get('/{news}', [NewsController::class, 'show'])->name('show');
});

Route::prefix('game')->name('games.')->group(function () {
    Route::get('/', [GameController::class, 'index'])->name('index');
    Route::get('/{game}', [GameController::class, 'show'])->name('show');
});
