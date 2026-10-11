<?php

namespace App\Http\Controllers;

use App\Models\SensorThreshold;
use App\Models\SystemAlert;
use App\Models\TelemetryLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $thresholds = SensorThreshold::all()->pluck('value', 'parameter_name');
        $activeAlertsCount = SystemAlert::where('is_resolved', false)->count();
        $latestTelemetry = TelemetryLog::latest()->first();

        return Inertia::render('Settings/Index', [
            'thresholds'        => $thresholds,
            'activeAlertsCount' => $activeAlertsCount,
            'latestStatus'      => $latestTelemetry?->status_warning ?? 'SAFE',
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'ph_min'       => 'required|numeric',
            'ph_max'       => 'required|numeric',
            'pressure_max' => 'required|numeric',
            'temp_max'     => 'required|numeric',
        ]);

        foreach ($validated as $key => $value) {
            SensorThreshold::updateOrCreate(
                ['parameter_name' => $key],
                ['value' => $value]
            );
        }

        return redirect()->back()->with('message', 'Ambang batas sensor berhasil diperbarui!');
    }
}