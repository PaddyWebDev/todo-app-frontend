import React, { useMemo } from 'react'


import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from '@/app/auth/Notes/components/toolbar'
import Heading from '@tiptap/extension-heading'
import OrderedList from '@tiptap/extension-ordered-list'
import BulletList from '@tiptap/extension-bullet-list'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Footer from '@/app/auth/Notes/components/Footer'
import CharacterCount from '@tiptap/extension-character-count'
import { generateHTML } from '@tiptap/html'


interface editorProps {
    contentChange(content: string): void
    disabledStatus: boolean
    data: string
}


export default function TipTapEditor({ contentChange, data, disabledStatus }: editorProps) {
    const outputHtml = useMemo(() => {
        return generateHTML(JSON.parse(data), [
            CharacterCount, OrderedList, BulletList, TextAlign, Underline, StarterKit, Heading
        ])
    }, [data])


    const editor = useEditor({
        editorProps: {
            attributes: {
                class: "  dark:focus:outline-neutral-800 dark:bg-neutral-800 bg-neutral-100 focus:outline-neutral-900 dark:bg-neutral-800 h-[20rem] overflow-y-auto  w-full border dark:border-neutral-700/50 dark:focus-visible:border-neutral-600/50 p-3 "
            }
        },
        extensions: [
            CharacterCount.configure(),
            OrderedList.configure(),
            BulletList.configure(),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'right', 'justify', 'center'],
                defaultAlignment: "left"
            }),
            Underline,
            StarterKit,
            Heading.configure({
                HTMLAttributes: {
                    class: "text-xl ",
                    levels: [2]

                }
            })
        ],
        content: outputHtml,
        onUpdate({ editor }) {
            contentChange(JSON.stringify(editor.getJSON()));
        },
    })
    return (
        <div className=' shadow-md dark:shadow-neutral-700/40'>
            <Toolbar editor={editor} />
            <EditorContent style={{ whiteSpace: "pre-line", }} disabled={disabledStatus} editor={editor} />
            <Footer editor={editor} />
        </div>
    )
}
