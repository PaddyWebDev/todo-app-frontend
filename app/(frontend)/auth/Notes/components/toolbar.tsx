import React from 'react'
import { type Editor } from '@tiptap/react'
import {
    Bold,
    Strikethrough,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Quote,
    Undo2,
    Redo2,
    Underline,
    AlignLeft,
    AlignRight,
    AlignCenter,
    AlignJustify
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'


interface ToolbarProps {
    editor: Editor | null
}

export default function Toolbar({ editor }: ToolbarProps) {
    if (!editor) {
        return null
    }
    return (
        <div className='border dark:border-neutral-700/50 dark:bg-neutral-950 bg-neutral-200 rounded-t-md px-3 py-2 flex items-center justify-around gap-6  w-full flex-wrap'>
            <Toggle
                size="sm"
                pressed={editor.isActive("heading")}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <Heading2 className='w-5 h-5' />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
                <Bold className='w-5 h-5' />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            >
                <Italic className='w-5 h-5' />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("underline")}
                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
            >
                <Underline className='w-5 h-5' />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            >
                <Strikethrough className='w-5 h-5' />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'left' })}
                onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
            >
                <AlignLeft className='w-5 h-5' />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'right' })}
                onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
            >
                <AlignRight className='w-5 h-5' />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'center' })}
                onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
            >
                <AlignCenter className='w-5 h-5' />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'justify' })}
                onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
            >
                <AlignJustify className='w-5 h-5' />
            </Toggle>

            <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            >
                <List className='w-5 h-5' />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered className='w-5 h-5' />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("blockquote")}
                onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <Quote className='w-5 h-5' />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("undo")}
                onPressedChange={() => editor.chain().focus().undo().run()}
            >
                <Undo2 className='w-5 h-5' />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("redo")}
                onPressedChange={() => editor.chain().focus().redo().run()}
            >
                <Redo2 className='w-5 h-5' />
            </Toggle>

        </div>
    )
}


