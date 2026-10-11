<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\WasteController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SettingsController;

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

Route::get('/alerts', [AlertController::class, 'index'])->name('alerts.index');
Route::patch('/alerts/{alert}/resolve', [AlertController::class, 'resolve'])->name('alerts.resolve');

Route::get('/waste', [WasteController::class, 'index'])->name('waste.index');
Route::post('/waste', [WasteController::class, 'store'])->name('waste.store');

Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
Route::post('/settings', [SettingsController::class, 'update'])->name('settings.update');