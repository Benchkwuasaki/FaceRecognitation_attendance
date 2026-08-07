import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Building2,
    IdCard,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Save,
    User,
} from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import type { ReactNode } from 'react';

interface Teacher {
    id: number;
    employee_id: string;
    full_name: string;
    department: string | null;
    contact_number: string | null;
    email: string;
    address: string | null;
}

function EditTeacher({ teacher }: { teacher: Teacher }) {
    const { data, setData, put, processing, errors } = useForm({
        employee_id: teacher.employee_id,
        full_name: teacher.full_name,
        department: teacher.department ?? '',
        contact_number: teacher.contact_number ?? '',
        email: teacher.email,
        address: teacher.address ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/teachers/${teacher.id}`);
    };

    return (
        <>
            <Head title="Edit Teacher" />
            <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Teacher</h1>
                    <p className="text-sm text-muted-foreground">Update {teacher.full_name}'s information.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Teacher Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="employee_id" className="flex items-center gap-1.5">
                                        <IdCard className="h-3.5 w-3.5 text-muted-foreground" />
                                        Employee ID
                                    </Label>
                                    <Input id="employee_id" value={data.employee_id} onChange={(e) => setData('employee_id', e.target.value)} />
                                    <InputError message={errors.employee_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="full_name" className="flex items-center gap-1.5">
                                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                                        Full Name
                                    </Label>
                                    <Input id="full_name" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} />
                                    <InputError message={errors.full_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="department" className="flex items-center gap-1.5">
                                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                        Department
                                    </Label>
                                    <Input id="department" value={data.department} onChange={(e) => setData('department', e.target.value)} />
                                    <InputError message={errors.department} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contact_number" className="flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                        Contact Number
                                    </Label>
                                    <Input id="contact_number" value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} />
                                    <InputError message={errors.contact_number} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                        Email
                                    </Label>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="address" className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                        Address
                                    </Label>
                                    <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                                    <InputError message={errors.address} />
                                </div>
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Update Teacher
                            </Button>
                        </form>
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
function EditTeacherLayout({ children }: { children: ReactNode }) {
    const { teacher } = usePage<{ teacher: Teacher }>().props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Teachers', href: '/admin/teachers' },
        { title: 'Edit', href: `/admin/teachers/${teacher.id}/edit` },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{children}</AppLayout>;
}

EditTeacher.layout = (page: ReactNode) => <EditTeacherLayout>{page}</EditTeacherLayout>;

export default EditTeacher;