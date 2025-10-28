"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React, { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { z } from "zod"
import axios from 'axios'
import { ArrowLeftCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { updatePasswordSchema } from '@/schema/form-schema'
import toast from 'react-hot-toast'

type updatePasswordForm = z.infer<typeof updatePasswordSchema>
export default function UpdatePassword() {

    const router = useRouter()
    const params = useParams()
    const { Id } = params
    if (!Id) {
        router.push('/auth/dashboard')
    }
    const [isPending, startTransition] = useTransition()
    const [passwordState, setPasswordState] = useState<boolean>(false)
    const updatePasswordForm = useForm<updatePasswordForm>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            currentPassword: "",
            updatedPassword: "",
            confirmUpdatedPassword: ""
        }
    })

    async function handlePasswordUpdate(values: updatePasswordForm) {
        startTransition(async () => {
            const validatedData = updatePasswordSchema.safeParse(values).data;
            if (!validatedData) {
                toast.error("Failed to validate form")
                return;
            }

            if (validatedData.currentPassword === validatedData.updatedPassword) {
                toast.error("Previous and current passwords shouldn't be same");
                return;
            }

            if (validatedData.updatedPassword !== validatedData.confirmUpdatedPassword) {
                updatePasswordForm.setError("confirmUpdatedPassword", {
                    type: "confirmUpdatedPassword",
                    message: "Password Doesn't match"
                })
                return
            }
            await axios.patch(`/api/update-password?userId=${Id}`, {
                password: validatedData.updatedPassword
            }).then((data) => {
                toast.success(data.data ?? "Password updated successfully")

                updatePasswordForm.reset()
            }).catch((error) => {
                toast.error(error.response.data ?? "error occurred while processing the request")
            })
        })
    }
    return (
        <section className="dark:bg-zinc-800 rounded-lg mx-auto h-fit w-11/12 md:max-w-[30rem] mt-[15dvh] p-5 sm:p-6 md:p-8 space-y-8 shadow-2xl shadow-neutral-500/50 dark:shadow-neutral-950/70 ">

            <header className='flex flex-col'>
                <div className='flex flex-row  items-center flex-wrap '>
                    <Button onClick={() => router.push("/auth/Profile")} className=' rounded-full ' variant={'ghost'} >
                        <ArrowLeftCircle />
                    </Button>
                    <h1 className='text-center text-3xl font-semibold mb-3 mt-4'>Reset your password </h1>
                </div>
                <p className='text-base font-light text-center'>Below enter your new password</p>
            </header>


            <div className='w-11/12 mx-auto'>
                <Form {...updatePasswordForm} >
                    <form className="space-y-4  " onSubmit={updatePasswordForm.handleSubmit(handlePasswordUpdate)}>

                        <FormField
                            control={updatePasswordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Old Password</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} className='dark:bg-neutral-950 shadow-md' type={passwordState ? "text" : 'password'}  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={updatePasswordForm.control}
                            name="updatedPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} className='dark:bg-neutral-950 shadow-md' type={passwordState ? "text" : 'password'}  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={updatePasswordForm.control}
                            name="confirmUpdatedPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} className='dark:bg-neutral-950 shadow-md' type={passwordState ? "text" : 'password'}  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center space-x-2">
                            <Checkbox id="showPassword" onClick={() => setPasswordState(!passwordState)} />
                            <label
                                htmlFor="showPassword"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Show Password
                            </label>
                        </div>

                        <Button disabled={isPending} type='submit' className='w-full'>
                            {isPending ? ("Loading...") : ("Reset Password")}
                        </Button>

                    </form>
                </Form>
            </div>
        </section>
    )
}
