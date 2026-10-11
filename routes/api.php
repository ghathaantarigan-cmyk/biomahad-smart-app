<?php

use App\Http\Controllers\Api\TelemetryController;
use Illuminate\Support\Facades\Route;


Route::post('/v1/telemetry', [TelemetryController::class, 'store']);
Route::post('/telemetry', [TelemetryController::class, 'storeFromEsp']);