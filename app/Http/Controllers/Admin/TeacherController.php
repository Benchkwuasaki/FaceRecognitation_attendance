<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index()
    {
        $teachers = Teacher::with('faceEncoding')
            ->latest()
            ->get();

        return Inertia::render('admin/teachers/index', [
            'teachers' => $teachers,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/teachers/create', [
            'employeeId' => $this->generateEmployeeId(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'required|email|unique:teachers,email',
            'address' => 'nullable|string',
        ]);

        // employee_id is always generated server-side, never trusted from the request.
        // Retry a few times in case two requests race and collide on the same ID.
        $attempts = 0;

        while (true) {
            try {
                DB::transaction(function () use (&$validated) {
                    $validated['employee_id'] = $this->generateEmployeeId();
                    Teacher::create($validated);
                });

                break;
            } catch (UniqueConstraintViolationException $e) {
                $attempts++;

                if ($attempts >= 5) {
                    throw $e;
                }
            }
        }

        return redirect()->route('admin.teachers.index')
            ->with('success', 'Teacher added successfully.');
    }

    public function show(Teacher $teacher)
    {
        $teacher->load(['faceEncoding', 'attendances' => function ($query) {
            $query->latest('date')->limit(30);
        }]);

        return Inertia::render('admin/teachers/show', [
            'teacher' => $teacher,
        ]);
    }

    public function edit(Teacher $teacher)
    {
        return Inertia::render('admin/teachers/edit', [
            'teacher' => $teacher,
        ]);
    }

    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'employee_id' => 'required|string|unique:teachers,employee_id,' . $teacher->id,
            'full_name' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'required|email|unique:teachers,email,' . $teacher->id,
            'address' => 'nullable|string',
        ]);

        $teacher->update($validated);

        return redirect()->route('admin.teachers.index')
            ->with('success', 'Teacher updated successfully.');
    }

    public function destroy(Teacher $teacher)
    {
        $teacher->forceDelete();

        return redirect()->route('admin.teachers.index')
            ->with('success', 'Teacher removed successfully.');
    }

    /**
     * Delete multiple teachers at once. Expects { ids: number[] } in the request body.
     */
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:teachers,id',
        ]);

        $count = Teacher::whereIn('id', $validated['ids'])->get()->each->forceDelete()->count();

        return redirect()->route('admin.teachers.index')
            ->with('success', "{$count} teacher(s) removed successfully.");
    }

    /**
     * Generate the next sequential employee ID in the format DepEd-0001.
     */
    private function generateEmployeeId(): string
    {
        $prefix = 'DepEd-';

        $lastNumber = Teacher::withTrashed()
            ->where('employee_id', 'like', "{$prefix}%")
            ->selectRaw('MAX(CAST(SUBSTRING(employee_id, ?) AS UNSIGNED)) as max_num', [strlen($prefix) + 1])
            ->lockForUpdate()
            ->value('max_num');

        $nextNumber = ($lastNumber ?? 0) + 1;

        return $prefix . str_pad((string) $nextNumber, 4, '0', STR_PAD_LEFT);
    }
}