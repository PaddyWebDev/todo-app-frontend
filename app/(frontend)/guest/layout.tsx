import { auth } from '@/auth'
import React from 'react'
import Navbar from './components/navbar'

interface GuestLayoutProps {
    children: React.ReactNode
}

export default async function GuestLayout({ children }: GuestLayoutProps) {

    const sessionUser = await auth()

    return (
        <main className='h-dvh bg-neutral-50 dark:bg-neutral-900 w-full'>
            <Navbar user={sessionUser} />
            <section className='flex items-center w-full h-[92dvh] justify-center'>
                {children}
            </section>
        </main>
    )
}
