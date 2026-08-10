<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'platform',
        'generation',
        'release_date',
        'cover_image',
        'description',
    ];

    protected $casts = [
        'release_date' => 'date',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
