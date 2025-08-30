import React from 'react'

import { z, ZodSchema } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { User } from '@prisma/client';
import { updateProfileSchema } from '@/schema/form-schema';
import { validateFields } from '@/hooks/validate-fields';



interface UpdateProfileProps {
    userData: User
}


export default function UpdateProfile({ userData }: UpdateProfileProps) {

    const { data: session, update } = useSession()
    const UpdateProfile = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: userData.name ?? "",
            email: userData.email
        }
    })

    async function HandleProfileUpdate(formData: z.infer<typeof updateProfileSchema>) {

        const validatedFields = await validateFields(updateProfileSchema, formData).catch((error) => toast.error(error))

        await axios.patch(`/api/update-user`, {
            oldEmail: session?.user?.email,
            ...validatedFields
        })
            .then(async (data) => {
                console.log(data);
                toast.success("User Updated")
                await update({
                    ...session,
                    user: {
                        name: formData.name,
                        email: formData.email
                    }

                })

            }).catch((error: AxiosError) => {
                console.log(error);
                toast.error(error.request.response)
            })


    }
    return (
        <div className="bg-neutral-100 dark:bg-neutral-900 mt-5 rounded p-8  shadow-md">
            <h1 className="scroll-m-20  pb-2 text-xl mt-2 font-semibold tracking-tight ">
                Profile Information
            </h1>
            <p className="text-sm">Update your {"account's"} profile information & email address</p>
            <div className="mt-5">
                <div className="md:w-6/12">
                    <Form {...UpdateProfile} >
                        <form onSubmit={UpdateProfile.handleSubmit(HandleProfileUpdate)} className="space-y-6">

                            <FormField
                                control={UpdateProfile.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel >
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your password" type={'text'}  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={UpdateProfile.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" type='email'  {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" variant={"default"}>Submit</Button>
                        </form>
                    </Form>
                </div>
                <div>

                </div>
            </div>
        </div>

    )
}


