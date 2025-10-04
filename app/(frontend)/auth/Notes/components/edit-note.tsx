import React, { useEffect, useState, useTransition } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { NoteSchema } from '@/schema/form-schema'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { Note } from '@prisma/client'
import { validateFields } from '@/hooks/validate-fields'
import { jsonData } from './functions'
import TipTapEditor from './editor'

interface EditNoteProps {
    note: Note
}

export default function EditNote({ note }: EditNoteProps) {
    const [isPending, startTransition] = useTransition()


    const editNoteForm = useForm<z.infer<typeof NoteSchema>>({
        resolver: zodResolver(NoteSchema),
        defaultValues: {
            title: note.title!,
            content: ""
        }
    })

    function updateNoteEditorValue(content: string) {
        editNoteForm.setValue('content', content);
    }

    async function handleData(formData: z.infer<typeof NoteSchema>) {
        startTransition(async () => {
            const validatedFields = await validateFields(NoteSchema, formData).catch((error) => toast.error(error))
            if (validatedFields.content === "") {
                validatedFields.content = note.content
            }
            await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/notes/update/${note.id!}`, validatedFields)
                .then((data) => {
                    toast.success(data.data)
                })
                .catch((error: AxiosError) => {
                    toast.error(error.response?.data as unknown as string || "Error Occurred")
                })
        })
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Edit <Pencil strokeWidth={1.5} className='h-5 w-5 ml-1' /></Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit your notes</DialogTitle>

                </DialogHeader>
                <Form {...editNoteForm}>
                    <form onSubmit={editNoteForm.handleSubmit(handleData)} className='space-y-6'>
                        <FormField
                            control={editNoteForm.control}
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


                        <TipTapEditor data={note.content!} disabledStatus={isPending} contentChange={updateNoteEditorValue} />
                        <Button disabled={isPending} type='submit'>
                            {
                                isPending ? ("Loading...") : ("Edit Note")
                            }
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
