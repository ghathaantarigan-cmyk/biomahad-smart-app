<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TelemetryLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'temperature',
        'ph_level',
        'ch4_ppm',
        'pressure_bar',
        'flow_rate',
        'status_warning',
    ];
}