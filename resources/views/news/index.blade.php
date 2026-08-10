@extends('layouts.app')

@section('title', 'Berita')

@section('content')
<div class="container py-5">
    <h1 class="h3 mb-4">Berita &amp; Info Pokemon</h1>
    <div class="row g-4">
        @forelse ($newsList as $news)
            <div class="col-md-4">
                <div class="card h-100 shadow-sm border-0">
                    <div class="card-body">
                        <span class="badge bg-danger mb-2">{{ $news->category }}</span>
                        <h5 class="card-title"><a href="{{ route('news.show', $news) }}" class="text-decoration-none text-dark">{{ $news->title }}</a></h5>
                        <p class="card-text small text-muted">{{ $news->excerpt }}</p>
                        <p class="small text-muted mb-0"><i class="bi bi-calendar3"></i> {{ optional($news->published_at)->translatedFormat('d F Y') }}</p>
                    </div>
                </div>
            </div>
        @empty
            <p class="text-muted">Belum ada berita.</p>
        @endforelse
    </div>
    <div class="mt-4">{{ $newsList->links() }}</div>
</div>
@endsection
