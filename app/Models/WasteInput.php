<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WasteInput extends Model
{
    use HasFactory;

    protected $table = 'waste_inputs';

    protected $fillable = [
        'weight_kg',
        'waste_type',
        'input_date',
        'notes',
    ];
}