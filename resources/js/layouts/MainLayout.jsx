import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    AlertTriangle,
    Trash2,
    Send,
    ShieldCheck,
    Settings,
} from "lucide-react";
import logoImg from "@/Assets/logo.webp";

export default function MainLayout({ children }) {
    const { url, props } = usePage();
    const { activeAlertsCount, latestStatus } = props;

    // 1. Simpan nilai awal dari Props ke Local State
    const [alertCount, setAlertCount] = useState(activeAlertsCount || 0);
    const [currentStatus, setCurrentStatus] = useState(latestStatus || "SAFE");

    // Sinkronkan state jika terjadi perubahan props akibat navigasi biasa
    useEffect(() => {
        setAlertCount(activeAlertsCount || 0);
    }, [activeAlertsCount]);

    useEffect(() => {
        setCurrentStatus(latestStatus || "SAFE");
    }, [latestStatus]);

    // 2. Listener Real-Time dari Laravel Echo (Reverb)
    useEffect(() => {
        if (window.Echo) {
            window.Echo.channel("telemetry-channel").listen(
                ".TelemetryEvent",
                (e) => {
                    // Update status sistem (SAFE, WARNING, atau DANGER) dari telemetry log
                    if (e.telemetry?.status_warning) {
                        setCurrentStatus(e.telemetry.status_warning);
                    }

                    // Jika ada alert EWS baru (kondisi DANGER / WARNING terdeteksi)
                    if (e.alert) {
                        console.log(
                            "Real-time EWS Alert diterima di Layout:",
                            e.alert,
                        );
                        // Tambah angka badge sidebar +1 secara instan!
                        setAlertCount((prev) => prev + 1);
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

    const getEWSBadge = (status) => {
        if (status === "DANGER") {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> 🔴
                    DANGER (Tekanan Kritis)
                </span>
            );
        }
        if (status === "WARNING") {
            return (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> 🟡
                    WARNING (pH Tidak Ideal)
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 🟢 SAFE
                (Sistem Normal)
            </span>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-100 font-sans text-slate-800">
            {/* ================= SIDEBAR (Dark Teal Style) ================= */}
            <aside className="w-64 bg-[#0a2f2b] text-slate-300 p-6 flex flex-col justify-between hidden md:flex shrink-0">
                <div>
                    {/* BAGIAN LOGO */}
                    <div className="flex items-center gap-3 mb-8">
                        <img
                            src={logoImg}
                            alt="Logo BIOMA'HAD SMART"
                            className="w-10 h-10 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
                        />
                        <div>
                            <h2 className="font-bold text-lg text-white leading-tight">
                                BIOMA'HAD
                            </h2>
                            <span className="text-xs text-emerald-400 font-medium tracking-wider">
                                SMART SYSTEM
                            </span>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <Link
                            href="/"
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                                url === "/"
                                    ? "bg-emerald-600 text-white shadow-lg"
                                    : "hover:bg-emerald-900/50 text-slate-300"
                            }`}
                        >
                            <LayoutDashboard className="w-5 h-5" /> Telemetri
                            Real-Time
                        </Link>

                        <Link
                            href="/alerts"
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                                url.startsWith("/alerts")
                                    ? "bg-emerald-600 text-white shadow-lg"
                                    : "hover:bg-emerald-900/50 text-slate-300"
                            }`}
                        >
                            <AlertTriangle className="w-5 h-5" /> Alert Center
                            (EWS)
                            {alertCount > 0 && (
                                <span className="ml-auto bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-pulse">
                                    {alertCount}
                                </span>
                            )}
                        </Link>

                        <Link
                            href="/waste"
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                                url.startsWith("/waste")
                                    ? "bg-emerald-600 text-white shadow-lg"
                                    : "hover:bg-emerald-900/50 text-slate-300"
                            }`}
                        >
                            <Trash2 className="w-5 h-5" /> Pasokan Sampah
                        </Link>

                        <Link
                            href="/settings"
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                                url.startsWith("/settings")
                                    ? "bg-emerald-600 text-white shadow-lg"
                                    : "hover:bg-emerald-900/50 text-slate-300"
                            }`}
                        >
                            <Settings className="w-5 h-5" /> Pengaturan Batas
                        </Link>
                    </nav>
                </div>

                <div className="bg-[#0e3b36] p-4 rounded-xl border border-emerald-800/50">
                    <div className="flex items-center gap-2 text-xs text-emerald-300 mb-1">
                        <Send className="w-4 h-4" /> Telegram Bot Active
                    </div>
                    <p className="text-[11px] text-slate-400">
                        Notifikasi EWS terhubung ke Group Pengelola Mah'ad.
                    </p>
                </div>
            </aside>

            {/* ================= MAIN CONTENT AREA ================= */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            BIOMA'HAD SMART
                        </h1>
                        <p className="text-sm text-slate-500">
                            IoT-Based Biodigester Monitoring & Early Warning
                            System
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                        <span className="text-xs text-slate-500 pl-2">
                            Status Sistem:
                        </span>
                        {getEWSBadge(currentStatus)}
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
}
