<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\News;
use App\Models\Pokemon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'pokemon' => Pokemon::count(),
                'news' => News::count(),
                'games' => Game::count(),
            ],
            'latestNews' => News::latest('created_at')->take(5)->get(['id', 'title', 'category', 'published_at']),
        ]);
    }
}
