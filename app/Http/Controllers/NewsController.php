<?php

namespace App\Http\Controllers;

use App\Models\News;

class NewsController extends Controller
{
    public function index()
    {
        $newsList = News::query()->published()->latest('published_at')->paginate(9);

        return view('news.index', compact('newsList'));
    }

    public function show(News $news)
    {
        $related = News::query()
            ->published()
            ->where('id', '!=', $news->id)
            ->where('category', $news->category)
            ->latest('published_at')
            ->take(3)
            ->get();

        return view('news.show', compact('news', 'related'));
    }
}
