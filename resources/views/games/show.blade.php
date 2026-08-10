@extends('layouts.app')

@section('title', $game->title)

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb small">
                    <li class="breadcrumb-item"><a href="{{ route('games.index') }}">Game</a></li>
                    <li class="breadcrumb-item active">{{ $game->title }}</li>
                </ol>
            </nav>
            <span class="badge bg-primary mb-2">{{ $game->generation }}</span>
            <h1 class="h3 mb-3">{{ $game->title }}</h1>
            <ul class="list-unstyled small text-muted mb-4">
                <li><i class="bi bi-controller"></i> Platform: {{ $game->platform }}</li>
                @if ($game->release_date)
                    <li><i class="bi bi-calendar3"></i> Rilis: {{ $game->release_date->translatedFormat('d F Y') }}</li>
                @endif
            </ul>
            <p>{{ $game->description }}</p>
            <a href="{{ route('pokemon.index') }}" class="btn btn-danger fw-bold mt-3">Jelajahi Katalog Pokemon &rarr;</a>
        </div>
    </div>
</div>
@endsection
