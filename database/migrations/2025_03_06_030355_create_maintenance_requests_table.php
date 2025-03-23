<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('maintenance_requests', function (Blueprint $table) {
            $table->id();
            $table->date('date_requested');
            $table->text('details');
            $table->string('requesting_personnel');
            $table->string('position');
            $table->string('requesting_office');
            $table->string('contact_number');
            $table->string('status')->default('Pending');
            $table->date('date_received')->nullable();
            $table->time('time_received')->nullable();
            $table->string('priority_number')->nullable();
            $table->text('remarks')->nullable();
            $table->string('verified_by')->nullable();
            $table->string('approved_by_1')->nullable();
            $table->string('approved_by_2')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('maintenance_types');
    }
};
