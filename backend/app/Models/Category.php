<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_category';

    protected $fillable = [
        'name',
    ];

    public function films()
    {
        return $this->hasMany(Film::class, 'id_category', 'id_category');
    }
}
