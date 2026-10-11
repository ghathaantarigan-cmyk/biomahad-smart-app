<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WasteInput;
use App\Models\TelemetryLog;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function getBiogasEstimation()
    {
        // 1. Hitung Total Akumulasi Sampah Organik (Kg)
        $totalWasteKg = WasteInput::sum('weight_kg');

        // 2. Rumus Estimasi Biogas: 1 kg sampah organik ~ 0.045 m3 biogas
        $estimatedBiogasM3 = round($totalWasteKg * 0.045, 2);

        // 3. Rumus Konversi LPG: 1 m3 biogas ~ 0.46 kg LPG
        $equivalentLpgKg = round($estimatedBiogasM3 * 0.46, 2);

        // 4. Konversi ke Jumlah Tabung LPG 3kg
        $equivalentLpg3kgCylinders = round($equivalentLpgKg / 3, 1);

        // 5. Estimasi Penghematan Rupiah (Asumsi Rp 20.000 per tabung LPG 3kg)
        $estimatedCostSavingsRupiah = round($equivalentLpg3kgCylinders * 20000);

        return response()->json([
            'success' => true,
            'message' => 'Data estimasi produksi biogas berhasil dihitung.',
            'data' => [
                'total_waste_kg' => $totalWasteKg,
                'estimated_biogas_m3' => $estimatedBiogasM3,
                'equivalent_lpg_kg' => $equivalentLpgKg,
                'equivalent_lpg_3kg_cylinders' => $equivalentLpg3kgCylinders,
                'estimated_cost_savings_idr' => $estimatedCostSavingsRupiah,
            ]
        ], 200);
    }
}