import React, { useEffect, useState, useTransition } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { NoteSchema } from '@/schema/form-schema'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import TipTapEditor from './editor'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { validateFields } from '@/hooks/validate-fields'
import { useSession } from 'next-auth/react'
import { jsonData } from './functions'


export default function CreateNote() {
    const { data: session } = useSession()

    const [isPending, startTransition] = useTransition()


    const createNoteForm = useForm<z.infer<typeof NoteSchema>>({
        resolver: zodResolver(NoteSchema),
        defaultValues: {
            title: "",
            content: ""
        }
    })

    function updateNoteEditorValue(content: string) {
        createNoteForm.setValue('content', content);

    }

    async function handleData(formData: z.infer<typeof NoteSchema>) {
        startTransition(async () => {
            const validatedFields = NoteSchema.safeParse(formData)

            if (!validatedFields.data || validatedFields.error) {
                toast.error(validatedFields.error?.message)
                return;
            }

            if (validatedFields.data?.content === "") {
                validatedFields.data.content = JSON.stringify(jsonData)
            }
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/notes/create`, {
                userId: session?.user.id,
                ...validatedFields.data
            })
                .then((data) => {
                    toast.success(data.data!)
                    createNoteForm.reset()
                }).catch((error: AxiosError) => {
                    toast.error(error.message)
                })
        })

    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create <Plus className='h-5 ml-1 w-5 dark:text-black' strokeWidth={1.5} /></Button>
            </DialogTrigger>
            <DialogContent className=' flex flex-col items-center'>
                <DialogHeader className=' w-full'>
                    <DialogTitle className=' text-left'>Create your desired note</DialogTitle>

                </DialogHeader>
                <Form {...createNoteForm} >
                    <form onSubmit={createNoteForm.handleSubmit(handleData)} className='space-y-6 mx-auto  w-full'>
                        <FormField
                            control={createNoteForm.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Title" disabled={isPending} type='search' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <TipTapEditor data={JSON.stringify(jsonData)} disabledStatus={isPending} contentChange={updateNoteEditorValue} />


                        <Button disabled={isPending} type='submit'>
                            {
                                isPending ? ("Loading...") : ("Create Note")
                            }
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
