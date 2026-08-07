import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';

interface Attendance {
    id: number;
    date: string;
    time_in: string | null;
    time_out: string | null;
    status: 'present' | 'late' | 'absent';
}

interface Teacher {
    id: number;
    employee_id: string;
    full_name: string;
    department: string | null;
    contact_number: string | null;
    email: string;
    address: string | null;
    face_encoding: { id: number } | null;
    attendances: Attendance[];
}

function ShowTeacher({ teacher }: { teacher: Teacher }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teachers', href: '/admin/teachers' },
        { title: teacher.full_name, href: `/admin/teachers/${teacher.id}` },
    ];

    const statusColor = {
        present: 'text-green-600',
        late: 'text-amber-600',
        absent: 'text-red-600',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={teacher.full_name} />
            <div className="mx-auto max-w-3xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{teacher.full_name}</h1>
                    <Link href={`/admin/teachers/${teacher.id}/edit`} className="text-blue-600 hover:underline">
                        Edit
                    </Link>
                </div>

                <div className="mb-8 grid grid-cols-2 gap-4 rounded-lg border p-4 text-sm">
                    <div><span className="text-muted-foreground">Employee ID:</span> {teacher.employee_id}</div>
                    <div><span className="text-muted-foreground">Department:</span> {teacher.department ?? '—'}</div>
                    <div><span className="text-muted-foreground">Email:</span> {teacher.email}</div>
                    <div><span className="text-muted-foreground">Contact:</span> {teacher.contact_number ?? '—'}</div>
                    <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {teacher.address ?? '—'}</div>
                    <div className="col-span-2">
                        <span className="text-muted-foreground">Face Registration:</span>{' '}
                        {teacher.face_encoding ? (
                            <span className="text-green-600">✔ Registered</span>
                        ) : (
                            <span className="text-amber-600">Not yet registered</span>
                        )}
                    </div>
                </div>

                <h2 className="mb-3 text-lg font-semibold">Attendance History</h2>
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full min-w-[500px] text-sm">
                        <thead className="bg-muted text-left">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Time In</th>
                                <th className="p-3">Time Out</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teacher.attendances.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-3 text-center text-muted-foreground">
                                        Wala pang attendance record.
                                    </td>
                                </tr>
                            )}
                            {teacher.attendances.map((att) => (
                                <tr key={att.id} className="border-t">
                                    <td className="p-3">{att.date}</td>
                                    <td className="p-3">{att.time_in ?? '—'}</td>
                                    <td className="p-3">{att.time_out ?? '—'}</td>
                                    <td className={`p-3 font-medium capitalize ${statusColor[att.status]}`}>{att.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

export default ShowTeacher;