"use client"


import UpdateProfile from "./components/update-profile-form";
import UpdatePassword from "./components/update-password-form";
import UpdateProfileImage from "./components/update-profile-image";
import { User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { getSessionUser, getUserByEmail } from "@/hooks/user";
import Loader from "@/components/loader";


export default function Profile() {
    const [user, setUser] = useState<User>()

    const getUser = useCallback(async function () {
        const sessionUser = await getSessionUser()
        const currentUser = await getUserByEmail(sessionUser?.user?.email!)
        setUser(currentUser!)
    }, [])

    useEffect(() => {
        getUser()
    }, [getUser])


    if (!user) {
        return (
            <Loader />
        )
    }


    return (
        <main className=" min-h-screen  w-full">
            <section className="max-w-screen-lg mx-auto px-4 py-8 mt-5 dark:bg-neutral-800">
                <div className="  rounded-md overflow-hidden ">
                    <header className="bg-neutral-100 dark:bg-neutral-950 px-4 py-6 shadow-md">
                        <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-50">Welcome back, {user.name?.split(" ")[0]}!</h1>
                    </header>
                    <UpdateProfileImage userData={user as User} />
                    <UpdateProfile userData={user as User} />
                    <UpdatePassword userData={user as User} />
                </div>
            </section>
        </main>
    )
}



