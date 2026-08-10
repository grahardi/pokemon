@extends('layouts.app')

@section('title', 'Katalog Pokemon')

@section('content')
<div class="bg-white border-bottom py-4 mb-4">
    <div class="container">
        <h1 class="h3 mb-3">Katalog Pokemon</h1>
        <form method="GET" action="{{ route('pokemon.index') }}" class="row g-2">
            <div class="col-md-4">
                <input type="text" name="q" value="{{ request('q') }}" class="form-control" placeholder="Cari nama atau nomor dex...">
            </div>
            <div class="col-md-3">
                <select name="type" class="form-select">
                    <option value="">Semua Tipe</option>
                    @foreach ($types as $type)
                        <option value="{{ $type }}" @selected(request('type') === $type)>{{ $type }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-3">
                <select name="generation" class="form-select">
                    <option value="">Semua Generasi</option>
                    @foreach ($generations as $gen => $label)
                        <option value="{{ $gen }}" @selected((string) request('generation') === (string) $gen)>{{ $label }}</option>
                    @endforeach
                </select>
            </div>
            <div class="col-md-2 d-grid">
                <button class="btn btn-danger fw-bold" type="submit"><i class="bi bi-search"></i> Cari</button>
            </div>
        </form>
    </div>
</div>

<div class="container pb-5">
    <p class="text-muted small">Menampilkan {{ $pokemons->total() }} Pokemon</p>
    <div class="row g-3">
        @forelse ($pokemons as $pokemon)
            @include('partials.pokemon-card', ['pokemon' => $pokemon])
        @empty
            <div class="col-12 text-center py-5 text-muted">
                <i class="bi bi-emoji-frown fs-1"></i>
                <p>Tidak ada Pokemon yang cocok dengan pencarianmu.</p>
            </div>
        @endforelse
    </div>

    <div class="mt-4">
        {{ $pokemons->links() }}
    </div>
</div>
@endsection
