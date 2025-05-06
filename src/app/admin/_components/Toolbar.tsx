// components/Toolbar.tsx
"use client";

import React from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,

  Quote,
  ClockIcon,
  LinkIcon,
  ImageIcon,
  SeparatorHorizontal,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Highlighter,
  Undo,
  Redo,
} from "lucide-react"; // Or any other icon library

interface ToolbarProps {
  editor: Editor | null;
}

const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4 border-b dark:border-gray-600 pb-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-800 rounded" : ""}
      >
        <Bold className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-800 rounded" : ""}
      >
        <Italic className="w-5 h-5" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "bg-gray-200 dark:bg-gray-800 rounded" : ""}
      >
        <Underline className="w-5 h-5" />
      </button>
      {/* Add more formatting options */}
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-800 rounded' : ''}>
        <Heading1 className="w-5 h-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-800 rounded' : ''}>
        <Heading2 className="w-5 h-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-800 rounded' : ''}>
        <Heading3 className="w-5 h-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-800 rounded' : ''}>
        <ListOrdered className="w-5 h-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-800 rounded' : ''}>
        <ListOrdered className="w-5 h-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-800 rounded' : ''}>
        <Quote className="w-5 h-5" />
      </button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-800 rounded' : ''}>
        <ClockIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          const url = prompt("Enter the URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={editor.isActive("link") ? "bg-gray-200 dark:bg-gray-800 rounded" : ""}
      >
        <LinkIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          const imageUrl = prompt("Enter the image URL");
          if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
          }
        }}
      >
        <ImageIcon className="w-5 h-5" />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <SeparatorHorizontal className="w-5 h-5" />
      </button>
      <div className="flex gap-1">
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive('textAlign', { align: 'left' }) ? 'bg-gray-200 dark:bg-gray-800 rounded' : ''}>
          <AlignLeft className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive('textAlign', { align: 'center' }) ? 'bg-gray-200 dark:bg-gray-800 rounded' : ''}>
          <AlignCenter className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive('textAlign', { align: 'right' }) ? 'bg-gray-200 dark:bg-gray-800 rounded' : ''}>
          <AlignRight className="w-4 h-4" />
        </button>
      </div>
      {/* Add color and highlight options */}
      <button onClick={() => editor.chain().focus().undo().run()}>
        <Undo className="w-5 h-5" />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()}>
        <Redo className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toolbar;