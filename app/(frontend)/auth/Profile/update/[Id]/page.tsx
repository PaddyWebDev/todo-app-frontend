"use client"
import React from 'react'
import { returnUserDataForUpdate } from '@/hooks/user'
import Loader from '@/components/loader';
import { useQuery } from '@tanstack/react-query';
import { TriangleAlert } from 'lucide-react';
import UpdateProfile from '../_components/update-profile-form';
import { useParams } from 'next/navigation';


export default function UpdateProfilePage() {

    const { Id } = useParams();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {

            return await returnUserDataForUpdate(Id as string)
        }
    })

    if (!Id || Id === null) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <div className='dark:bg-neutral-800 bg-neutral-100 px-5 py-3 rounded-xl shadow-md'>
                    <h1 className='text-3xl font-bold text-red-600 dark:text-red-500 flex items-center justify-center gap-3'>UserId is required <TriangleAlert strokeWidth={2} /></h1>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <Loader />
            </div>
        )
    }

    if (isError || !data) {
        return (
            <div className='w-full h-full flex items-center justify-center'>
                <div className='dark:bg-neutral-800 bg-neutral-100 px-5 py-3 rounded-xl shadow-md'>
                    <h1 className='text-3xl font-bold text-red-600 dark:text-red-500 flex items-center justify-center gap-3'>Error Occurred <TriangleAlert strokeWidth={2} /></h1>
                </div>
            </div>
        )
    }

    return (
        <UpdateProfile userData={data} />
    )
}
