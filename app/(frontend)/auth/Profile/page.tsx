"use client"


import UpdateProfile from "./components/update-profile-form";
import UpdatePassword from "./components/update-password-form";
import UpdateProfileImage from "./components/update-profile-image";
import { User } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { getSessionUser, getUserByEmail } from "@/hooks/user";
import Loader from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import { TriangleAlert } from "lucide-react";


async function fetchUserDetails() {
    const sessionUser = await getSessionUser()
    const currentUser = await getUserByEmail(sessionUser?.user?.email!)
    return currentUser;
}

export default function Profile() {

    const { data, isLoading, isError } = useQuery({
        queryKey: ['todos'],
        queryFn: fetchUserDetails,
    });




    if (isLoading) {
        return (
            <div className="w-full h-dvh flex items-center justify-center ">
                <Loader />
            </div>
        )
    }

    if (isError || !data) {
        return (
            <div className="w-full h-screen shadow-2xl rounded-xl flex flex-col items-center justify-center text-center dark:bg-neutral-800 p-5  mx-auto">
                <span className='text-red-400 flex items-center gap-3 dark:bg-neutral-950 px-4 py-3 rounded-xl'>
                    <h1 className='flex  font-xl font-bold gap-4'>Error Occurred </h1>
                    <TriangleAlert />
                </span>
            </div>
        )
    }


    return (
        <main className=" min-h-screen  w-full">
            <section className="max-w-screen-lg mx-auto px-5 py-5 mt-[10dvh] rounded-xl dark:bg-neutral-800">
                <div className="  rounded-md overflow-hidden ">
                    <header className="bg-neutral-100 dark:bg-neutral-950 px-4 py-6 shadow-md mb-2">
                        <h1 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-50">Welcome back, {data.name?.split(" ")[0]}!</h1>
                    </header>
                    <UpdateProfileImage userData={data as User} />
                </div>
            </section>
        </main>
    )
}



