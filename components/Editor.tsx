'use client';

import React from 'react';
import { useEditor, EditorContent, Editor as TipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Link as LinkIcon, List, ListOrdered, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';

const md = new MarkdownIt();
const turndown = new TurndownService();

interface MenuBarProps {
    editor: TipTapEditor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
    if (!editor) return null;

    return (
        <div className="flex items-center gap-2 mb-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-secondary' : ''}
            >
                <Bold className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-secondary' : ''}
            >
                <Italic className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    const url = window.prompt('Enter URL:');
                    if (url) if (editor instanceof Editor) {
                        editor?.chain().focus().setLink({href: url}).run();
                    }
                }}
                className={editor.isActive('link') ? 'bg-secondary' : ''}
            >
                <LinkIcon className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'bg-secondary' : ''}
            >
                <List className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'bg-secondary' : ''}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'bg-secondary' : ''}
            >
                <Quote className="h-4 w-4" />
            </Button>
        </div>
    );
};

interface EditorProps {
    content?: string;
    onSave: (markdown: string) => void;
}

export default function Editor({ content = '', onSave }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: content ? md.render(content) : '',
        editorProps: {
            attributes: {
                class: 'prose max-w-none focus:outline-none min-h-[200px]',
            },
        },
    });

    const handleSave = () => {
        if (!editor) return;

        // i have to Convert editor HTML content to markdown before saving to db to maintain same markdown on next edit
        const html = editor.getHTML();
        const markdown = turndown.turndown(html);
        onSave(markdown);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto p-4">
            <MenuBar editor={editor} />
            <div className="border rounded-lg p-4 mb-4">
                <EditorContent editor={editor} />
            </div>
            <div className="flex justify-end">
                <Button onClick={handleSave}>Save</Button>
            </div>
        </Card>
    );
}
