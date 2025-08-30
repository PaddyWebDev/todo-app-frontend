import { Button } from '@/components/ui/button'
import { DialogDescription, Dialog, DialogTrigger, DialogContent, DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'
import React from 'react'
import axios, { AxiosError } from "axios";


interface DeleteNoteProps {
    noteId: string
    noteTitle: string
}

export default function DeleteNote({ noteId, noteTitle }: DeleteNoteProps) {
    async function deleteNote() {
        await axios
            .delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/notes/delete/${noteId}`)
            .then((data) => {
                console.log(data);
            })
            .catch((error: AxiosError) => {
                console.log(error);
            });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"destructive"}>Delete <Trash2 className='h-5 ml-1 w-5 ' strokeWidth={1.5} /></Button>
            </DialogTrigger>
            <DialogContent className=' flex flex-col items-center'>
                <DialogHeader className=' w-full'>
                    <DialogTitle className=' text-left'>Are you sure you want to delete note ?</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    You are about to delete a note titled {noteTitle} from your collection.
                    Once deleted, this action cannot be undone. Please ensure that you no longer need
                    this note or have saved any important information elsewhere before proceeding.
                </DialogDescription>
                <DialogFooter className='flex items-center justify-between  w-full'>
                    <DialogClose className='flex items-center justify-between  md:w-[50%] gap-5 mx-auto' >
                        <Button variant={"secondary"}>Cancel</Button>
                        <Button onClick={async () => deleteNote()} variant={"destructive"}>Delete  <Trash2 className='h-5 ml-1 w-5 ' strokeWidth={1.5} /></Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
