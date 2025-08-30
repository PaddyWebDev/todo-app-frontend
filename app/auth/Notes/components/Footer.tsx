import React from 'react'
import { type Editor } from '@tiptap/react'

interface FooterProps {
    editor: Editor | null
}


export default function Footer({ editor }: FooterProps) {
    if (!editor) {
        return null;
    }
    return (
        <div className=' rounded-b-md w-full px-5 py-4 flex items-center justify-end gap-4 border dark:border-neutral-700/50 dark:bg-neutral-950 bg-neutral-200 '>
            <h3>
                Characters: {editor.storage.characterCount.characters()}
            </h3>
            <h3>
                Words: {editor.storage.characterCount.words()}
            </h3>
        </div>
    )
}
