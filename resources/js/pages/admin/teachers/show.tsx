import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock,
    Mail,
    MapPin,
    Pencil,
    Phone,
    ScanFace,
    XCircle,
} from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import type { ReactNode } from 'react';

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

const statusVariant: Record<Attendance['status'], 'default' | 'secondary' | 'destructive'> = {
    present: 'default',
    late: 'secondary',
    absent: 'destructive',
};

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: ReactNode;
}) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="truncate text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}

function ShowTeacher({ teacher }: { teacher: Teacher }) {
    return (
        <>
            <Head title={teacher.full_name} />
            <div className="w-full space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{teacher.full_name}</h1>
                        <p className="text-sm text-muted-foreground">Employee ID: {teacher.employee_id}</p>
                    </div>
                    <Button asChild>
                        <Link href={`/admin/teachers/${teacher.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            Edit Teacher
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Teacher Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <InfoRow icon={Building2} label="Department" value={teacher.department ?? '—'} />
                            <InfoRow icon={Mail} label="Email" value={teacher.email} />
                            <InfoRow icon={Phone} label="Contact Number" value={teacher.contact_number ?? '—'} />
                            <InfoRow icon={MapPin} label="Address" value={teacher.address ?? '—'} />
                        </div>

                        <Separator className="my-6" />

                        <div className="flex items-center gap-3">
                            <ScanFace className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Face Registration:</span>
                            {teacher.face_encoding ? (
                                <Badge className="gap-1 bg-green-600 hover:bg-green-600">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Registered
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="gap-1 text-amber-600">
                                    <XCircle className="h-3 w-3" />
                                    Not yet registered
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <CalendarDays className="h-4 w-4" />
                            Attendance History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time In</TableHead>
                                    <TableHead>Time Out</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teacher.attendances.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                            <Clock className="mx-auto mb-2 h-5 w-5" />
                                            Wala pang attendance record.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {teacher.attendances.map((att) => (
                                    <TableRow key={att.id}>
                                        <TableCell>{att.date}</TableCell>
                                        <TableCell>{att.time_in ?? '—'}</TableCell>
                                        <TableCell>{att.time_out ?? '—'}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant[att.status]} className="capitalize">
                                                {att.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

// Wraps the page in AppLayout with dynamic breadcrumbs. Reads props via
// usePage() instead of the `page` argument, since that argument's shape
// isn't reliable to destructure directly in this Inertia setup. Because
// this static .layout is defined, it REPLACES (not stacks with) the
// default AppLayout that app.tsx's `layout:` resolver would otherwise
// apply — so there's only ever one AppLayout render.
function ShowTeacherLayout({ children }: { children: ReactNode }) {
    const { teacher } = usePage<{ teacher: Teacher }>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teachers', href: '/admin/teachers' },
        { title: teacher.full_name, href: `/admin/teachers/${teacher.id}` },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{children}</AppLayout>;
}

ShowTeacher.layout = (page: ReactNode) => <ShowTeacherLayout>{page}</ShowTeacherLayout>;

export default ShowTeacher;