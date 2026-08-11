@extends('layouts.app')

@section('title', 'Beranda')

@section('content')
<div id="heroSlider" class="carousel slide carousel-fade shadow-lg" data-bs-ride="carousel" data-bs-interval="5000">
    <div class="carousel-indicators">
        <button type="button" data-bs-target="#heroSlider" data-bs-slide-to="0" class="active" aria-current="true"></button>
        <button type="button" data-bs-target="#heroSlider" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#heroSlider" data-bs-slide-to="2"></button>
    </div>
    <div class="carousel-inner">
        <div class="carousel-item active">
            <div class="hero-slide" style="background-image: linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.6)), url('{{ asset('images/hero-slide-2.jpg') }}');">
                <div class="container h-100 d-flex align-items-end align-items-md-center pb-5 pb-md-0">
                    <div class="hero-caption text-white">
                        <span class="badge bg-danger mb-2 fs-6"><i class="bi bi-lightning-charge-fill"></i> Mode Baru!</span>
                        <h1 class="display-5 fw-bold hero-title">Arena Tarung — Battle vs Bot!</h1>
                        <p class="lead d-none d-md-block">Pilih trainer, susun tim Pokemon-mu, dan tembus gauntlet sampai boss Mewtwo/Arceus.</p>
                        <a href="{{ route('battle.index') }}" class="btn btn-warning btn-lg fw-bold text-dark">
                            <i class="bi bi-controller"></i> Mainkan Sekarang
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="carousel-item">
            <div class="hero-slide" style="background-image: linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.55)), url('{{ asset('images/hero-banner.jpg') }}');">
                <div class="container h-100 d-flex align-items-end align-items-md-center pb-5 pb-md-0">
                    <div class="hero-caption text-white">
                        <h1 class="display-5 fw-bold hero-title">Tangkap Pokemonmu Sekarang Juga!</h1>
                        <p class="lead d-none d-md-block">Portal berita, info, dan katalog {{ number_format($totalPokemon) }}+ Pokemon terlengkap berbahasa Indonesia.</p>
                        <a href="{{ route('pokemon.index') }}" class="btn btn-warning btn-lg fw-bold text-dark">
                            <i class="bi bi-search"></i> Jelajahi Katalog
                        </a>
                        <a href="{{ route('news.index') }}" class="btn btn-outline-light btn-lg">Baca Berita</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="carousel-item">
            <div class="hero-slide" style="background-image: linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.6)), url('{{ asset('images/hero-slide-3.jpg') }}');">
                <div class="container h-100 d-flex align-items-end align-items-md-center pb-5 pb-md-0">
                    <div class="hero-caption text-white">
                        <span class="badge bg-danger mb-2 fs-6"><i class="bi bi-newspaper"></i> Update Terbaru</span>
                        <h1 class="display-5 fw-bold hero-title">Berita &amp; Info Seputar Dunia Pokemon</h1>
                        <p class="lead d-none d-md-block">Ikuti kabar terbaru game, event, dan info menarik lainnya.</p>
                        <a href="{{ route('news.index') }}" class="btn btn-light btn-lg fw-bold text-dark">
                            <i class="bi bi-newspaper"></i> Baca Berita
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#heroSlider" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#heroSlider" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
    </button>
</div>

<div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h4 mb-0">Pokemon Pilihan</h2>
        <a href="{{ route('pokemon.index') }}" class="btn btn-sm btn-outline-danger rounded-pill fw-semibold px-3">
            Lihat Semua Katalog <i class="bi bi-arrow-right"></i>
        </a>
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
        <a href="{{ route('news.index') }}" class="btn btn-sm btn-outline-danger rounded-pill fw-semibold px-3">
            Semua Berita <i class="bi bi-arrow-right"></i>
        </a>
    </div>
    <div class="row g-4">
        @forelse ($latestNews as $news)
            <div class="col-md-4">
                <div class="card h-100 shadow-sm border-0">
                    <div class="card-body">
                        <span class="badge bg-danger mb-2">{{ $news->category }}</span>
                        <h5 class="card-title"><a href="{{ route('news.show', $news) }}" class="text-decoration-none text-dark">{{ $news->title }}</a></h5>
                        <p class="card-text small text-muted">{{ $news->excerpt }}</p>
                        <a href="{{ route('news.show', $news) }}" class="small fw-semibold text-danger text-decoration-none">Baca selengkapnya <i class="bi bi-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        @empty
            <p class="text-muted">Belum ada berita.</p>
        @endforelse
    </div>
</div>
@endsection
