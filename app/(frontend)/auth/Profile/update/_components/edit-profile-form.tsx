"use client"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import React, { useTransition } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'
import { z } from "zod"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ArrowLeftCircle } from "lucide-react"

import { updateProfileSchema } from "@/schema/form-schema"
import toast from "react-hot-toast"

interface UpdateProfileComponentProps {
    userId: string
    userDetails: any
}

type updateProfileForm = z.infer<typeof updateProfileSchema>
export default function EditProfileForm({ userDetails, userId }: UpdateProfileComponentProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const { data: session, update } = useSession()
    const form = useForm<updateProfileForm>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: userDetails.name!,
            email: userDetails.email!,
        }
    })

    async function handleData(formData: updateProfileForm) {
        startTransition(async () => {
            const validatedFields = updateProfileSchema.safeParse(formData).data
            if (!validatedFields) {
                toast.error("Failed to validated the fields");
                return;
            }

            const noChanges = (validatedFields.email === userDetails.email) &&
                (validatedFields.name === userDetails.name);


            if (noChanges) {
                form.setError("email", {
                    type: "custom",
                    message: "No Changes Detected"
                })

                form.setError("name", {
                    type: "custom",
                    message: "No Changes Detected"
                })
                return;
            }

            await axios.patch(`/api/update-user?userId=${userId}`, validatedFields)
                .then(async (data) => {
                    toast.success("Successfully updated your data")
                    await update({
                        ...session,
                        user: {
                            name: validatedFields.name,
                            email: validatedFields.email,
                            ...session?.user,
                        },
                    })
                }).catch((error: any) => {
                    console.log(error);
                    toast.error(error.response.data || "Error Encountered")
                })
        })
    }

    return (
        <section className='dark:bg-neutral-950 w-full rounded-md bg-neutral-100 shadow-md mx-auto mt-[15dvh] p-10 sm:w-[30rem] h-fit'>

            <header>
                <div className="flex items-center justify-start">
                    <Button onClick={() => router.push("/auth/Profile")} className=' rounded-full  p-0 ' size={"icon"} variant={'ghost'} >
                        <ArrowLeftCircle className="w-6 h-6" strokeWidth={2} />
                    </Button>

                    <h1 className='text-3xl font-bold leading-tight tracking-tighter p-5'>Update Profile</h1>
                </div>
                <h5 className="text-sm my-4 text-gray-600">
                    Below is the update form. Please fill in the required details to update your profile information.
                    Ensure that all fields are accurate before submitting.
                </h5>
            </header>


            <div className=' w-full  mt-2'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleData)} className='space-y-6'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="*********" disabled={isPending} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe@example.com" disabled={isPending} type='search' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />




                        <Button disabled={isPending} type='submit'>
                            {isPending ? "Loading.." : "Submit"}
                        </Button>


                    </form>
                </Form>
            </div>

        </section>
    )
}