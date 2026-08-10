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
        <div class="col-lg-8">
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
        </div>
        <div class="col-lg-4">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <h6 class="card-title">Info Cepat</h6>
                    <ul class="list-unstyled small mb-0">
                        <li class="mb-2"><strong>Nomor Dex:</strong> {{ $pokemon->formatted_dex }}</li>
                        <li class="mb-2"><strong>Generasi:</strong> {{ $pokemon->generation_label }}</li>
                        @if ($pokemon->genus)
                            <li class="mb-2"><strong>Kategori:</strong> {{ $pokemon->genus }}</li>
                        @endif
                        <li class="mb-2"><strong>Tipe:</strong> {{ implode(' / ', $pokemon->types) }}</li>
                        @if ($pokemon->height_m)
                            <li class="mb-2"><strong>Tinggi:</strong> {{ number_format($pokemon->height_m, 1) }} m</li>
                        @endif
                        @if ($pokemon->weight_kg)
                            <li class="mb-2"><strong>Berat:</strong> {{ number_format($pokemon->weight_kg, 1) }} kg</li>
                        @endif
                        <li><strong>Total Stat Dasar:</strong> {{ $pokemon->total_stats }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
