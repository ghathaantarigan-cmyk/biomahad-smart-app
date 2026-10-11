<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sensor_thresholds', function (Blueprint $table) {
            $table->id();
            $table->string('parameter_name')->unique(); // e.g., 'ph_min', 'ph_max', 'pressure_max', 'temp_max'
            $table->float('value');
            $table->string('unit')->nullable(); // e.g., 'pH', 'Bar', '°C'
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sensor_thresholds');
    }
};