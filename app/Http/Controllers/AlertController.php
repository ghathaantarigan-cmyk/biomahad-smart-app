<?php

namespace App\Http\Controllers;

use App\Models\SystemAlert;
use App\Models\TelemetryLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AlertController extends Controller
{
    public function index()
    {
        $alerts = SystemAlert::latest()->paginate(15);
        $activeAlertsCount = SystemAlert::where('is_resolved', false)->count();
        $latestTelemetry = TelemetryLog::latest()->first();

        return Inertia::render('Alerts/Index', [
            'alerts'            => $alerts,
            'activeAlertsCount' => $activeAlertsCount,
            'latestStatus'      => $latestTelemetry?->status_warning ?? 'SAFE',
        ]);
    }

    public function resolve(SystemAlert $alert)
    {
        // Update status resolusi
        $alert->update([
            'is_resolved' => true,
            'resolved_at' => now(),
        ]);

        return redirect()->back()->with('message', 'Peringatan berhasil diselesaikan!');
    }
}