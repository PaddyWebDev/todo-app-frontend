import React from 'react'
import { auth } from '@/auth'
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import { redirect } from 'next/navigation';
import { SessionProvider } from '@/context/session';


interface AuthLayoutProps {
    children: React.ReactNode
}
export default async function AuthLayout({ children }: AuthLayoutProps) {
    const session = await auth()
    if (!session || !session.user) {
        redirect("/guest/Login")
    }
    return (
        <main className='flex flex-col h-screen'>
            <SessionProvider session={session}>
                <Navbar />
                <section className='flex items-center bg-neutral-50 dark:bg-neutral-900 '>
                    <Sidebar />
                    {children}
                </section>
            </SessionProvider>

        </main>
    )
}

