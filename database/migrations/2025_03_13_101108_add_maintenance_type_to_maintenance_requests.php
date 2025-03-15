<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('maintenance_requests', function (Blueprint $table) {
            $table->foreignId('maintenance_type_id')->constrained('maintenance_types')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('maintenance_requests', function (Blueprint $table) {
            $table->dropColumn('maintenance_type_id');
        });
    }
};
