"use client"
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginSchema, registerSchema } from '@/schema/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { validateFields } from '@/hooks/validate-fields'

export default function Register() {
    const [isPending, startTransition] = useTransition()
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
        }

    })

    async function handleRegisterData(formData: z.infer<typeof registerSchema>) {
        startTransition(async () => {
            try {
                const validatedFields = registerSchema.safeParse(formData)

                if (validatedFields.data?.confirmPassword !== validatedFields.data?.password) {
                    toast.error("Password Doesn't Match")
                }

                const response = await axios.post<AxiosResponse>("/api/register", validatedFields?.data)
                toast.success("Registration Success you'll shortly receive email");
                registerForm.reset()


            } catch (error: any) {
                registerForm.resetField('password')
                registerForm.resetField('confirmPassword')
                toast.error(error.response.data || "Error Encountered")
            }
        })
    }
    return (
        <section className='dark:bg-neutral-950 w-11/12 rounded-md bg-neutral-100 shadow-md flex items-center flex-col sm:w-[30rem]'>

            <div>
                <h1 className='text-3xl font-bold leading-tight tracking-tighter p-5'>Create your account</h1>
            </div>
            <div className=' w-full px-4 mt-2'>
                <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegisterData)} className='space-y-6'>

                        <FormField
                            control={registerForm.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" disabled={isPending} type='search' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={registerForm.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johnDoe@example.com" disabled={isPending} type='search' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={registerForm.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="*********" disabled={isPending} type={showPassword ? `search` : `password`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={registerForm.control}
                            name='confirmPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="*********" disabled={isPending} type={showPassword ? `search` : `password`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <div className="flex items-center space-x-2">
                                <Checkbox disabled={isPending} onClick={() => setShowPassword(!showPassword)} id="showPassword" />
                                <label
                                    htmlFor="showPassword"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Show Password
                                </label>
                            </div>
                        </div>
                        <Button disabled={isPending} type='submit'>
                            {isPending ? "Loading.." : "Submit"}
                        </Button>
                    </form>
                </Form>
            </div>
            <div className='w-full flex items-center justify-center p-3  my-4'>
                <Link className="text-neutral-900 underline-offset-4 font-medium hover:underline dark:text-neutral-50" href={"/guest/Login"}>{"Already have a Account?"}</Link>
            </div>
        </section>
    )
}
