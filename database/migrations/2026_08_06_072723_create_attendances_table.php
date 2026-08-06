<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('attendances', function (Blueprint $table) {
        $table->id();
        $table->foreignId('teacher_id')->constrained()->cascadeOnDelete();
        $table->date('date');
        $table->time('time_in')->nullable();
        $table->time('time_out')->nullable();
        $table->enum('status', ['present', 'late', 'absent'])->default('absent');
        $table->timestamps();
        $table->unique(['teacher_id', 'date']); // one record per teacher per day
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
