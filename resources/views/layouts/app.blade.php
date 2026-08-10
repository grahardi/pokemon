<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Pokemon.id') - Berita, Info & Katalog Pokemon</title>
    <meta name="description" content="Pokemon.id — portal berita, info seputar game, dan katalog lengkap Pokemon berbahasa Indonesia.">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        :root {
            --brand-red: #DC0A2D;
            --brand-yellow: #FFCB05;
            --brand-blue: #3B4CCA;
        }
        body { background-color: #f4f5f7; }
        .navbar-brand span.dot-y { color: var(--brand-yellow); }
        .navbar-pokemon { background: linear-gradient(90deg, var(--brand-red), #b8081f); }
        .navbar-pokemon .nav-link { color: #fff !important; font-weight: 500; }
        .navbar-pokemon .nav-link:hover { color: var(--brand-yellow) !important; }
        .navbar-pokemon .navbar-brand { color: #fff !important; font-weight: 800; letter-spacing: .5px; }
        .type-badge {
            display: inline-block;
            padding: .25rem .6rem;
            border-radius: .5rem;
            color: #fff;
            font-size: .75rem;
            font-weight: 600;
            text-shadow: 0 1px 1px rgba(0,0,0,.25);
        }
        .pokemon-card { transition: transform .15s ease, box-shadow .15s ease; border: none; }
        .pokemon-card:hover { transform: translateY(-4px); box-shadow: 0 .75rem 1.5rem rgba(0,0,0,.1); }
        .pokemon-card img { background: radial-gradient(circle, #fff 60%, #eee 100%); padding: .75rem; }
        .dex-number { color: #9aa0a6; font-weight: 700; font-size: .8rem; }
        .hero-pokeball {
            background: radial-gradient(circle at top right, rgba(255,255,255,.15), transparent 60%);
        }
        footer { background: #1f2937; color: #cbd5e1; }
        footer a { color: #fff; text-decoration: none; }
        .sponsor-badge { transition: opacity .15s ease; }
        .sponsor-badge:hover { opacity: .8; }
        .sponsor-logo { width: auto; object-fit: contain; }
        .stat-bar { height: .5rem; border-radius: .5rem; background: #e5e7eb; overflow: hidden; }
        .stat-bar > div { height: 100%; }

        /* Hero slider */
        #heroSlider { margin-top: -1px; }
        .hero-slide {
            height: 62vh;
            min-height: 380px;
            max-height: 620px;
            background-size: cover;
            background-position: center;
            position: relative;
        }
        .hero-caption { max-width: 640px; }
        .hero-title { text-shadow: 0 2px 10px rgba(0,0,0,.45); }
        #heroSlider .carousel-control-prev,
        #heroSlider .carousel-control-next { width: 5%; opacity: .7; }
        #heroSlider .carousel-indicators button {
            width: 10px; height: 10px; border-radius: 50%; margin: 0 4px;
        }
        @media (max-width: 767.98px) {
            .hero-slide { height: 68vh; min-height: 440px; }
            .hero-title { font-size: 1.75rem; }
        }
    </style>
    @stack('styles')
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-pokemon sticky-top shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="{{ route('home') }}">
                <i class="bi bi-circle-half"></i> Pokemon<span class="dot-y">.id</span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navMain">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link {{ request()->routeIs('home') ? 'fw-bold' : '' }}" href="{{ route('home') }}">Beranda</a></li>
                    <li class="nav-item"><a class="nav-link {{ request()->routeIs('pokemon.*') ? 'fw-bold' : '' }}" href="{{ route('pokemon.index') }}">Katalog Pokemon</a></li>
                    <li class="nav-item"><a class="nav-link {{ request()->routeIs('news.*') ? 'fw-bold' : '' }}" href="{{ route('news.index') }}">Berita</a></li>
                    <li class="nav-item"><a class="nav-link {{ request()->routeIs('games.*') ? 'fw-bold' : '' }}" href="{{ route('games.index') }}">Game</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <main>
        @yield('content')
    </main>

    <footer class="py-5 mt-5">
        <div class="container">
            <div class="row g-4">
                <div class="col-md-4">
                    <h5 class="text-white">Pokemon<span style="color: var(--brand-yellow)">.id</span></h5>
                    <p class="small">Portal komunitas Pokemon Indonesia — berita, info, dan katalog Pokemon terlengkap.</p>
                </div>
                <div class="col-md-4">
                    <h6 class="text-white">Navigasi</h6>
                    <ul class="list-unstyled small">
                        <li><a href="{{ route('pokemon.index') }}">Katalog Pokemon</a></li>
                        <li><a href="{{ route('news.index') }}">Berita</a></li>
                        <li><a href="{{ route('games.index') }}">Game</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h6 class="text-white">Tentang</h6>
                    <p class="small">Situs ini adalah fan-site tidak resmi. Pokémon dan seluruh karakter terkait merupakan hak cipta Nintendo, Game Freak, dan Creatures Inc.</p>
                </div>
            </div>
            <hr class="border-secondary">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-2">
                <p class="small text-center text-md-start mb-0">&copy; {{ date('Y') }} Pokemon.id. Dibuat dengan Laravel.</p>
                <a href="https://www.intan.net.id/" target="_blank" rel="noopener" class="d-flex align-items-center gap-2 text-decoration-none small sponsor-badge" title="PT Bella Intan Media adalah perusahaan penyedia layanan Internet (ISP), Hosting, IP Transit, dan Web Design.">
                    <span class="text-secondary">Hosting &amp; server disponsori oleh</span>
                    <img src="{{ asset('images/sponsor-bellanet-white.png') }}" alt="PT Bella Intan Media" height="24" class="sponsor-logo">
                </a>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    @stack('scripts')
</body>
</html>
