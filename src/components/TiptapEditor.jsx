"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useEffect } from "react";

function EditorToolbar({ editor }) {
  if (!editor) return null;

  const buttonClass =
    "p-2 rounded hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed border-0 bg-transparent font-semibold text-sm";

  // Use onMouseDown + preventDefault so the editor keeps focus and selection when clicking the toolbar
  function makeHandler(command) {
    return (e) => {
      e.preventDefault();
      command().run();
    };
  }

  // Block-level commands: use wrapIn / wrapInList / setCodeBlock so they work reliably
  const wrapBlockquote = () => editor.chain().focus().wrapIn("blockquote");
  const wrapBulletList = () => editor.chain().focus().wrapInList("bulletList");
  const wrapOrderedList = () => editor.chain().focus().wrapInList("orderedList");
  const setCodeBlock = () => editor.chain().focus().setCodeBlock();

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-200 bg-zinc-50">
      <button
        type="button"
        onMouseDown={makeHandler(() => editor.chain().focus().toggleBold())}
        className={`${buttonClass} ${editor.isActive("bold") ? "bg-zinc-300" : ""}`}
        title="Bold (Ctrl+B)"
      >
        B
      </button>
      <button
        type="button"
        onMouseDown={makeHandler(() => editor.chain().focus().toggleItalic())}
        className={`${buttonClass} ${editor.isActive("italic") ? "bg-zinc-300" : ""}`}
        title="Italic (Ctrl+I)"
      >
        I
      </button>
      <button
        type="button"
        onMouseDown={makeHandler(() => editor.chain().focus().toggleCode())}
        className={`${buttonClass} ${editor.isActive("code") ? "bg-zinc-300" : ""}`}
        title="Inline code (highlight only)"
      >
        &lt;/&gt;
      </button>
      <span className="w-px self-stretch bg-zinc-300 mx-1" aria-hidden />
      <button
        type="button"
        onMouseDown={makeHandler(wrapBulletList)}
        className={`${buttonClass} ${editor.isActive("bulletList") ? "bg-zinc-300" : ""}`}
        title="Bullet list"
      >
        • List
      </button>
      <button
        type="button"
        onMouseDown={makeHandler(wrapOrderedList)}
        className={`${buttonClass} ${editor.isActive("orderedList") ? "bg-zinc-300" : ""}`}
        title="Numbered list"
      >
        1. List
      </button>
      <button
        type="button"
        onMouseDown={makeHandler(setCodeBlock)}
        className={`${buttonClass} ${editor.isActive("codeBlock") ? "bg-zinc-300" : ""}`}
        title="Code block (full block)"
      >
        Code
      </button>
      <button
        type="button"
        onMouseDown={makeHandler(wrapBlockquote)}
        className={`${buttonClass} ${editor.isActive("blockquote") ? "bg-zinc-300" : ""}`}
        title="Quote"
      >
        “
      </button>
    </div>
  );
}

/**
 * Rich text editor (TipTap/ProseMirror) that syncs HTML to a hidden input
 * so it works with native form submit. Use the toolbar or shortcuts — typing
 * raw HTML is treated as plain text and won't apply formatting.
 */
export function TiptapEditor({ name = "content" }) {
  const inputRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[160px] px-3 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-pink-400",
      },
    },
    onUpdate: ({ editor }) => {
      if (inputRef.current) {
        inputRef.current.value = editor.getHTML();
      }
    },
  });

  // Keep hidden input in sync when editor is ready and on destroy
  useEffect(() => {
    if (!editor) return;
    if (inputRef.current) {
      inputRef.current.value = editor.getHTML();
    }
    return () => {
      if (inputRef.current) inputRef.current.value = "";
    };
  }, [editor]);

  return (
    <div className="rounded border border-zinc-600 bg-white overflow-hidden">
      <input type="hidden" ref={inputRef} name={name} />
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
