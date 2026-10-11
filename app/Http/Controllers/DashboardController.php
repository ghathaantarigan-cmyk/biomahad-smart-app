<?php

namespace App\Http\Controllers;

use App\Models\TelemetryLog;
use App\Models\SystemAlert;
use App\Models\WasteInput;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Telemetri Terakhir & Histori Terbaru
        $latestTelemetry = TelemetryLog::latest()->first();
        $recentTelemetry = TelemetryLog::latest()->take(20)->get()->reverse()->values();

        // 2. Status & Badge EWS
        $activeAlertsCount = SystemAlert::where('is_resolved', false)->count();
        $latestStatus = $latestTelemetry?->status_warning ?? 'SAFE';

        // 3. Kalkulasi Smart Add-On (Biogas & LPG Offset)
        $totalWasteKg = WasteInput::sum('weight_kg') ?? 0;
        $estimatedBiogasM3 = round($totalWasteKg * 0.045, 2); // 1kg sampah ≈ 0.045 m³ biogas
        $lpg3kgEquivalent = round($estimatedBiogasM3 / 1.35, 1); // 1 tabung LPG 3kg ≈ 1.35 m³
        $savingsRupiah = number_format($lpg3kgEquivalent * 20000, 0, ',', '.'); // Asumsi Rp 20.000 / tabung

        return Inertia::render('Dashboard', [
            'latestTelemetry'   => $latestTelemetry,
            'recentTelemetry'   => $recentTelemetry,
            'activeAlertsCount' => $activeAlertsCount,
            'latestStatus'      => $latestStatus,
            'stats' => [
                'totalWasteKg'      => $totalWasteKg,
                'estimatedBiogasM3' => $estimatedBiogasM3,
                'lpg3kgEquivalent'  => $lpg3kgEquivalent,
                'savingsRupiah'     => $savingsRupiah,
            ],
        ]);
    }
}