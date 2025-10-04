import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader, } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getUserByEmail } from '@/hooks/user'
import { validateFields } from '@/hooks/validate-fields'
import { createTodoFormSchema } from '@/schema/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

export default function CreateTodo() {
    const session = useSession()
    const [isPending, startTransition] = useTransition()

    const createTodoForm = useForm<z.infer<typeof createTodoFormSchema>>({
        resolver: zodResolver(createTodoFormSchema),
        defaultValues: {
            title: "",
            description: ""
        }
    })

    async function handleTodoCreation(formData: z.infer<typeof createTodoFormSchema>) {
        try {
            startTransition(async () => {
                const validatedFields = await validateFields(createTodoFormSchema, formData).catch((error) => toast.error(error))

                if (!validatedFields?.reminder) {
                    toast.error("Date field is required")
                    return;
                }
                const expiry = new Date(validatedFields?.reminder!).toISOString()
                const data = {
                    title: validatedFields?.title,
                    description: validatedFields?.description,
                    priority: validatedFields?.priority || null,
                    reminder: expiry || null,
                    userId: session.data?.user.id,
                }


                await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/todo/create`, data)
                    .then((data) => {
                        toast.success(data.data!)
                        createTodoForm.reset()
                    }).catch((error: AxiosError) => {
                        toast.error(error.response?.data as unknown as string || "Error Occurred")
                    })

            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='flex items-center gap-1'>
                    Add Todo <Plus className='h-5 w-5' strokeWidth={1.5} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create Todo
                    </DialogTitle>
                </DialogHeader>
                <Form {...createTodoForm}>
                    <form onSubmit={createTodoForm.handleSubmit(handleTodoCreation)} className='space-y-6'>
                        <FormField
                            control={createTodoForm.control}
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
                            control={createTodoForm.control}
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

                        <FormField
                            control={createTodoForm.control}
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


                        <div className='w-[14rem]'>
                            <FormField
                                control={createTodoForm.control}
                                name="reminder"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date & Time</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" disabled={isPending} {...field} />
                                        </FormControl>
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
