<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\GameController as AdminGameController;
use App\Http\Controllers\Admin\NewsController as AdminNewsController;
use App\Http\Controllers\Admin\GachaSettingController as AdminGachaSettingController;
use App\Http\Controllers\Admin\PokemonController as AdminPokemonController;
use App\Http\Controllers\Admin\SoundSettingController as AdminSoundSettingController;
use App\Http\Controllers\Admin\TrainerController as AdminTrainerController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\BattleGameController;
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

// --- Game Battle vs Bot ---
Route::get('/tarung', [BattleGameController::class, 'index'])->name('battle.index');
Route::get('/api/tarung/random', [BattleGameController::class, 'randomPokemon'])->name('battle.random');
Route::get('/api/tarung/find', [BattleGameController::class, 'findByName'])->name('battle.find');
Route::get('/api/tarung/evolutions', [BattleGameController::class, 'evolutions'])->name('battle.evolutions');
Route::get('/api/tarung/gacha-roll', [BattleGameController::class, 'gachaRoll'])->name('battle.gacha-roll');
Route::get('/api/tarung/sounds', [BattleGameController::class, 'sounds'])->name('battle.sounds');
Route::get('/api/tarung/trainers', [BattleGameController::class, 'trainers'])->name('battle.trainers');

// --- Autentikasi Admin ---
Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [LoginController::class, 'create'])->name('login');
    Route::post('/admin/login', [LoginController::class, 'store']);
});
Route::post('/admin/logout', [LoginController::class, 'destroy'])->middleware('auth')->name('logout');

// --- Panel Admin (React + Inertia) ---
Route::middleware('auth')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::resource('news', AdminNewsController::class)->except('show');
    Route::resource('games', AdminGameController::class)->except('show');
    Route::resource('trainers', AdminTrainerController::class)->except('show');

    Route::get('gacha', [AdminGachaSettingController::class, 'edit'])->name('gacha.edit');
    Route::put('gacha', [AdminGachaSettingController::class, 'update'])->name('gacha.update');

    Route::get('sound', [AdminSoundSettingController::class, 'edit'])->name('sound.edit');
    Route::post('sound', [AdminSoundSettingController::class, 'update'])->name('sound.update');
    Route::post('sound/reset', [AdminSoundSettingController::class, 'reset'])->name('sound.reset');

    Route::get('pokemon', [AdminPokemonController::class, 'index'])->name('pokemon.index');
    Route::get('pokemon/{pokemon}/edit', [AdminPokemonController::class, 'edit'])->name('pokemon.edit');
    Route::put('pokemon/{pokemon}', [AdminPokemonController::class, 'update'])->name('pokemon.update');
});

