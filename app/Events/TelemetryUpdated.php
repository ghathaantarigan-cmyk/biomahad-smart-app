<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TelemetryUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $telemetry;
    public $alert;

    /**
     * Create a new event instance.
     *
     * @param mixed $telemetry
     * @param mixed $alert
     */
    public function __construct($telemetry, $alert = null)
    {
        $this->telemetry = $telemetry;
        $this->alert     = $alert;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('telemetry-channel'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'TelemetryEvent';
    }
}