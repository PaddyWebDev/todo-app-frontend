import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader, } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { validateFields } from '@/hooks/validate-fields'
import { updateTodoSchema } from '@/schema/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Todo } from '@prisma/client'
import axios, { AxiosError } from 'axios'
import { FileEdit } from 'lucide-react'
import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'


interface UpdateTodoProps {
    todo: Todo
}

export default function UpdateTodo({ todo }: UpdateTodoProps) {
    const [isPending, startTransition] = useTransition()

    const updateTodoForm = useForm<z.infer<typeof updateTodoSchema>>({
        resolver: zodResolver(updateTodoSchema),
        defaultValues: {
            title: todo.title,
            description: todo.description!,
            priority: String(todo.priority) || '',
            dueDate: formatDate(todo.dueDate!),
        }
    })

    async function handleTodoCreation(formData: z.infer<typeof updateTodoSchema>) {
        try {
            startTransition(async () => {
                const validatedFields = await validateFields(updateTodoSchema, formData).catch((error) => toast.error(error))
                await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/todo/update/${todo.id}`, validatedFields)
                    .then((data) => {
                        toast.success(data.data!)
                    }).catch((error: AxiosError) => {
                        toast.error(error.response?.data as unknown as string || "Error Occurred");
                    })

            })
        } catch (error) {
            toast.error("Error Occurred")
        }
    }


    function formatDate(date: Date) {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        const hours = ('0' + d.getHours()).slice(-2);
        const minutes = ('0' + d.getMinutes()).slice(-2);
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='flex items-center gap-1'>
                    <FileEdit className='w-5 h-5' />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create Todo
                    </DialogTitle>
                </DialogHeader>
                <Form {...updateTodoForm}>
                    <form onSubmit={updateTodoForm.handleSubmit(handleTodoCreation)} className='space-y-6'>
                        <FormField
                            control={updateTodoForm.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" disabled={isPending} type='search' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={updateTodoForm.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description" disabled={isPending} type='search' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />




                        <div className='grid md:grid-cols-2 grid-cols-1 items-center gap-2'>
                            <FormField
                                control={updateTodoForm.control}
                                name="dueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date & Time</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" defaultValue={field.value} disabled={isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={updateTodoForm.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select onValueChange={field.onChange} disabled={isPending} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Set the priority for this todo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">Priority 1</SelectItem>
                                                <SelectItem value="2">Priority 2</SelectItem>
                                                <SelectItem value="3">Priority 3</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>


                        <div>
                            <Button type='submit'>
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}
