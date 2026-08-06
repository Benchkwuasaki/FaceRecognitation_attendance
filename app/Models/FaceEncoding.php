<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FaceEncoding extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'encoding',
    ];

    protected $casts = [
        'encoding' => 'array', // auto convert JSON <-> PHP array
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}