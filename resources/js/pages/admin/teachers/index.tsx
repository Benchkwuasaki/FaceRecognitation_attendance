import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';

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

export default function TeachersIndex({ teachers }: { teachers: Teacher[] }) {
    const handleDelete = (id: number) => {
        if (confirm('Sigurado ka bang gusto mong tanggalin ang teacher na ito?')) {
            router.delete(`/admin/teachers/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teachers" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Teachers</h1>
                    <Link href="/admin/teachers/create">
                        <Button>+ Add Teacher</Button>
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full min-w-[700px] text-sm">
                        <thead className="bg-muted text-left">
                            <tr>
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
                                    <td colSpan={5} className="p-6 text-center text-muted-foreground">
                                        Wala pang naka-register na teacher.
                                    </td>
                                </tr>
                            )}
                            {teachers.map((teacher) => (
                                <tr key={teacher.id} className="border-t">
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
                                        <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:underline">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}