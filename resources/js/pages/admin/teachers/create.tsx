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
import { Head, useForm } from '@inertiajs/react';
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Teachers', href: '/admin/teachers' },
    { title: 'Add Teacher', href: '/admin/teachers/create' },
];

function CreateTeacher({ employeeId }: { employeeId: string }) {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: employeeId,
        full_name: '',
        department: '',
        contact_number: '',
        email: '',
        address: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/teachers');
    };

    return (
        <>
            <Head title="Add Teacher" />
            <div className="w-full space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Add Teacher</h1>
                    <p className="text-sm text-muted-foreground">Register a new teacher account.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Teacher Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="employee_id" className="flex items-center gap-1.5">
                                        <IdCard className="h-3.5 w-3.5 text-muted-foreground" />
                                        Employee ID
                                    </Label>
                                    <Input
                                        id="employee_id"
                                        value={data.employee_id}
                                        disabled
                                        readOnly
                                        className="cursor-not-allowed bg-muted text-muted-foreground"
                                    />
                                    <p className="text-xs text-muted-foreground">Auto-generated, cannot be edited.</p>
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

                                <div className="space-y-2">
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
                                Save Teacher
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CreateTeacher.layout = (page: ReactNode) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;

export default CreateTeacher;