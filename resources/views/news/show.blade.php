@extends('layouts.app')

@section('title', $news->title)

@section('content')
<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb small">
                    <li class="breadcrumb-item"><a href="{{ route('news.index') }}">Berita</a></li>
                    <li class="breadcrumb-item active">{{ $news->title }}</li>
                </ol>
            </nav>
            <span class="badge bg-danger mb-2">{{ $news->category }}</span>
            <h1 class="h3 mb-2">{{ $news->title }}</h1>
            <p class="text-muted small"><i class="bi bi-calendar3"></i> {{ optional($news->published_at)->translatedFormat('d F Y') }}</p>
            <hr>
            <div class="news-body">
                {!! nl2br(e($news->body)) !!}
            </div>

            @if ($related->isNotEmpty())
                <hr class="my-5">
                <h5 class="mb-3">Berita Terkait</h5>
                <div class="row g-3">
                    @foreach ($related as $item)
                        <div class="col-md-4">
                            <a href="{{ route('news.show', $item) }}" class="text-decoration-none text-dark">
                                <div class="card h-100 shadow-sm border-0">
                                    <div class="card-body">
                                        <h6 class="card-title">{{ $item->title }}</h6>
                                    </div>
                                </div>
                            </a>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
