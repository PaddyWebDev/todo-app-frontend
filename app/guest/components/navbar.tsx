"use client"
import React, { useEffect } from 'react'
import ThemeSwitcher from '@/components/theme-switcher'
import Link from 'next/link'
import { Notebook } from 'lucide-react'
import { Session } from 'next-auth'
import { redirect } from 'next/navigation'


interface GuestNavbarProps {
    user: Session | null
}

export default function Navbar({ user }: GuestNavbarProps) {

    useEffect(() => {
        if (user) {
            redirect("/auth/Dashboard")
        }
    })
    return (
        <header className="bg-neutral-100 dark:bg-neutral-800 shadow-md py-4 px-6 flex items-center justify-between ">
            <Link href="/" className="flex items-center gap-2 dark:text-white" prefetch={false}>
                <Notebook className="w-6 h-6" />
                <span className="text-xl font-bold leading-tight tracking-tighter">Notes & Todos</span>
            </Link>
            <div>
                <ThemeSwitcher />
            </div>
        </header>
    )
}
