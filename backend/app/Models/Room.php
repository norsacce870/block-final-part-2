<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Room extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_room';

    protected $fillable = [
        'name',
        'capacity',
        'format',
        'price',
    ];

    public function screenings()
    {
        return $this->hasMany(Screening::class, 'id_room', 'id_room');
    }
}
