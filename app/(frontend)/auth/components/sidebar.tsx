"use client"
import Link from 'next/link'
import React, { useEffect } from 'react'
import clsx from 'clsx'
import useRoutes from '@/hooks/navigation-routes'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'


export default function Sidebar() {
    const routes = useRoutes()
  
    return (
        <React.Fragment>
            <aside className=' bg-neutral-200 dark:bg-neutral-950 md:w-[20rem] md:flex flex-col justify-between gap-5 p-5 hidden h-full min-h-[93dvh] border dark:border-neutral-800/60 border-neutral-200/60 '>
                <nav className='flex dark:bg-neutral-900 bg-neutral-50 gap-5 py-3 px-5 rounded-md shadow-md w-[85%]  flex-col'>
                    {
                        routes.map((route, id: number) => (
                            <div key={id} className={clsx(' p-3 rounded-md dark:hover:bg-neutral-800 hover:bg-neutral-200', route.active && "dark:bg-neutral-800 bg-neutral-200")}>
                                <Link className='flex items-center gap-2' href={route.href}>
                                    <route.icon className='h-5 w-5 dark:text-neutral-50 text-neutral-950' />
                                    <span>{route.label}</span>
                                </Link>

                            </div>
                        ))
                    }
                </nav>

                <div className='rounded-md shadow-md  mb-8 ml-4  '>
                    <Button className='flex items-center justify-start gap-2 w-[50%] py-3 px-5' size={"sm"}  onClick={() => signOut({ redirect: true, })}>
                        Log Out <LogOut  />
                    </Button>
                </div>
            </aside>

            <section className="fixed bottom-0 left-0 z-50 w-full h-16 bg-neutral-50 border-t shadow-md md:hidden dark:bg-neutral-700 dark:border-gray-600 border dark:border-neutral-800/60 border-neutral-200/60 flex items-center justify-center">
                <nav className='flex items-center justify-evenly gap-5'  >
                    {
                        routes.map((route, id: number) => (
                            <div key={id} className={clsx(' p-3 rounded-md dark:hover:bg-neutral-800 hover:bg-neutral-200', route.active && "dark:bg-neutral-800 bg-neutral-200")}>
                                <Link className='flex items-center gap-2' href={route.href}>
                                    <route.icon className='h-5 w-5 dark:text-neutral-50 text-neutral-950' />
                                    <span>{route.label}</span>
                                </Link>

                            </div>
                        ))
                    }
                </nav>
            </section>
        </React.Fragment>
    )
}