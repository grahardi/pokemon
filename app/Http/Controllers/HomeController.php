<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Pokemon;

class HomeController extends Controller
{
    public function index()
    {
        $latestNews = News::query()->published()->latest('published_at')->take(3)->get();
        $featuredPokemon = Pokemon::query()->inRandomOrder()->take(8)->get();
        $totalPokemon = Pokemon::query()->count();

        return view('home', compact('latestNews', 'featuredPokemon', 'totalPokemon'));
    }
}
