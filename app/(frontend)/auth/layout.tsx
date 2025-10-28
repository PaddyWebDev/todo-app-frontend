import React from 'react'
import { auth } from '@/auth'
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import { redirect } from 'next/navigation';
import { SessionProvider } from '@/context/session';
import { SidebarTrigger } from '@/components/ui/sidebar';


interface AuthLayoutProps {
    children: React.ReactNode
}
export default async function AuthLayout({ children }: AuthLayoutProps) {
    const session = await auth()
    if (!session || !session.user) {
        redirect("/guest/Login")
    }
    return (
        <main className='h-screen w-full'>
            <SessionProvider session={session}>
                <section className='flex flex-row relative  '>
                    <Sidebar userId={session.user.id} userName={session.user.name!} />
                    <SidebarTrigger className='ml-3 mt-3 absolute' />
                    {children}
                </section>
            </SessionProvider>

        </main>
    )
}

