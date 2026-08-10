@extends('layouts.app')

@section('title', 'Beranda')

@section('content')
<div class="hero-pokeball" style="background: linear-gradient(135deg, var(--brand-blue), var(--brand-red));">
    <div class="container py-5 text-white">
        <div class="row align-items-center">
            <div class="col-lg-7">
                <h1 class="display-5 fw-bold">Portal Berita, Info & Katalog Pokemon Indonesia</h1>
                <p class="lead">Temukan berita terbaru, info seputar game, dan jelajahi katalog lengkap {{ number_format($totalPokemon) }}+ Pokemon dari berbagai generasi.</p>
                <a href="{{ route('pokemon.index') }}" class="btn btn-warning btn-lg fw-bold text-dark">
                    <i class="bi bi-search"></i> Jelajahi Katalog Pokemon
                </a>
                <a href="{{ route('news.index') }}" class="btn btn-outline-light btn-lg">Baca Berita</a>
            </div>
        </div>
    </div>
</div>

<div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h4 mb-0">Pokemon Pilihan</h2>
        <a href="{{ route('pokemon.index') }}" class="small">Lihat semua katalog &rarr;</a>
    </div>
    <div class="row g-3">
        @foreach ($featuredPokemon as $pokemon)
            @include('partials.pokemon-card', ['pokemon' => $pokemon])
        @endforeach
    </div>
</div>

<div class="container pb-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h4 mb-0">Berita Terbaru</h2>
        <a href="{{ route('news.index') }}" class="small">Semua berita &rarr;</a>
    </div>
    <div class="row g-4">
        @forelse ($latestNews as $news)
            <div class="col-md-4">
                <div class="card h-100 shadow-sm border-0">
                    <div class="card-body">
                        <span class="badge bg-danger mb-2">{{ $news->category }}</span>
                        <h5 class="card-title"><a href="{{ route('news.show', $news) }}" class="text-decoration-none text-dark">{{ $news->title }}</a></h5>
                        <p class="card-text small text-muted">{{ $news->excerpt }}</p>
                        <a href="{{ route('news.show', $news) }}" class="small">Baca selengkapnya &rarr;</a>
                    </div>
                </div>
            </div>
        @empty
            <p class="text-muted">Belum ada berita.</p>
        @endforelse
    </div>
</div>
@endsection
