import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/layouts/MainLayout";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function Index({ alerts }) {
    // 1. Simpan daftar alert dalam local state React
    const [alertList, setAlertList] = useState(alerts?.data || []);

    // Sinkronisasi state jika props dari Inertia berubah
    useEffect(() => {
        setAlertList(alerts?.data || []);
    }, [alerts]);

    // 2. Listener WebSocket untuk menerima Alert baru secara real-time
    useEffect(() => {
        if (window.Echo) {
            window.Echo.channel("telemetry-channel").listen(
                ".TelemetryEvent",
                (e) => {
                    // Jika data yang disiarkan membawa alert bahaya baru
                    if (e.alert) {
                        console.log("Alert Baru Masuk ke EWS Table:", e.alert);
                        setAlertList((prevList) => {
                            // Hindari duplikasi berdasarkan ID
                            if (
                                prevList.some((item) => item.id === e.alert.id)
                            ) {
                                return prevList;
                            }
                            // Sisipkan alert baru di posisi paling atas tabel
                            return [e.alert, ...prevList];
                        });
                    }
                },
            );
        }

        return () => {
            if (window.Echo) {
                window.Echo.leaveChannel("telemetry-channel");
            }
        };
    }, []);

    const handleResolveAlert = (id) => {
        // Mengirim HTTP PATCH ke endpoint /alerts/{id}/resolve
        router.patch(
            `/alerts/${id}/resolve`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log("Alert resolved successfully");
                    // Update UI lokal agar status tombol berubah seketika
                    setAlertList((prevList) =>
                        prevList.map((item) =>
                            item.id === id
                                ? { ...item, is_resolved: true }
                                : item,
                        ),
                    );
                },
            },
        );
    };

    return (
        <MainLayout>
            <Head title="Alert Center (EWS)" />

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-1">
                    Tabel Riwayat Peringatan EWS
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                    Log kondisi abnormal dan penanganan fisik oleh operator
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">
                            <tr>
                                <th className="py-3 px-4">Timestamp</th>
                                <th className="py-3 px-4">Jenis Peringatan</th>
                                <th className="py-3 px-4">Severity</th>
                                <th className="py-3 px-4">Pesan Detail</th>
                                <th className="py-3 px-4">Status & Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {alertList.map((alert) => (
                                <tr
                                    key={alert.id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    <td className="py-3 px-4 text-xs font-mono">
                                        {alert.created_at
                                            ? new Date(
                                                  alert.created_at,
                                              ).toLocaleString("id-ID")
                                            : "-"}
                                    </td>
                                    <td className="py-3 px-4 font-medium text-slate-900">
                                        {alert.alert_type}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                alert.severity === "DANGER"
                                                    ? "bg-rose-100 text-rose-700"
                                                    : "bg-amber-100 text-amber-700"
                                            }`}
                                        >
                                            {alert.severity}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-xs">
                                        {alert.message}
                                    </td>
                                    <td className="py-3 px-4">
                                        {alert.is_resolved ? (
                                            <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                                                <CheckCircle className="w-4 h-4" />{" "}
                                                Resolved
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    handleResolveAlert(alert.id)
                                                }
                                                className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-600 transition"
                                            >
                                                Mark as Resolved
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}
