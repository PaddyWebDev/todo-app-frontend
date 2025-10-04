"use client"

import React, { useCallback, useEffect, useState } from 'react'
import CreateTodo from './components/create-todo'
import { getTodoBySessionUserId } from '@/hooks/todo'
import { Todo } from '@prisma/client'
import { AlarmCheck, TriangleAlert } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import socket from '@/lib/socket';
import DeleteTodo from './components/delete-todo'
import UpdateTodo from './components/update-todo'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { formatDistance } from 'date-fns'
import { decryptSocketData } from '@/hooks/cryptr'
import { useQuery } from '@tanstack/react-query'
import { getSessionUser } from '@/hooks/user'
import queryClient from '@/lib/tanstack-query'

async function fetchTodoDetails() {
    const session = await getSessionUser();
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/todo/get/${session?.user.id}`)
    return response.data
}

export default function TodoRoute() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['todos'],
        queryFn: fetchTodoDetails,
    });

    function formatTimer(timerDate: Date) {
        const distance = formatDistance(new Date(Date.now()), new Date(timerDate))
        if (distance.includes("about")) {
            const parts = distance.split(" ");
            return `${parts[1]} ${parts[2]} remaining`;
        }
        return `${distance} remaining`;
    }

    useEffect(() => {
        const deleteTodo = (todoId: string) => {
            queryClient.setQueryData<Array<Todo>>(['todos'], (oldTodo = []) =>
                oldTodo.filter((todo) => todo.id !== todoId)
            );
        }

        const updateTodo = (todoId: string, updatedTodoData: Todo) => {
            queryClient.setQueryData<Array<Todo>>(['todos'], (prevTodo = []) =>
                prevTodo.map(todo =>
                    todo.id === todoId ? { ...updatedTodoData } : todo
                )
            );
        }

        const createTodo = (todo: Todo) => {
            queryClient.setQueryData<Array<Todo>>(['todos'], (prevTodos = []) => {
                return prevTodos ? [...prevTodos, todo] : [todo]
            });

        }

        const updateTodoCompletion = (todoId: string, isCompleted: boolean) => {
            queryClient.setQueryData<Array<Todo>>(['todos'], (prevTodo = []) =>
                prevTodo.map((todo) =>
                    todo.id === todoId ? { ...todo, isCompleted } : todo
                )
            )
        }
        socket.connect();

        socket.on("todo-created", async (data) => {
            createTodo(await decryptSocketData(data))

        });

        socket.on("todo-deleted", async (data) => {
            const decryptedData = await decryptSocketData(data)
            deleteTodo(decryptedData.todoId);
        });

        socket.on("todo-updated", async (data) => {
            const decryptedData = await decryptSocketData(data)
            updateTodo(decryptedData.id, decryptedData)
        });

        socket.on("todo-completion-status", async (data) => {
            const decryptedData = await decryptSocketData(data)
            updateTodoCompletion(decryptedData.todoId, decryptedData.isCompleted)
        })
        return () => {
            socket.off("todo-created");
            socket.off("todo-deleted");
            socket.off("todo-updated")
            socket.off("todo-completion-status")
        };
    }, [])


    if (isLoading)
        return (
            <div className="md:mt-0  mt-[17dvh] shadow-2xl  rounded-xl flex flex-col items-center justify-center text-center py-10 mx-auto">
                <div className="w-12 h-12 border-4 border-neutral-50 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    if (isError) return (
        <div className="md:mt-0  mt-[17dvh] shadow-2xl rounded-xl flex flex-col items-center justify-center text-center dark:bg-neutral-950 p-5  mx-auto">
            <span className='text-red-400 flex items-center gap-3'>
                <h1 className='flex  font-xl font-bold gap-4'>Error Occurred </h1>
                <TriangleAlert />
            </span>
        </div>
    )




    async function changeCompletionStatusOfTodo(todoId: string) {
        await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/todo/toggle-completion/${todoId}`)
            .then((data) => {
            }).catch((error: AxiosError) => {
                toast.error("Failed to update Todo")
            })
    }

    return (
        <section className='p-3 w-full h-full' >
            <div className='p-5 flex items-center justify-end'>
                <CreateTodo />
            </div>
            <div className=''>
                <div className="flex  items-start flex-wrap gap-5  w-full mt-10   md:pl-[5rem]">


                    {!data || data.length == 0 ? (
                        <div className=" mt-[7dvh] shadow-2xl max-w-md rounded-xl flex flex-col items-center justify-center text-center py-10 dark:bg-neutral-800  mx-auto px-4">
                            <h1 className="text-3xl font-bold">No todos yet</h1>
                            <p className="text-sm mt-2">
                                Stay productive by adding your first task.
                            </p>
                        </div>
                    ) : (
                        data?.map((currTodo: Todo, id: number) => (

                            <div key={id} className='border-b border-neutral-200 md:w-[35rem] w-full  flex items-center bg-neutral-200/60 dark:border-neutral-950/60 dark:bg-neutral-950/60  gap-3 px-5 py-4 rounded-md'>
                                <div>
                                    <Checkbox defaultChecked={currTodo.isCompleted} onClick={() => changeCompletionStatusOfTodo(currTodo.id)} />
                                </div>
                                <div className='flex items-start flex-col '>
                                    <h1 className='text-lg tracking-tight font-medium'> {currTodo.title}</h1>
                                    <p className='text-sm font-medium dark:text-gray-400 text-gray-500'> {currTodo.description}</p>
                                    {
                                        currTodo.dueDate && (
                                            <p className='flex items-center justify-start gap-2 '>
                                                <span className='dark:text-emerald-500 text-emerald-600 text-sm font-semibold'>
                                                    {
                                                        formatTimer(currTodo.dueDate)
                                                    }
                                                </span>
                                                <AlarmCheck strokeWidth={1.5} className='w-5 h-5' />
                                            </p>
                                        )
                                    }
                                </div>

                                <div className=' ml-auto flex items-center gap-3'>
                                    <UpdateTodo todo={currTodo} />
                                    <DeleteTodo todoId={currTodo.id} todoTitle={currTodo.title} />
                                </div>

                            </div>
                        ))

                    )
                    }

                </div>
            </div>


        </section >
    )
}
