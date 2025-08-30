import { auth } from '@/auth'
import React from 'react'
import Navbar from './components/navbar'

interface GuestLayoutProps {
    children: React.ReactNode
}

export default async function GuestLayout({ children }: GuestLayoutProps) {

    const sessionUser = await auth()

    return (
        <main className='h-screen bg-neutral-50 dark:bg-neutral-900  '>
            <Navbar user={sessionUser} />
            <section className='flex items-center w-full h-[93dvh] justify-center'>
                {children}
            </section>
        </main>
    )
}
