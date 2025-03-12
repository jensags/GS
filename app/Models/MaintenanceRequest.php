<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class MaintenanceRequest extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'request_id',
        'date_received',
        'time_received',
        'priority_number',
        'signature',
    ];
}
