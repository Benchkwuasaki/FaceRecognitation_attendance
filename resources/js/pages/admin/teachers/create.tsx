import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Head, useForm } from '@inertiajs/react';

export default function CreateTeacher() {
    const { data, setData, post, processing, errors } = useForm({
        employee_id: '',
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
        <AppLayout>
            <Head title="Add Teacher" />
            <div className="mx-auto max-w-xl p-6">
                <h1 className="mb-6 text-2xl font-semibold">Add Teacher</h1>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="employee_id">Employee ID</Label>
                        <Input id="employee_id" value={data.employee_id} onChange={(e) => setData('employee_id', e.target.value)} />
                        <InputError message={errors.employee_id} />
                    </div>

                    <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input id="full_name" value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} />
                        <InputError message={errors.full_name} />
                    </div>

                    <div>
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" value={data.department} onChange={(e) => setData('department', e.target.value)} />
                        <InputError message={errors.department} />
                    </div>

                    <div>
                        <Label htmlFor="contact_number">Contact Number</Label>
                        <Input id="contact_number" value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} />
                        <InputError message={errors.contact_number} />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        <InputError message={errors.email} />
                    </div>

                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                        <InputError message={errors.address} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        Save Teacher
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}