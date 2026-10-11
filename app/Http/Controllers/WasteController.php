<?php

namespace App\Http\Controllers;

use App\Models\WasteInput;
use App\Models\SystemAlert;
use App\Models\TelemetryLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WasteController extends Controller
{
    public function index(Request $request)
    {
        $wasteLogs = WasteInput::when($request->search, function ($query, $search) {
            $query->where('waste_type', 'iLIKE', "%{$search}%")
                  ->orWhere('notes', 'iLIKE', "%{$search}%");
        })->latest('input_date')->paginate(10);

        $activeAlertsCount = SystemAlert::where('is_resolved', false)->count();
        $latestTelemetry = TelemetryLog::latest()->first();

        return Inertia::render('Waste/Index', [
            'wasteLogs'         => $wasteLogs,
            'filters'           => $request->only(['search']),
            'activeAlertsCount' => $activeAlertsCount,
            'latestStatus'      => $latestTelemetry?->status_warning ?? 'SAFE',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'weight_kg'  => 'required|numeric|min:0.1',
            'category'   => 'required|string',
            'entry_date' => 'required|date',
            'notes'      => 'nullable|string|max:255',
        ]);

        WasteInput::create([
            'weight_kg'  => $validated['weight_kg'],
            'waste_type' => $validated['category'],
            'input_date' => $validated['entry_date'],
            'notes'      => $validated['notes'] ?? null,
        ]);

        return redirect()->route('waste.index')->with('message', 'Data sampah berhasil disimpan!');
    }
}