import React from 'react'
import Sidebar from "@/app/auth/components/sidebar"
import { auth } from '@/auth'
import Navbar from '@/app/auth/components/navbar';


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

