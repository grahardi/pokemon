<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\GameController as AdminGameController;
use App\Http\Controllers\Admin\NewsController as AdminNewsController;
use App\Http\Controllers\Admin\PokemonController as AdminPokemonController;
use App\Http\Controllers\Auth\LoginController;
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

    Route::get('pokemon', [AdminPokemonController::class, 'index'])->name('pokemon.index');
    Route::get('pokemon/{pokemon}/edit', [AdminPokemonController::class, 'edit'])->name('pokemon.edit');
    Route::put('pokemon/{pokemon}', [AdminPokemonController::class, 'update'])->name('pokemon.update');
});

