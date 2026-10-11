<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    public static function sendAlertNotification($status, $details)
    {
        $botToken = env('TELEGRAM_BOT_TOKEN');
        $chatId   = env('TELEGRAM_CHAT_ID');

        if (!$botToken || !$chatId) {
            Log::warning('Telegram Bot Token atau Chat ID belum terkonfigurasi.');
            return;
        }

        $icon = ($status === 'DANGER') ? '🚨' : '⚠️';
        
        $message  = "{$icon} *BIOMA'HAD SMART - EWS ALERT* {$icon}\n\n";
        $message .= "*Status:* {$status}\n";
        $message .= "*Waktu:* " . now()->format('d M Y, H:i:s') . " WIB\n\n";
        $message .= "*Detail Parameter Sensor:*\n";
        $message .= "• Suhu: {$details['temperature']} °C\n";
        $message .= "• pH: {$details['ph_level']}\n";
        $message .= "• CH4: {$details['ch4_ppm']} PPM\n";
        $message .= "• Tekanan: {$details['pressure_bar']} Bar\n";
        $message .= "• Flow Rate: {$details['flow_rate']} L/min\n\n";
        $message .= "⚠️ *Tindakan:* Harap lakukan pengecekan fisik pada reaktor biodigester!";

        try {
            Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id'    => $chatId,
                'text'       => $message,
                'parse_mode' => 'Markdown',
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mengirim pesan Telegram: ' . $e->getMessage());
        }
    }
}