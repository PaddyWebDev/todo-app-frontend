// "use client"
// import Link from 'next/link'
// import React, { useEffect } from 'react'
// import clsx from 'clsx'
// import useRoutes from '@/hooks/navigation-routes'
// import { redirect } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { signOut } from 'next-auth/react'
// import { LogOut } from 'lucide-react'


// export default function Sidebar() {
//     const routes = useRoutes()

//     return (

//         <React.Fragment>
//             <aside className=' bg-neutral-200 dark:bg-neutral-950 md:w-[20rem] md:flex flex-col justify-between gap-5 p-5 hidden h-full min-h-[93dvh] border dark:border-neutral-800/60 border-neutral-200/60 '>
//                 <nav className='flex dark:bg-neutral-900 bg-neutral-50 gap-5 py-3 px-5 rounded-md shadow-md w-[85%]  flex-col'>
//                     {
//                         routes.map((route, id: number) => (
//                             <div key={id} className={clsx(' p-3 rounded-md dark:hover:bg-neutral-800 hover:bg-neutral-200', route.active && "dark:bg-neutral-800 bg-neutral-200")}>
//                                 <Link className='flex items-center gap-2' href={route.href}>
//                                     <route.icon className='h-5 w-5 dark:text-neutral-50 text-neutral-950' />
//                                     <span>{route.label}</span>
//                                 </Link>

//                             </div>
//                         ))
//                     }
//                 </nav>

//                 <div className='rounded-md shadow-md  mb-8 ml-4  '>
//                     <Button className='flex items-center justify-start gap-2 w-[50%] py-3 px-5' size={"sm"}  onClick={() => signOut({ redirect: true, })}>
//                         Log Out <LogOut  />
//                     </Button>
//                 </div>
//             </aside>

//             <section className="fixed bottom-0 left-0 z-50 w-full h-16 bg-neutral-50 border-t shadow-md md:hidden dark:bg-neutral-700 dark:border-gray-600 border dark:border-neutral-800/60 border-neutral-200/60 flex items-center justify-center">
//                 <nav className='flex items-center justify-evenly gap-5'  >
//                     {
//                         routes.map((route, id: number) => (
//                             <div key={id} className={clsx(' p-3 rounded-md dark:hover:bg-neutral-800 hover:bg-neutral-200', route.active && "dark:bg-neutral-800 bg-neutral-200")}>
//                                 <Link className='flex items-center gap-2' href={route.href}>
//                                     <route.icon className='h-5 w-5 dark:text-neutral-50 text-neutral-950' />
//                                     <span>{route.label}</span>
//                                 </Link>

//                             </div>
//                         ))
//                     }
//                 </nav>
//             </section>
//         </React.Fragment>
//     )
// }

"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarContent, SidebarHeader, Sidebar as ShadCNSidebar, SidebarGroup, SidebarFooter } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Home, Lightbulb, LogOut, LucideIcon, Search, User, UserCog, Pen } from "lucide-react"
import { Button } from "@/components/ui/button"
import SignOutUser from "@/hooks/user"
import useRoutes from "@/hooks/navigation-routes"


interface SidebarProps {
    userId: string
    userName: string
}

type linksType = {
    label: string,
    href: string
    icon: LucideIcon
}

export default function Sidebar({ userId, userName }: SidebarProps) {

    const pathname = usePathname()

    const links = useRoutes()

    return (
        <ShadCNSidebar variant="inset" collapsible="offcanvas" className="min-h-dvh bg-neutral-100 dark:bg-neutral-800 shadow-lg rounded-r-lg">
            <SidebarHeader className="border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 ">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Notezzy</h2>
            </SidebarHeader>
            <SidebarContent className="px-1 py-6 overflow-y-auto max-h-full">
                <SidebarGroup>
                    <nav className="flex flex-col space-y-3 bg-neutral-100 dark:bg-neutral-950 px-2 py-2 rounded-xl shadow-md">
                        {links.map((link, id) => (
                            <Link
                                key={id}
                                href={link.href}
                                className={cn(
                                    "px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors",
                                    link.active
                                        ? "bg-neutral-200 dark:bg-neutral-700 font-semibold text-neutral-900 dark:text-neutral-100"
                                        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                )}
                            >
                                <span>
                                    <link.icon />
                                </span>
                                {link.label}
                            </Link>
                        ))}

                        {
                            pathname === "/auth/Profile" && (
                                <>
                                    <Link
                                        href={`/auth/Profile/update/${userId}`}
                                        className={cn(
                                            "px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors",
                                            pathname === `/auth/profile/update/${userId}`
                                                ? "bg-neutral-200 dark:bg-neutral-700 font-semibold text-neutral-900 dark:text-neutral-100"
                                                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                        )}
                                    >
                                        <span>
                                            <Pen />
                                        </span>
                                        Update Details
                                    </Link>
                                    <Link
                                        href={`/auth/Profile/update-password/${userId}`}
                                        className={cn(
                                            "px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors",
                                            pathname === `/auth/profile/update-password/${userId}`
                                                ? "bg-neutral-200 dark:bg-neutral-700 font-semibold text-neutral-900 dark:text-neutral-100"
                                                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                        )}
                                    >
                                        <span>
                                            <UserCog />
                                        </span>
                                        Update Password
                                    </Link>
              
                                </>
                            )
                        }


                    </nav>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>

                <div className="flex items-center justify-around bg-neutral-100 shadow-md  dark:bg-neutral-950 py-2 rounded-md ">
                    <h1 className={"px-3 py-2 rounded-md flex items-center gap-2 ml-3 text-sm font-medium "} >
                        <span>
                            <User />
                        </span>
                        {userName.split(" ")[0]}
                    </h1>
                    <Button title="Sign Out" variant={"ghost"} className="flex mr-3 items-center justify-start gap-2 dark:hover:bg-neutral-700" onClick={() => SignOutUser()}>
                        <LogOut />
                    </Button>
                </div>
            </SidebarFooter>
        </ShadCNSidebar>
    )
}




