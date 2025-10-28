import React from 'react'


import { redirect } from 'next/navigation'
import EditProfileForm from '../_components/edit-profile-form'
import { getUserById } from '@/hooks/user'

interface UpdateProfileProps {
    params: Promise<{ Id: string }>
}

export default async function UpdateProfilePage({ params }: UpdateProfileProps) {
    const { Id } = await params
    const user = await getUserById(Id)

    if (!user) {
        redirect("/guest/Login")
    }
    return (
        <React.Suspense>
            <EditProfileForm userDetails={user} userId={Id} />
        </React.Suspense>
    )
}
