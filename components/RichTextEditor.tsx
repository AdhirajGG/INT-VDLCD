// components/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
// import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Underline as UnderlineIcon,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Highlighter,
    LinkIcon,
    Code,
    Quote,
    Minus,
    Palette
} from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2],
                },
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc pl-5",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal pl-5",
                    },
                },
                codeBlock: false, // Disable default to use our customized version
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Highlight.configure({
                multicolor: true,
            }),
            Link.configure({
                openOnClick: true,
                protocols: ['ftp', 'mailto'],
                HTMLAttributes: {
                    class: "text-blue-400 underline",
                    rel: 'noopener noreferrer',
                    target: '_blank',
                },
            }),
            TextStyle,
            Color,
            // CodeBlock.configure({
            //     HTMLAttributes: {
            //         class: "bg-gray-900 text-white p-4 rounded-md font-mono",
            //     },
            // }),
            Blockquote.configure({
                HTMLAttributes: {
                    class: "border-l-4 border-gray-500 pl-4 italic",
                },
            }),
            HorizontalRule.configure({
                HTMLAttributes: {
                    class: "my-4 border-t border-gray-600",
                },
            }),
            Placeholder.configure({
                placeholder: "Enter product description...",
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: "prose prose-invert max-w-none focus:outline-none min-h-[200px] p-4",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    const setLink = () => {
        if (linkUrl === null) {
            return;
        }

        if (linkUrl === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
        setShowLinkDialog(false);
        setLinkUrl("");
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded-md border-gray-600 bg-gray-800">
            <MenuBar
                editor={editor}
                setShowLinkDialog={setShowLinkDialog}
            />

            {/* Link Dialog */}
            {showLinkDialog && (
                <div className="p-2 bg-gray-700 border-b border-gray-600">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="flex-1 p-1 text-sm bg-gray-800 text-white rounded border border-gray-600"
                        />
                        <button
                            onClick={setLink}
                            className="px-2 py-1 text-sm bg-indigo-600 text-white rounded"
                        >
                            Apply
                        </button>
                        <button
                            onClick={() => setShowLinkDialog(false)}
                            className="px-2 py-1 text-sm bg-gray-600 text-white rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <EditorContent editor={editor} />
        </div>
    );
}

// MenuBar for the editor
const MenuBar = ({ editor, setShowLinkDialog }: { editor: any; setShowLinkDialog: (show: boolean) => void }) => {
    const buttons = [
        {
            onClick: () => editor.chain().focus().toggleBold().run(),
            active: editor.isActive("bold"),
            icon: <Bold className="h-4 w-4" />,
            title: "Bold",
        },
        {
            onClick: () => editor.chain().focus().toggleItalic().run(),
            active: editor.isActive("italic"),
            icon: <Italic className="h-4 w-4" />,
            title: "Italic",
        },
        {
            onClick: () => editor.chain().focus().toggleUnderline().run(),
            active: editor.isActive("underline"),
            icon: <UnderlineIcon className="h-4 w-4" />,
            title: "Underline",
        },
        {
            onClick: () => editor.chain().focus().toggleStrike().run(),
            active: editor.isActive("strike"),
            icon: <Strikethrough className="h-4 w-4" />,
            title: "Strikethrough",
        },
        // {
        //     onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        //     active: editor.isActive("heading", { level: 1 }),
        //     icon: <Heading1 className="h-4 w-4" />,
        //     title: "Heading 1",
        // },
        // {
        //     onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        //     active: editor.isActive("heading", { level: 2 }),
        //     icon: <Heading2 className="h-4 w-4" />,
        //     title: "Heading 2",
        // },
        {
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            active: editor.isActive("bulletList"),
            icon: <List className="h-4 w-4" />,
            title: "Bullet List",
        },
        {
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            active: editor.isActive("orderedList"),
            icon: <ListOrdered className="h-4 w-4" />,
            title: "Ordered List",
        },
        {
            onClick: () => editor.chain().focus().setTextAlign("left").run(),
            active: editor.isActive({ textAlign: "left" }),
            icon: <AlignLeft className="h-4 w-4" />,
            title: "Align Left",
        },
        {
            onClick: () => editor.chain().focus().setTextAlign("center").run(),
            active: editor.isActive({ textAlign: "center" }),
            icon: <AlignCenter className="h-4 w-4" />,
            title: "Align Center",
        },
        {
            onClick: () => editor.chain().focus().setTextAlign("right").run(),
            active: editor.isActive({ textAlign: "right" }),
            icon: <AlignRight className="h-4 w-4" />,
            title: "Align Right",
        },
        {
            onClick: () => editor.chain().focus().setTextAlign("justify").run(),
            active: editor.isActive({ textAlign: "justify" }),
            icon: <AlignJustify className="h-4 w-4" />,
            title: "Justify",
        },
        {
            onClick: () => editor.chain().focus().toggleHighlight().run(),
            active: editor.isActive("highlight"),
            icon: <Highlighter className="h-4 w-4" />,
            title: "Highlight",
        },
        {
            onClick: () => {
                const previousUrl = editor.getAttributes("link").href;
                setShowLinkDialog(true);
            },
            active: editor.isActive("link"),
            icon: <LinkIcon className="h-4 w-4" />,
            title: "Link",
        },
        // {
        //     onClick: () => editor.chain().focus().toggleCodeBlock().run(),
        //     active: editor.isActive("codeBlock"),
        //     icon: <Code className="h-4 w-4" />,
        //     title: "Code Block",
        // },
        {
            onClick: () => editor.chain().focus().toggleBlockquote().run(),
            active: editor.isActive("blockquote"),
            icon: <Quote className="h-4 w-4" />,
            title: "Blockquote",
        },
        {
            onClick: () => editor.chain().focus().setHorizontalRule().run(),
            icon: <Minus className="h-4 w-4" />,
            title: "Horizontal Rule",
        },
        {
            onClick: () => editor.chain().focus().setColor("#00FFFF").run(),
            active: editor.isActive("textStyle", { color: "#00FFFF" }),
            icon: <Palette className="h-4 w-4" />,
            title: "Set Color",
        },
    ];

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-600 bg-gray-700">
            {buttons.map((button, index) => (
                <button
                    key={index}
                    onClick={button.onClick}
                    className={`p-2 rounded flex items-center justify-center ${button.active
                            ? "bg-indigo-600 text-white"
                            : "text-gray-300 hover:bg-gray-600"
                        }`}
                    title={button.title}
                >
                    {button.icon}
                </button>
            ))}
        </div>
    );
};