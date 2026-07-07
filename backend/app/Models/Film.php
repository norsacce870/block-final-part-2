<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Film extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_film';

    protected $fillable = [
        'title',
        'synopsis',
        'duration_min',
        'poster',
        'actors',
        'director',
        'release_date',
        'trailer_url',
        'status',
        'id_category',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'id_category', 'id_category');
    }

    public function screenings()
    {
        return $this->hasMany(Screening::class, 'id_film', 'id_film');
    }
}
