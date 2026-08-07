<?php

use App\Http\Controllers\Admin\TeacherController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        // Must be declared before Route::resource() so "bulk-delete" isn't
        // swallowed by the resource's DELETE /teachers/{teacher} route.
        Route::delete('teachers/bulk-delete', [TeacherController::class, 'bulkDestroy'])
            ->name('teachers.bulkDestroy');

        Route::resource('teachers', TeacherController::class);
    });
});

require __DIR__.'/settings.php';