import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import React, { useCallback } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 p-2 flex flex-wrap gap-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('underline') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        title="Underline"
      >
        <u>U</u>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        title="Strikethrough"
      >
        <s>S</s>
      </button>
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        title="Heading 1"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        title="Heading 2"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        title="Heading 3"
      >
        H3
      </button>
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        title="Bullet List"
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        title="Numbered List"
      >
        1. List
      </button>
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        title="Align Left"
      >
        ←
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        title="Align Center"
      >
        ↔
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        title="Align Right"
      >
        →
      </button>
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        title="Code Block"
      >
        {'</>'}
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-600' : ''
          }`}
        title="Blockquote"
      >
        Quote
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Horizontal Rule"
      >
        —
      </button>
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, onImageUpload }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-500 hover:text-indigo-600 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your article...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Color,
      Highlight,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!onImageUpload) return;
      try {
        const url = await onImageUpload(file);
        editor?.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    },
    [editor, onImageUpload]
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) handleImageUpload(file);
        }
      }
    },
    [handleImageUpload]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const files = event.dataTransfer?.files;
      if (!files) return;

      for (const file of files) {
        if (file.type.startsWith('image/')) {
          handleImageUpload(file);
        }
      }
    },
    [handleImageUpload]
  );

  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none"
      />
    </div>
  );
};

const lowlight = createLowlight(common);

export default RichTextEditor; 