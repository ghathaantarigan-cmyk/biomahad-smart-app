<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('telemetry_logs', function (Blueprint $table) {
            $table->id();
            
            // Kolom pembacaan sensor IoT
            $table->float('temperature');
            $table->float('ph_level');
            $table->float('ch4_ppm');
            $table->float('pressure_bar');
            $table->float('flow_rate');
            
            // Status EWS
            $table->string('status_warning')->default('SAFE');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('telemetry_logs');
    }
};