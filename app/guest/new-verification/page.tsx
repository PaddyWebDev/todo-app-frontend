"use client"
import { verifyUserEmail } from '@/hooks/user'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'

export default function NewVerification() {
    const [success, setSuccess] = useState<boolean>(false)
    const searchParams = useSearchParams()
    const token = searchParams.get("token")



    const handleVerification = useCallback(() => {
        if (success) return;

        verifyUserEmail(token!)
            .then((data: string) => {
                console.log(data);
                setSuccess(true)
            }).catch((error: string) => {
                console.log(error);
                // toast.error(error)
            })
    }, [token, setSuccess, success])

    useEffect(() => {
        handleVerification()
        if (!token) {
            redirect("/guest/Login")
        }
    }, [token, handleVerification])
    return (
        <section className='dark:bg-zinc-800 rounded     w-[30rem] p-5 space-y-8'>
            <header>
                <h1 className='text-center text-3xl font-semibold mb-2 '>Confirming your verification </h1>
                <p className='text-base font-light text-center'>Confirming your email verification</p>
            </header>

            <div className='flex items-center w-full justify-center '>
                {success ?
                    (
                        <div>
                            <h1 className='dark:text-green-400 text-green-500 text-xl'> Email Has been verified</h1>
                        </div>
                    )
                    :
                    (
                        <div>
                            <ClipLoader />
                        </div>
                    )
                }
            </div>
            <div>
                <Link className="text-zinc-900 underline-offset-4 text-sm  hover:underline cursor-pointer dark:text-zinc-50" href={"/guest/Login"}>Back to Login</Link>
            </div>
        </section>
    )
}
