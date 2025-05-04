"use client";

import React from "react";
import { Editor } from "@tiptap/react";

interface ToolbarProps {
  editor: Editor | null;
}

const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-3 py-2 rounded ${
          editor.isActive("bold") ? "bg-orange-500 text-white" : "bg-gray-200"
        }`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-3 py-2 rounded ${
          editor.isActive("italic") ? "bg-orange-500 text-white" : "bg-gray-200"
        }`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`px-3 py-2 rounded ${
          editor.isActive("heading", { level: 1 })
            ? "bg-orange-500 text-white"
            : "bg-gray-200"
        }`}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-3 py-2 rounded ${
          editor.isActive("heading", { level: 2 })
            ? "bg-orange-500 text-white"
            : "bg-gray-200"
        }`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-3 py-2 rounded ${
          editor.isActive("bulletList") ? "bg-orange-500 text-white" : "bg-gray-200"
        }`}
      >
        Bullet List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-3 py-2 rounded ${
          editor.isActive("orderedList") ? "bg-orange-500 text-white" : "bg-gray-200"
        }`}
      >
        Numbered List
      </button>
    </div>
  );
};

export default Toolbar;