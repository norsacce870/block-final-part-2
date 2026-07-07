<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Screening extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_screening';

    protected $fillable = [
        'date',
        'time',
        'seats_remaining',
        'id_film',
        'id_room',
    ];

    public function film()
    {
        return $this->belongsTo(Film::class, 'id_film', 'id_film');
    }

    public function room()
    {
        return $this->belongsTo(Room::class, 'id_room', 'id_room');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'id_screening', 'id_screening');
    }
}
