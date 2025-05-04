"use client";

import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar"

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit], // Add extensions like headings, bold, italic, etc.
    content: value, // Initial content
    onUpdate: ({ editor }) => {
      const html = editor.getHTML(); // Get the HTML content
      onChange(html); // Pass the updated content to the parent component
    },
  });

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
      {/* Optional: Add a custom toolbar */}
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="min-h-[200px]" />
    </div>
  );
};

export default RichTextEditor;