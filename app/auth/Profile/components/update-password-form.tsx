import React, { useState } from 'react'


import { z } from "zod";


import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@prisma/client';
import { getUserByEmail } from '@/hooks/user';
import { verifyPassword } from '@/hooks/password';
import { updatePasswordSchema } from '@/schema/form-schema';


interface UpdatePasswordProps {
    userData: User
}




export default function UpdatePassword({ userData }: UpdatePasswordProps) {

    const [passwordState, setPasswordState] = useState<boolean>(false)

    const updatePasswordForm = useForm<z.infer<typeof updatePasswordSchema>>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            currentPassword: "",
            updatedPassword: "",
            confirmUpdatedPassword: "",
        }
    })


    async function HandleProfileUpdate(formData: z.infer<typeof updatePasswordSchema>) {
        const user = await getUserByEmail(userData.email)
        if (await verifyPassword(formData.currentPassword, user?.password as string)) {
            if (formData.updatedPassword === formData.confirmUpdatedPassword) {
                await axios.patch(`/api/reset-password/`, {
                    newPassword: formData.updatedPassword,
                    userId: user?.id
                })
                    .then((data) => {
                        toast.success(data.data)
                        updatePasswordForm.reset()
                    })
                    .catch((error: AxiosError) => {
                        // toast.error(error.response?.data!)

                    })
            } else {
                toast.error("Passwords do not match")
            }
        } else {
            toast.error("Current password is incorrect")
        }
    }

    return (
        <div className="bg-neutral-100 dark:bg-neutral-900 mt-5 rounded p-8 shadow-md ">
            <h1 className="scroll-m-20  pb-2 text-xl mt-2 font-semibold tracking-tight ">
                Update Password
            </h1>
            <p className="text-sm">Ensure your account is using a long, random password to stay secure</p>
            <div className="mt-5">
                <div className="md:w-6/12">
                    <Form {...updatePasswordForm} >
                        <form onSubmit={updatePasswordForm.handleSubmit(HandleProfileUpdate)} className="space-y-6">

                            <FormField
                                control={updatePasswordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel >
                                            Current Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your current password" type={passwordState ? 'text' : "password"}  {...field} />
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
                                            <Input placeholder="Enter new password" type={passwordState ? 'text' : 'password'}  {...field} />
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
                                            <Input placeholder="Confirm your password" type={passwordState ? 'text' : 'password'}  {...field} />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center ml-5">
                                <Checkbox id='showPassword' onClick={() => setPasswordState(!passwordState)} />
                                <label
                                    htmlFor="showPassword"
                                    className="text-sm ml-3  cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Show Password
                                </label>
                            </div>

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
