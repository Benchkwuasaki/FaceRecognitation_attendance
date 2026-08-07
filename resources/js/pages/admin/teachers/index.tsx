import AppLayout from '@/layouts/app-layout';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Head, Link, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { BreadcrumbItem } from '@/types';
import type { ReactNode } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Teachers', href: '/admin/teachers' },
];

interface Teacher {
    id: number;
    employee_id: string;
    full_name: string;
    department: string | null;
    email: string;
    face_encoding: { id: number } | null;
}

// What the delete-confirmation dialog is currently targeting.
// `null` = closed. A single teacher = row delete. `'bulk'` = bulk delete of selectedIds.
type DeleteTarget = Teacher | 'bulk' | null;

function TeachersIndex({ teachers }: { teachers: Teacher[] }) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const allSelected = teachers.length > 0 && selectedIds.length === teachers.length;
    const someSelected = selectedIds.length > 0 && !allSelected;

    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

    const toggleAll = () => {
        setSelectedIds(allSelected ? [] : teachers.map((t) => t.id));
    };

    const toggleOne = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
        );
    };

    const closeDialog = () => {
        if (isDeleting) return;
        setDeleteTarget(null);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        setIsDeleting(true);

        if (deleteTarget === 'bulk') {
            router.delete('/admin/teachers/bulk-delete', {
                data: { ids: selectedIds },
                onSuccess: () => setSelectedIds([]),
                onFinish: () => {
                    setIsDeleting(false);
                    setDeleteTarget(null);
                },
            });
        } else {
            router.delete(`/admin/teachers/${deleteTarget.id}`, {
                onFinish: () => {
                    setIsDeleting(false);
                    setDeleteTarget(null);
                },
            });
        }
    };

    const dialogCopy =
        deleteTarget === 'bulk'
            ? {
                  title: `Delete ${selectedIds.length} teacher${selectedIds.length > 1 ? 's' : ''}?`,
                  description:
                      'This will permanently remove the selected teachers and their records. This action cannot be undone.',
              }
            : deleteTarget
              ? {
                    title: `Delete ${deleteTarget.full_name}?`,
                    description:
                        'This will permanently remove this teacher and their records. This action cannot be undone.',
                }
              : { title: '', description: '' };

    return (
        <>
            <Head title="Teachers" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Teachers</h1>
                    <Link href="/admin/teachers/create">
                        <Button>+ Add Teacher</Button>
                    </Link>
                </div>

                {selectedIds.length > 0 && (
                    <div className="mb-4 flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-2.5">
                        <span className="text-sm font-medium">
                            {selectedIds.length} teacher{selectedIds.length > 1 ? 's' : ''} selected
                        </span>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
                                Clear
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => setDeleteTarget('bulk')}>
                                <Trash2 className="h-4 w-4" />
                                Delete Selected
                            </Button>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full min-w-[700px] text-sm">
                        <thead className="bg-muted text-left">
                            <tr>
                                <th className="w-10 p-3">
                                    <Checkbox
                                        checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                                        onCheckedChange={toggleAll}
                                        aria-label="Select all teachers"
                                    />
                                </th>
                                <th className="p-3">Employee ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Department</th>
                                <th className="p-3">Face Registered</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-6 text-center text-muted-foreground">
                                        Wala pang naka-register na teacher.
                                    </td>
                                </tr>
                            )}
                            {teachers.map((teacher) => (
                                <tr key={teacher.id} className="border-t">
                                    <td className="p-3">
                                        <Checkbox
                                            checked={selectedSet.has(teacher.id)}
                                            onCheckedChange={() => toggleOne(teacher.id)}
                                            aria-label={`Select ${teacher.full_name}`}
                                        />
                                    </td>
                                    <td className="p-3">{teacher.employee_id}</td>
                                    <td className="p-3">{teacher.full_name}</td>
                                    <td className="p-3">{teacher.department ?? '—'}</td>
                                    <td className="p-3">
                                        {teacher.face_encoding ? (
                                            <span className="text-green-600">✔ Registered</span>
                                        ) : (
                                            <span className="text-amber-600">Not registered</span>
                                        )}
                                    </td>
                                    <td className="p-3 space-x-3 whitespace-nowrap">
                                        <Link href={`/admin/teachers/${teacher.id}`} className="text-blue-600 hover:underline">
                                            View
                                        </Link>
                                        <Link href={`/admin/teachers/${teacher.id}/edit`} className="text-blue-600 hover:underline">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => setDeleteTarget(teacher)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && closeDialog()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{dialogCopy.title}</AlertDialogTitle>
                        <AlertDialogDescription>{dialogCopy.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

TeachersIndex.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default TeachersIndex;