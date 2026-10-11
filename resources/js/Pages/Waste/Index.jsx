import React from "react";
import { Head, useForm } from "@inertiajs/react";
import MainLayout from "@/layouts/MainLayout";
import { PlusCircle, Search } from "lucide-react";

export default function Index({ wasteLogs }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        weight_kg: "",
        category: "Sisa Makanan Dapur",
        entry_date: new Date().toISOString().split("T")[0],
        notes: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kirim request POST ke endpoint /waste
        post("/waste", {
            preserveScroll: true,
            onSuccess: () => {
                reset("weight_kg", "notes");
            },
            onError: (err) => {
                console.error("Validation Errors:", err);
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Pasokan Sampah Organik" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Input Sampah */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-emerald-600" /> Form
                        Input Sampah
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">
                        Catat pasokan harian bahan baku reaktor
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Berat Sampah (Kg)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={data.weight_kg}
                                onChange={(e) =>
                                    setData("weight_kg", e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="Contoh: 15.5"
                                required
                            />
                            {errors.weight_kg && (
                                <span className="text-xs text-rose-500 mt-1 block">
                                    {errors.weight_kg}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Kategori Sampah
                            </label>
                            <select
                                value={data.category}
                                onChange={(e) =>
                                    setData("category", e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                <option value="Sisa Makanan Dapur">
                                    Sisa Makanan Dapur
                                </option>
                                <option value="Sayuran/Buah">
                                    Sayuran/Buah
                                </option>
                                <option value="Kotoran Ternak">
                                    Kotoran Ternak
                                </option>
                                <option value="Campuran Organik">
                                    Campuran Organik
                                </option>
                            </select>
                            {errors.category && (
                                <span className="text-xs text-rose-500 mt-1 block">
                                    {errors.category}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Tanggal Input
                            </label>
                            <input
                                type="date"
                                value={data.entry_date}
                                onChange={(e) =>
                                    setData("entry_date", e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Catatan Deskriptif
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                rows="3"
                                placeholder="Catatan tambahan..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition shadow-md disabled:opacity-50"
                        >
                            {processing ? "Menyimpan..." : "Simpan Pasokan"}
                        </button>
                    </form>
                </div>

                {/* Tabel Log Pasokan Sampah */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-slate-900">
                                Riwayat Pasokan Sampah
                            </h3>
                            <p className="text-xs text-slate-500">
                                Log histori masukan sampah harian
                            </p>
                        </div>

                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari..."
                                className="pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Tanggal</th>
                                    <th className="py-3 px-4 font-semibold">
                                        Kategori
                                    </th>
                                    <th className="py-3 px-4 font-semibold">
                                        Berat (Kg)
                                    </th>
                                    <th className="py-3 px-4 font-semibold">
                                        Catatan
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {wasteLogs?.data?.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="py-3 px-4 text-xs font-mono">
                                            {log.input_date || log.entry_date}
                                        </td>
                                        <td className="py-3 px-4 font-medium text-slate-900">
                                            {log.waste_type || log.category}
                                        </td>
                                        <td className="py-3 px-4 font-bold text-emerald-600">
                                            {log.weight_kg} Kg
                                        </td>
                                        <td className="py-3 px-4 text-xs text-slate-500">
                                            {log.notes || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
