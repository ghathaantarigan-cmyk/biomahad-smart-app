<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TelemetryLog;
use App\Models\SensorThreshold;
use App\Models\SystemAlert;
use Illuminate\Http\Request;
use Exception;
use App\Events\TelemetryUpdated;

class TelemetryController extends Controller
{
    public function storeFromEsp(Request $request)
    {
        try {
            // 1. Validasi Input JSON
            $validated = $request->validate([
                'temperature' => 'required|numeric',
                'ph_level'    => 'required|numeric',
                'ch4_ppm'     => 'required|numeric',
                'gas_bar'     => 'required|numeric',
                'flow_rate'   => 'required|numeric',
            ]);

            // 2. Ambil Ambang Batas dengan Fallback Default jika DB kosong
            $phMin = 6.5;
            $phMax = 7.8;
            $pressureMax = 1.5;

            try {
                $thresholds = SensorThreshold::pluck('value', 'parameter_name');
                if (isset($thresholds['ph_min'])) $phMin = (float) $thresholds['ph_min'];
                if (isset($thresholds['ph_max'])) $phMax = (float) $thresholds['ph_max'];
                if (isset($thresholds['pressure_max'])) $pressureMax = (float) $thresholds['pressure_max'];
            } catch (Exception $e) {
                // Abaikan jika tabel threshold belum terisi
            }

            // 3. Evaluasi EWS Status & Simpan Alert ke Variable
            $status = 'SAFE';
            $latestAlert = null;

            if ($validated['gas_bar'] >= $pressureMax) {
                $status = 'DANGER';
                $latestAlert = SystemAlert::create([
                    'alert_type'  => 'Tekanan Kritis',
                    'severity'    => 'DANGER',
                    'message'     => "Tekanan gas mencapai {$validated['gas_bar']} Bar (Max: {$pressureMax} Bar)",
                    'is_resolved' => false,
                ]);
            } elseif ($validated['ph_level'] < $phMin || $validated['ph_level'] > $phMax) {
                $status = 'WARNING';
                $latestAlert = SystemAlert::create([
                    'alert_type'  => 'pH Tidak Ideal',
                    'severity'    => 'WARNING',
                    'message'     => "Nilai pH reaktor {$validated['ph_level']} di luar batas normal ({$phMin} - {$phMax})",
                    'is_resolved' => false,
                ]);
            }

            // 4. Simpan Telemetry Log
            $telemetry = TelemetryLog::create([
                'temperature'    => $validated['temperature'],
                'ph_level'       => $validated['ph_level'],
                'ch4_ppm'        => $validated['ch4_ppm'],
                'pressure_bar'   => $validated['gas_bar'],
                'flow_rate'      => $validated['flow_rate'],
                'status_warning' => $status,
            ]);

            // 5. Broadcast Event Real-Time (Kirim Telemetry + Alert sekaligus)
            event(new TelemetryUpdated($telemetry, $latestAlert));

            return response()->json([
                'status'  => 'success',
                'message' => 'Telemetry log saved and broadcasted successfully',
                'data'    => $telemetry,
                'alert'   => $latestAlert,
            ], 201);

        } catch (Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage(),
                'line'    => $e->getLine(),
            ], 500);
        }
    }
}