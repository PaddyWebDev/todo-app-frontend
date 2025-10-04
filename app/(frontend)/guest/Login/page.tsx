"use client"


import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { socialLogin } from '@/hooks/user'
import { validateFields } from '@/hooks/validate-fields'
import { loginSchema } from '@/schema/form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

export default function Login() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }

    })
    async function handleSocialLogin(provider: "google" | "github") {
        await socialLogin(provider)
    }
    async function handleLoginData(formData: z.infer<typeof loginSchema>) {
        startTransition(async () => {
            const validatedFields = await validateFields(loginSchema, formData).catch((error) => toast.error(error))

            await axios.post("/api/login", validatedFields)
                .then((data) => {
                    toast.success(data.data!)
                    loginForm.reset()
                    router.push("/auth/Notes")
                })
                .catch((error: AxiosError) => {
                    toast.error(error.response?.data as unknown as string)
                })

        })
    }
    return (
        <section className='dark:bg-neutral-950 rounded-md bg-neutral-100 shadow-md flex items-center flex-col sm:w-[30rem]'>
            <div>
                <h1 className='text-3xl font-bold leading-tight tracking-tighter p-5'>Sign in to your account</h1>
            </div>
            <div className=' w-full px-4 mt-2'>
                <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(handleLoginData)} className='space-y-6'>

                        <FormField
                            control={loginForm.control}
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

                        <FormField
                            control={loginForm.control}
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

                        <div>
                            <div className="flex items-center space-x-2">
                                <Checkbox onClick={() => setShowPassword(!showPassword)} id="showPassword" />
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

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                className='flex items-center '
                                onClick={() => handleSocialLogin("google")}
                                type="button"
                            >
                                <Image src={"/google.svg"} width={30} height={30} alt='social-icon' />

                            </Button>
                            <Button
                                type="button"
                                className='flex items-center '
                                onClick={() => handleSocialLogin("github")}
                            >
                                <div className='bg-white rounded-full'>
                                    <Image src={"/github.svg"} width={30} height={30} alt='social-icon' />
                                </div>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            <div className='w-full flex items-center justify-center p-3  my-4'>
                <Link className="text-neutral-900 underline-offset-4 font-medium hover:underline dark:text-neutral-50" href={"/guest/Register"}>{"Don't have a Account?"}</Link>
            </div>
        </section>
    )
}
