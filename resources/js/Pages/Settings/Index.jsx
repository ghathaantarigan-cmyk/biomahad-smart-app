import React, { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import MainLayout from "@/layouts/MainLayout";
import { Save, Sliders, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Index({ thresholds }) {
    const { flash } = usePage().props;
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        ph_min: thresholds?.ph_min ?? 6.5,
        ph_max: thresholds?.ph_max ?? 7.8,
        pressure_max: thresholds?.pressure_max ?? 1.5,
        temp_max: thresholds?.temp_max ?? 40.0,
    });

    // Buka modal saat tombol awal diklik
    const handleOpenConfirm = (e) => {
        e.preventDefault();
        setIsConfirmOpen(true);
    };

    // Eksekusi simpan saat tombol "Ya, Simpan" di modal diklik
    const handleConfirmSave = () => {
        setIsConfirmOpen(false);
        post("/settings", {
            preserveScroll: true,
        });
    };

    return (
        <MainLayout>
            <Head title="Pengaturan Ambang Batas Sensor" />

            <div className="max-w-4xl bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                {/* Banner Pesan Sukses */}
                {flash?.message && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{flash.message}</span>
                    </div>
                )}

                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="p-3 bg-emerald-100 rounded-xl text-emerald-700">
                        <Sliders className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">
                            Konfigurasi Batas Ambang EWS
                        </h3>
                        <p className="text-xs text-slate-500">
                            Atur kriteria batas aman dan bahaya untuk trigger
                            notifikasi otomatis
                        </p>
                    </div>
                </div>

                <form onSubmit={handleOpenConfirm} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Threshold pH */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                            <h4 className="font-semibold text-sm text-slate-800">
                                Tingkat pH Minimal & Maksimal
                            </h4>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    pH Minimal (Aman)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={data.ph_min}
                                    onChange={(e) =>
                                        setData("ph_min", e.target.value)
                                    }
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    required
                                />
                                {errors.ph_min && (
                                    <span className="text-xs text-rose-500 mt-1 block">
                                        {errors.ph_min}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    pH Maksimal (Aman)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={data.ph_max}
                                    onChange={(e) =>
                                        setData("ph_max", e.target.value)
                                    }
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    required
                                />
                                {errors.ph_max && (
                                    <span className="text-xs text-rose-500 mt-1 block">
                                        {errors.ph_max}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Threshold Tekanan & Suhu */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                            <h4 className="font-semibold text-sm text-slate-800">
                                Tekanan & Suhu Maksimal
                            </h4>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Batas Maksimal Tekanan Gas (Bar)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={data.pressure_max}
                                    onChange={(e) =>
                                        setData("pressure_max", e.target.value)
                                    }
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    required
                                />
                                {errors.pressure_max && (
                                    <span className="text-xs text-rose-500 mt-1 block">
                                        {errors.pressure_max}
                                    </span>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    Batas Maksimal Suhu (°C)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={data.temp_max}
                                    onChange={(e) =>
                                        setData("temp_max", e.target.value)
                                    }
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    required
                                />
                                {errors.temp_max && (
                                    <span className="text-xs text-rose-500 mt-1 block">
                                        {errors.temp_max}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition shadow-md disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />{" "}
                        {processing ? "Menyimpan..." : "Simpan Pengaturan"}
                    </button>
                </form>
            </div>

            {/* ================= MODAL POP-UP KONFIRMASI ================= */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-slate-100 relative animate-in fade-in zoom-in duration-150">
                        <button
                            onClick={() => setIsConfirmOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-base">
                                    Konfirmasi Perubahan
                                </h4>
                                <p className="text-xs text-slate-500">
                                    Pembaruan ambang batas sensor EWS
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                            Apakah kamu yakin ingin menyimpan perubahan batas
                            sensor ini? Perubahan akan langsung memengaruhi
                            kriteria notifikasi bahaya (EWS) pada reaktor.
                        </p>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsConfirmOpen(false)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSave}
                                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition shadow-sm"
                            >
                                Ya, Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
