import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/layouts/MainLayout";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import {
    Thermometer,
    Droplets,
    Gauge,
    Wind,
    Activity,
    Flame,
    Wallet,
    Send,
} from "lucide-react";

export default function Dashboard({ latestTelemetry, recentTelemetry, stats }) {
    const [chartRange, setChartRange] = useState("today");

    // State untuk menyimpan data telemetri real-time
    const [telemetry, setTelemetry] = useState(latestTelemetry || null);
    const [chartData, setChartData] = useState(recentTelemetry || []);

    // Effect Listener Laravel Echo / Reverb
    useEffect(() => {
        if (window.Echo) {
            window.Echo.channel("telemetry-channel").listen(
                ".TelemetryEvent",
                (e) => {
                    console.log("Data Telemetri Real-Time Masuk:", e.telemetry);

                    // 1. Update kartu metrik terbaru
                    setTelemetry(e.telemetry);

                    // 2. Tambahkan data baru ke grafik tren
                    setChartData((prevData) => {
                        const updatedData = [...prevData, e.telemetry];
                        // Batasi maksimal 20 titik data terakhir agar grafik tidak terlalu padat
                        return updatedData.slice(-20);
                    });
                },
            );
        }

        return () => {
            if (window.Echo) {
                window.Echo.leaveChannel("telemetry-channel");
            }
        };
    }, []);

    // Helper format jam:menit
    const formatXAxisTime = (tickItem) => {
        if (!tickItem) return "";
        const date = new Date(tickItem);
        return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    return (
        <MainLayout>
            <Head title="Telemetri Real-Time" />

            <div className="space-y-6 sm:space-y-8">
                {/* 1. Telemetry Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    {/* Suhu */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center text-slate-400 mb-2">
                            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                                Suhu Reaktor
                            </span>
                            <Thermometer className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
                        </div>
                        <div className="text-lg sm:text-2xl font-bold text-slate-900">
                            {telemetry?.temperature ?? "30.5"}{" "}
                            <span className="text-xs sm:text-sm font-normal text-slate-500">
                                °C
                            </span>
                        </div>
                    </div>

                    {/* pH */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center text-slate-400 mb-2">
                            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                                Tingkat pH
                            </span>
                            <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" />
                        </div>
                        <div className="text-lg sm:text-2xl font-bold text-slate-900">
                            {telemetry?.ph_level ?? "6.8"}
                        </div>
                    </div>

                    {/* Gas CH4 */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center text-slate-400 mb-2">
                            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                                Gas CH4
                            </span>
                            <Wind className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" />
                        </div>
                        <div className="text-lg sm:text-2xl font-bold text-slate-900">
                            {telemetry?.ch4_ppm ?? "550"}{" "}
                            <span className="text-xs sm:text-sm font-normal text-slate-500">
                                PPM
                            </span>
                        </div>
                    </div>

                    {/* Tekanan Gas */}
                    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center text-slate-400 mb-2">
                            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                                Tekanan Gas
                            </span>
                            <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 shrink-0" />
                        </div>
                        <div className="text-lg sm:text-2xl font-bold text-slate-900">
                            {telemetry?.pressure_bar ??
                                telemetry?.gas_bar ??
                                "1.2"}{" "}
                            <span className="text-xs sm:text-sm font-normal text-slate-500">
                                Bar
                            </span>
                        </div>
                    </div>

                    {/* Laju Aliran */}
                    <div className="col-span-2 sm:col-span-1 bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center text-slate-400 mb-2">
                            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">
                                Laju Aliran
                            </span>
                            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 shrink-0" />
                        </div>
                        <div className="text-lg sm:text-2xl font-bold text-slate-900">
                            {telemetry?.flow_rate ?? "2.4"}{" "}
                            <span className="text-xs sm:text-sm font-normal text-slate-500">
                                L/min
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Chart & Smart Add-On Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Panel Grafik Tren */}
                    <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                                    Grafik Tren Historis Telemetri
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Perubahan parameter sensor real-time
                                </p>
                            </div>

                            {/* Tombol Filter Rentang Waktu */}
                            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600 self-start sm:self-auto">
                                <button
                                    onClick={() => setChartRange("today")}
                                    className={`px-3 py-1.5 rounded-lg transition ${
                                        chartRange === "today"
                                            ? "bg-white shadow text-slate-900"
                                            : ""
                                    }`}
                                >
                                    Hari Ini
                                </button>
                                <button
                                    onClick={() => setChartRange("7days")}
                                    className={`px-3 py-1.5 rounded-lg transition ${
                                        chartRange === "7days"
                                            ? "bg-white shadow text-slate-900"
                                            : ""
                                    }`}
                                >
                                    7 Hari
                                </button>
                                <button
                                    onClick={() => setChartRange("30days")}
                                    className={`px-3 py-1.5 rounded-lg transition ${
                                        chartRange === "30days"
                                            ? "bg-white shadow text-slate-900"
                                            : ""
                                    }`}
                                >
                                    30 Hari
                                </button>
                            </div>
                        </div>

                        {/* Kontainer Grafik Adaptif */}
                        <div className="h-60 sm:h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#f1f5f9"
                                    />
                                    <XAxis
                                        dataKey="created_at"
                                        tickFormatter={formatXAxisTime}
                                        minTickGap={20}
                                        interval="preserveStartEnd"
                                        tick={{ fontSize: 10 }}
                                        stroke="#94a3b8"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10 }}
                                        stroke="#94a3b8"
                                        width={30}
                                    />
                                    <Tooltip
                                        labelFormatter={(label) => {
                                            if (!label) return "";
                                            const date = new Date(label);
                                            return date.toLocaleString(
                                                "id-ID",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                },
                                            );
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="temperature"
                                        name="Suhu (°C)"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="ph_level"
                                        name="pH"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="pressure_bar"
                                        name="Tekanan (Bar)"
                                        stroke="#f43f5e"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Panel Smart Biogas & Impact */}
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-6">
                        <div>
                            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-1 text-base sm:text-lg">
                                <Flame className="w-5 h-5 text-emerald-600" />{" "}
                                Smart Biogas & Impact
                            </h3>
                            <p className="text-xs text-slate-500">
                                Estimasi hasil pengolahan energi organik
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
                                <span className="text-xs text-emerald-800 font-medium">
                                    Estimasi Volume Gas
                                </span>
                                <div className="text-xl sm:text-2xl font-bold text-emerald-900 mt-1">
                                    {stats?.estimatedBiogasM3 ?? 0}{" "}
                                    <span className="text-xs sm:text-sm font-normal text-emerald-700">
                                        m³
                                    </span>
                                </div>
                                <p className="text-[11px] text-emerald-600 mt-1">
                                    Dari akumulasi {stats?.totalWasteKg ?? 0} Kg
                                    sampah
                                </p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                    <Wallet className="w-4 h-4 text-emerald-600" />{" "}
                                    Kesetaraan LPG 3kg
                                </span>
                                <div className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                                    ~{stats?.lpg3kgEquivalent ?? 0}{" "}
                                    <span className="text-xs sm:text-sm font-normal text-slate-500">
                                        Tabung
                                    </span>
                                </div>
                                <p className="text-xs font-semibold text-emerald-600 mt-1">
                                    Penghematan: Rp{" "}
                                    {stats?.savingsRupiah ?? "0"}
                                </p>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-900 text-slate-300 rounded-xl text-xs flex items-center gap-3">
                            <Send className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span>
                                Sistem terhubung otomatis ke grup Telegram
                                pengelola.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
