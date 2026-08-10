@extends('layouts.app')

@section('title', 'Game Pokemon')

@section('content')
<div class="container py-5">
    <h1 class="h3 mb-4">Daftar Game Pokemon</h1>
    <div class="row g-4">
        @foreach ($games as $game)
            <div class="col-md-6">
                <a href="{{ route('games.show', $game) }}" class="text-decoration-none text-dark">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="card-body">
                            <span class="badge bg-primary mb-2">{{ $game->generation }}</span>
                            <h5 class="card-title">{{ $game->title }}</h5>
                            <p class="text-muted small mb-1"><i class="bi bi-controller"></i> {{ $game->platform }}</p>
                            @if ($game->release_date)
                                <p class="text-muted small mb-2"><i class="bi bi-calendar3"></i> {{ $game->release_date->translatedFormat('d F Y') }}</p>
                            @endif
                            <p class="card-text small">{{ \Illuminate\Support\Str::limit($game->description, 120) }}</p>
                        </div>
                    </div>
                </a>
            </div>
        @endforeach
    </div>
</div>
@endsection
