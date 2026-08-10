@extends('layouts.app')

@section('title', $pokemon->name)

@section('content')
@php
    $colors = config('pokemon.type_colors');
    $stats = [
        'HP' => [$pokemon->hp, '#F87171'],
        'Attack' => [$pokemon->attack, '#FB923C'],
        'Defense' => [$pokemon->defense, '#FBBF24'],
        'Sp. Attack' => [$pokemon->sp_attack, '#60A5FA'],
        'Sp. Defense' => [$pokemon->sp_defense, '#34D399'],
        'Speed' => [$pokemon->speed, '#F472B6'],
    ];
    $primaryColor = $colors[$pokemon->types[0]] ?? '#DC0A2D';
@endphp

<div class="py-4" style="background: linear-gradient(135deg, {{ $primaryColor }}, #222 220%);">
    <div class="container">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb small">
                <li class="breadcrumb-item"><a href="{{ route('pokemon.index') }}" class="text-white-50">Katalog</a></li>
                <li class="breadcrumb-item active text-white" aria-current="page">{{ $pokemon->name }}</li>
            </ol>
        </nav>
        <div class="row align-items-center text-white">
            <div class="col-md-4 text-center">
                <img src="{{ $pokemon->display_image }}" alt="{{ $pokemon->name }}" class="img-fluid" style="max-height: 260px; filter: drop-shadow(0 10px 15px rgba(0,0,0,.3));">
            </div>
            <div class="col-md-8">
                <div class="dex-number text-white-50">{{ $pokemon->formatted_dex }}</div>
                <h1 class="display-6 fw-bold">{{ $pokemon->name }}</h1>
                @if ($pokemon->name_japanese)
                    <p class="text-white-50 mb-1">{{ $pokemon->name_japanese }}</p>
                @endif
                <div class="d-flex align-items-center gap-2 mb-3 flex-wrap">
                    <span class="badge bg-white text-dark">{{ $pokemon->generation_label }}</span>
                    @if ($pokemon->genus)
                        <span class="text-white-50 small">{{ $pokemon->genus }}</span>
                    @endif
                </div>
                <div class="d-flex gap-2 mb-3">
                    @foreach ($pokemon->types as $type)
                        <span class="type-badge fs-6" style="background-color: {{ $colors[$type] ?? '#777' }}">{{ $type }}</span>
                    @endforeach
                </div>
                <div class="d-flex gap-2">
                    @if ($prev)
                        <a href="{{ route('pokemon.show', $prev) }}" class="btn btn-sm btn-light"><i class="bi bi-chevron-left"></i> {{ $prev->name }}</a>
                    @endif
                    @if ($next)
                        <a href="{{ route('pokemon.show', $next) }}" class="btn btn-sm btn-light">{{ $next->name }} <i class="bi bi-chevron-right"></i></a>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container py-5">
    <div class="row">
        <div class="col-lg-7">
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body">
                    <h5 class="card-title mb-3">Statistik Dasar</h5>
                    @foreach ($stats as $label => [$value, $color])
                        <div class="mb-3">
                            <div class="d-flex justify-content-between small mb-1">
                                <span>{{ $label }}</span>
                                <span class="fw-bold">{{ $value }}</span>
                            </div>
                            <div class="stat-bar">
                                <div style="width: {{ min(100, round($value / 180 * 100)) }}%; background-color: {{ $color }}"></div>
                            </div>
                        </div>
                    @endforeach
                    <div class="d-flex justify-content-between border-top pt-3 mt-3 fw-bold">
                        <span>Total</span>
                        <span>{{ $pokemon->total_stats }}</span>
                    </div>
                </div>
            </div>

            @if (count($pokemon->weaknesses) > 0)
                <div class="card border-0 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title mb-3">Kelemahan Tipe</h5>
                        <p class="text-muted small mb-3">Tipe serangan berikut memberi damage lebih besar ke {{ $pokemon->name }}:</p>
                        <div class="d-flex flex-wrap gap-2">
                            @foreach ($pokemon->weaknesses as $w)
                                <span class="type-badge fs-6 d-inline-flex align-items-center gap-1" style="background-color: {{ $colors[$w['type']] ?? '#777' }}">
                                    {{ $w['type'] }}
                                    <small class="opacity-75">{{ rtrim(rtrim(number_format($w['multiplier'], 1), '0'), '.') }}x</small>
                                </span>
                            @endforeach
                        </div>
                    </div>
                </div>
            @endif
        </div>

        <div class="col-lg-5">
            <div class="card border-0 shadow-sm info-cepat-card">
                <div class="card-body">
                    <h6 class="card-title text-white-50 text-uppercase small fw-bold mb-3" style="letter-spacing:.5px">Info Cepat</h6>
                    <div class="row gy-3">
                        <div class="col-6">
                            <div class="text-white-50 small">Nomor Dex</div>
                            <div class="fw-bold">{{ $pokemon->formatted_dex }}</div>
                        </div>
                        <div class="col-6">
                            <div class="text-white-50 small">Generasi</div>
                            <div class="fw-bold">{{ $pokemon->generation_label }}</div>
                        </div>
                        @if ($pokemon->genus)
                            <div class="col-6">
                                <div class="text-white-50 small">Kategori</div>
                                <div class="fw-bold">{{ $pokemon->genus }}</div>
                            </div>
                        @endif
                        <div class="col-6">
                            <div class="text-white-50 small">Tipe</div>
                            <div class="fw-bold">{{ implode(' / ', $pokemon->types) }}</div>
                        </div>
                        @if ($pokemon->height_m)
                            <div class="col-6">
                                <div class="text-white-50 small">Tinggi</div>
                                <div class="fw-bold">{{ number_format($pokemon->height_m, 1) }} m</div>
                            </div>
                        @endif
                        @if ($pokemon->weight_kg)
                            <div class="col-6">
                                <div class="text-white-50 small">Berat</div>
                                <div class="fw-bold">{{ number_format($pokemon->weight_kg, 1) }} kg</div>
                            </div>
                        @endif
                        <div class="col-6">
                            <div class="text-white-50 small">Total Stat Dasar</div>
                            <div class="fw-bold">{{ $pokemon->total_stats }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @if (count($evolutions) > 1)
        <div class="evolution-panel mt-4 p-4 p-md-5">
            <h5 class="text-white mb-4">Evolusi</h5>
            <div class="d-flex align-items-center justify-content-center flex-wrap gap-3">
                @foreach ($evolutions as $i => $stage)
                    @if ($i > 0)
                        <div class="evo-arrow"><i class="bi bi-chevron-right"></i></div>
                    @endif
                    <div class="d-flex gap-3 flex-wrap justify-content-center">
                        @foreach ($stage as $p)
                            <a href="{{ route('pokemon.show', $p->slug) }}" class="evo-item text-decoration-none text-center">
                                <div class="evo-circle {{ $p->id === $pokemon->id ? 'evo-circle--active' : '' }}">
                                    <img src="{{ $p->display_image }}" alt="{{ $p->name }}">
                                </div>
                                <div class="text-white small fw-semibold mt-2">{{ $p->name }}</div>
                                <div class="text-white-50" style="font-size:.75rem">{{ '#' . str_pad($p->dex_number, 3, '0', STR_PAD_LEFT) }}</div>
                            </a>
                        @endforeach
                    </div>
                @endforeach
            </div>
        </div>
    @endif
</div>
@endsection
