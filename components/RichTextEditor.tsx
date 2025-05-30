// components/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
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

  return (
    <div className="border rounded-md border-gray-600 bg-gray-800">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

// MenuBar for the editor
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const buttons = [
    {
      onClick: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      icon: "B",
      title: "Bold",
    },
    {
      onClick: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      icon: "I",
      title: "Italic",
    },
    {
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
      icon: "H1",
      title: "Heading 1",
    },
    {
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      icon: "H2",
      title: "Heading 2",
    },
    {
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      icon: "UL",
      title: "Bullet List",
    },
    {
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      icon: "OL",
      title: "Ordered List",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-600 bg-gray-700">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          className={`px-2 py-1 text-sm font-medium rounded ${
            button.active ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-600"
          }`}
          title={button.title}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};