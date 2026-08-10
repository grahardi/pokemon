@php $colors = config('pokemon.type_colors'); @endphp
<div class="col-6 col-md-4 col-lg-3">
    <a href="{{ route('pokemon.show', $pokemon) }}" class="text-decoration-none text-dark">
        <div class="card pokemon-card h-100 shadow-sm text-center">
            <img src="{{ $pokemon->image_url }}" class="card-img-top" style="height:150px;object-fit:contain" loading="lazy" alt="{{ $pokemon->name }}">
            <div class="card-body py-2">
                <div class="dex-number">{{ $pokemon->formatted_dex }}</div>
                <h6 class="card-title mb-2">{{ $pokemon->name }}</h6>
                <div class="d-flex justify-content-center gap-1 flex-wrap">
                    @foreach ($pokemon->types as $type)
                        <span class="type-badge" style="background-color: {{ $colors[$type] ?? '#777' }}">{{ $type }}</span>
                    @endforeach
                </div>
            </div>
        </div>
    </a>
</div>
