<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SensorThreshold extends Model
{
    use HasFactory;

    protected $fillable = [
        'parameter_name',
        'value',
        'unit',
        'description',
    ];
}