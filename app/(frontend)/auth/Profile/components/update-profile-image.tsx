"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from 'react-hot-toast';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { User } from '@prisma/client';
// import { decryptImageString, encryptImageString, updateProfileImage } from '@/hooks/image';
import axios from 'axios';



interface UpdateProfileImageProps {
    userData: User
}

const prevImage = "https://github.com/shadcn.png"
export default function UpdateProfileImage({ userData }: UpdateProfileImageProps) {
    const [imageSrc, setImageSrc] = useState<string>(prevImage)

    useEffect(() => {
        async function getImage() {
            if (userData.image) {
                setImageSrc(userData.image)
            }
        }
        getImage()
    }, [userData.image])


    async function HandleProfileImageUpdate(event: React.FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault()
            if (!imageSrc) {
                toast.error("Image is required")
                return;
            }
            const response = await axios.patch(`/api/upload-user-image`, { email: userData.email, image: imageSrc })
            toast.success(response.data);
        } catch (error: any) {
            toast.error(error.response.data || "Error Encountered")
        }
    }

    function HandleImageUrl(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            // Convert the selected file to a data URL
            const reader = new FileReader();
            reader.onloadend = (e) => {
                setImageSrc(e.target?.result as string); // Update the image source with the data URL
            };
            reader.readAsDataURL(file);
        }

    }
    return (
        <section className="bg-neutral-100 dark:bg-neutral-900  rounded p-8 w-full shadow-md ">
            <h1 className="scroll-m-20  pb-2 text-xl mt-2 font-semibold tracking-tight ">
                Profile Image
            </h1>
            <p className="text-sm">Update your {"account's"} profile information & email address</p>
            <div className="mt-5 flex items-center justify-between flex-wrap-reverse">
                <div className="md:w-6/12 md:flex-1 md:my-0 my-3 w-full  " >
                    <form className='space-y-4' onSubmit={HandleProfileImageUpdate}>
                        <input
                            className={"border-neutral-200 dark:border-neutral-700 dark:focus-visible:ring-neutral-3 flex h-9 w-full rounded-md border  bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50  dark:placeholder:text-neutral-400 "}
                            type="file"
                            required
                            onChange={(event) => HandleImageUrl(event)}
                            accept='image/*'
                        />
                        <Button >Upload</Button>
                    </form>
                </div>

                <div className='md:6/12  p-3  md:flex-1 flex items-center justify-center '>
                    <Avatar className="md:h-4/12 md:w-4/12 h-[70%] w-[70%]" >
                        <AvatarImage src={imageSrc} className="object-cover" draggable="false" />
                    </Avatar>

                </div>
            </div>
        </section>

    )
}
