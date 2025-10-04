"use client"

import { useEffect } from 'react';
import parse from "html-react-parser";
import { Note } from '@prisma/client';

import { formatDateToNow, renderHtml } from './components/functions';
import socket from '@/lib/socket';
import React from 'react';
import { decryptSocketData } from '@/hooks/cryptr';
import CreateNote from './components/create-note';
import EditNote from './components/edit-note';
import DeleteNote from './components/delete-note';
import { useQuery } from '@tanstack/react-query';
import { TriangleAlert } from 'lucide-react';
import { getSessionUser } from '@/hooks/user';
import axios from 'axios';
import queryClient from '@/lib/tanstack-query';

async function fetchNotesDetails() {
    const session = await getSessionUser();
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/notes/get/${session?.user.id}`)
    return response.data;
}

export default function RenderNotes() {
    let { data, isLoading, isError, } = useQuery({
        queryKey: ['notes'],
        queryFn: fetchNotesDetails,
    });

    useEffect(() => {
        const deleteNote = (noteId: string) => {
            queryClient.setQueryData<Array<Note>>(['notes'], (old = []) =>
                old.filter((note) => note.id !== noteId)
            );
        }

        const updateNote = (noteId: string, updatedNoteData: Note) => {
            queryClient.setQueryData<Array<Note>>(['notes'], (prevNotes = []) =>
                prevNotes.map(note =>
                    note.id === noteId ? { ...updatedNoteData } : note
                )
            );
        }

        const createNote = (note: Note) => {
            queryClient.setQueryData<Array<Note>>(['notes'], (prevNotes = []) => {
                return prevNotes ? [...prevNotes, note] : [note]
            });

        }
        socket.connect();
        socket.on("note-created", async (data) => {
            createNote(await decryptSocketData(data))
        });

        socket.on("note-deleted", async (data) => {
            const decryptedData = await decryptSocketData(data)
            deleteNote(decryptedData.noteId);
        });

        socket.on("note-updated", async (data) => {
            const decryptedData = await decryptSocketData(data)
            updateNote(decryptedData.id, decryptedData)
        });

        return () => {
            socket.off("note-created")
            socket.off("note-deleted")
            socket.off("note-updated")
        }
    }, []); 


    if (isLoading)
        return (
            <div className="md:mt-0  mt-[17dvh] shadow-2xl  rounded-xl flex flex-col items-center justify-center text-center py-10 mx-auto">
                <div className="w-12 h-12 border-4 border-neutral-50 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )


    if (isError)
        return (
            <div className="md:mt-0  mt-[17dvh] shadow-2xl rounded-xl flex flex-col items-center justify-center text-center dark:bg-neutral-950 p-5  mx-auto">
                <span className='text-red-400 flex items-center gap-3'>
                    <h1 className='flex  font-xl font-bold gap-4'>Error Occurred </h1>
                    <TriangleAlert />
                </span>
            </div>
        )




    return (
        <section className='w-full h-full p-5  flex-col gap-5 '>
            <div className='w-full flex items-center justify-end mb-8'>
                <CreateNote />
            </div>
            <div >
                <div className='flex md:items-start items-center  gap-4 flex-wrap'>
                    {!data || data.length < 1 && !isError ? (
                        <div className=" mt-[7dvh] shadow-2xl max-w-md rounded-xl flex flex-col items-center justify-center text-center py-10 dark:bg-neutral-800  mx-auto px-4" >
                            <h1 className="text-3xl font-bold">No notes found</h1>
                            <p className="text-sm mt-2">
                                Start by creating a new note to keep <br /> track of your thoughts.
                            </p>
                        </div>) : (
                        data.map((note: Note, id: number) => (
                            <div key={id} className='dark:bg-neutral-950 bg-neutral-200 md:w-[30rem] w-full border dark:border-neutral-700/70 border-neutral-200/60  p-5 rounded-md space-y-7'>
                                <div className=' '>
                                    <h1 className='text-2xl font-semibold leading-tight tracking-tighter'>{note.title}</h1>
                                </div>
                                <div className='dark:bg-neutral-900 bg-neutral-50 p-5 rounded-md'>
                                    {
                                        parse(renderHtml(note.content)) || note.content
                                    }
                                </div>
                                <div className='flex items-center justify-between flex-wrap gap-2'>
                                    <div>
                                        <p className='text-sm'>
                                            {formatDateToNow(note.createdAt)}
                                        </p>
                                    </div>
                                    <div className='flex items-center justify-between gap-5'>
                                        <EditNote note={note} />
                                        <DeleteNote noteTitle={note.title} noteId={note.id} />
                                    </div>

                                </div>
                            </div>
                        ))
                    )
                    }

                </div>
            </div>
        </section>
    )
}

