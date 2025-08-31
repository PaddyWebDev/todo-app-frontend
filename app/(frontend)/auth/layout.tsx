import React from 'react'
import { auth } from '@/auth'
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';


interface AuthLayoutProps {
    children: React.ReactNode
}
export default async function AuthLayout({ children }: AuthLayoutProps) {
    const user = await auth();
    return (
        <main className='flex flex-col h-screen'>
            <Navbar />
            <section className='flex items-center bg-neutral-50 dark:bg-neutral-900 '>
                <Sidebar user={user?.user} />
                {children}
            </section>
        </main>
    )
}

