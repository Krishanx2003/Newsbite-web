"use client";

import React, { useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";
import Toolbar from "./Toolbar";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

// Create a Tiptap extension for the paste handler
const PasteExtension = Extension.create({
  name: "pasteHandler",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("handlePaste"),
        props: {
          handlePaste: (view, event) => {
            event.preventDefault(); // Prevent default paste behavior

            // Get clipboard content
            const clipboardData = event.clipboardData;
            if (!clipboardData) return false;

            // Try to get HTML content first, fall back to plain text
            let html = clipboardData.getData("text/html");
            const text = clipboardData.getData("text/plain");

            if (!html && !text) return false;

            if (!html && text) {
              // Handle plain text paste
              view.dispatch(
                view.state.tr.insertText(text, view.state.selection.from, view.state.selection.to)
              );
              return true;
            }

            // Parse HTML content
            const parser = new DOMParser();
            const dom = parser.parseFromString(html, "text/html");

            // Clean up and normalize the DOM
            const cleanDom = cleanUpPastedHTML(dom.body);

            // Convert DOM to ProseMirror nodes
            const slice = ProseMirrorDOMParser.fromSchema(view.state.schema).parseSlice(cleanDom);

            // Insert the parsed content into the editor
            view.dispatch(view.state.tr.replaceSelection(slice));

            return true; // Indicate that the paste event was handled
          },
        },
      }),
    ];
  },
});

// Function to clean up and normalize pasted HTML
const cleanUpPastedHTML = (node: HTMLElement): HTMLElement => {
  const container = document.createElement("div");
  const walk = (node: Node, parent: HTMLElement) => {
    if (node.nodeType === Node.TEXT_NODE) {
      parent.appendChild(document.createTextNode(node.textContent || ""));
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();
    let newNode: HTMLElement | null = null;

    // Map HTML tags to Tiptap nodes/marks
    switch (tagName) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6": {
        newNode = document.createElement(tagName);
        break;
      }
      case "p":
        newNode = document.createElement("p");
        break;
      case "a": {
        newNode = document.createElement("a");
        const href = element.getAttribute("href");
        if (href) newNode.setAttribute("href", href);
        break;
      }
      case "strong":
      case "b":
        newNode = document.createElement("strong");
        break;
      case "em":
      case "i":
        newNode = document.createElement("em");
        break;
      case "u":
        newNode = document.createElement("u");
        break;
      case "code":
        newNode = document.createElement("code");
        break;
      case "pre": {
        newNode = document.createElement("pre");
        const code = document.createElement("code");
        newNode.appendChild(code);
        element.childNodes.forEach((child) => code.appendChild(child.cloneNode(true)));
        break;
      }
      case "blockquote":
        newNode = document.createElement("blockquote");
        break;
      case "ul":
        newNode = document.createElement("ul");
        break;
      case "ol":
        newNode = document.createElement("ol");
        break;
      case "li":
        newNode = document.createElement("li");
        break;
      case "hr":
        newNode = document.createElement("hr");
        break;
      case "img": {
        newNode = document.createElement("img");
        const src = element.getAttribute("src");
        const alt = element.getAttribute("alt");
        if (src) newNode.setAttribute("src", src);
        if (alt) newNode.setAttribute("alt", alt);
        break;
      }
      case "span": {
        newNode = document.createElement("span");
        // Handle inline styles like color or highlight
        const style = element.getAttribute("style");
        if (style) {
          const colorMatch = style.match(/color:\s*(#[0-9a-fA-F]{6}|rgb\([^)]+\))/);
          const bgMatch = style.match(/background-color:\s*(#[0-9a-fA-F]{6}|rgb\([^)]+\))/);
          if (colorMatch) newNode.setAttribute("style", `color: ${colorMatch[1]}`);
          if (bgMatch) newNode.setAttribute("data-highlight", bgMatch[1]);
        }
        break;
      }
      default:
        // For unsupported tags, create a span to preserve inline content
        newNode = document.createElement("span");
        break;
    }

    if (newNode) {
      // Copy relevant attributes (e.g., text-align)
      if (element.style.textAlign) {
        newNode.style.textAlign = element.style.textAlign;
      }

      // Recursively process child nodes
      element.childNodes.forEach((child) => walk(child, newNode!));

      parent.appendChild(newNode);
    } else {
      // If no new node, process children directly into parent
      element.childNodes.forEach((child) => walk(child, parent));
    }
  };

  walk(node, container);
  return container;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
      Image,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
      HorizontalRule,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight,
      Underline,
      PasteExtension, // Use the Tiptap extension
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Memoize the toolbar to prevent unnecessary re-renders
  const toolbar = useMemo(() => <Toolbar editor={editor} />, [editor]);

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
      {editor && toolbar} {/* Only render toolbar if editor is initialized */}
      <EditorContent editor={editor} className="min-h-[200px] prose dark:prose-invert max-w-none" />
    </div>
  );
};

export default RichTextEditor;