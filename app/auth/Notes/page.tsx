"use client"
import EditNote from '@/app/auth/Notes/components/edit-note'
import CreateNote from '@/app/auth/Notes/components/create-note'
import DeleteNote from './components/delete-note';

import { getNotesBySessionUserId } from '@/hooks/notes';
import { useCallback, useEffect, useState } from 'react';
import parse from "html-react-parser";
import { Note } from '@prisma/client';

import socket from '@/lib/socket';
import { formatDateToNow, renderHtml } from './components/functions';
import React from 'react';
import { decryptSocketData } from '@/hooks/cryptr';

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);

    const fetchNotes = useCallback(async function () {
        const fetchedNotes = await getNotesBySessionUserId();
        setNotes(fetchedNotes!);
    }, []);

    const deleteNote = useCallback((noteId: string) => {
        setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));
    }, []);

    const updateNote = useCallback((noteId: string, updatedNoteData: Note) => {
        setNotes((prevNotes) =>
            prevNotes.map(note =>
                note.id === noteId ? { ...updatedNoteData } : note
            )
        );
    }, []);

    const createNote = useCallback((note: Note) => {
        setNotes((prevNotes) => {
            return prevNotes ? [...prevNotes, note] : [note]
        })
    }, [])

    useEffect(() => {
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
        fetchNotes();

        return () => {
            socket.off("note-created")
            socket.off("note-deleted")
            socket.off("note-updated")
        }
    }, [fetchNotes, deleteNote, updateNote, createNote]); // Keep dependencies as needed




    return (
        <section className='w-full h-full p-5 flex items-start flex-col gap-5 '>
            <div className='w-full flex items-center justify-end'>
                <CreateNote />
            </div>
            <div className='flex md:items-start items-center  gap-4 flex-wrap'>
                {
                    notes?.length > 0 ? (
                        notes.map((note: Note, id: number) => (
                            <div key={id} className='dark:bg-neutral-950 bg-neutral-200 md:w-[30rem] w-full border dark:border-neutral-700/70 border-neutral-200/60  p-5 rounded-md space-y-7'>
                                <div className=' '>
                                    <h1 className='text-2xl font-semibold leading-tight tracking-tighter'>{note.title}</h1>
                                    <h5 className='text-md text-neutral-500'>{note.description}</h5>
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
                    ) : ("")
                }
            </div>
        </section>
    )
}


