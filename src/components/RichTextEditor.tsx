"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import {
  Bold, Italic, Strikethrough, List, ListOrdered,
  Heading2, Heading3, Link as LinkIcon, Quote, Undo, Redo,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

function Btn({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      // preventDefault on mousedown keeps the editor selection while clicking the toolbar
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded transition ${
        active
          ? "bg-orange-600 text-white"
          : "text-slate-600 hover:bg-slate-200"
      } disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const addLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Ссылка (URL):", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
      <Btn title="Жирный" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
        <Bold size={16} />
      </Btn>
      <Btn title="Курсив" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
        <Italic size={16} />
      </Btn>
      <Btn title="Зачёркнутый" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
        <Strikethrough size={16} />
      </Btn>
      <span className="mx-1 h-5 w-px bg-slate-300" />
      <Btn title="Заголовок" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
        <Heading2 size={16} />
      </Btn>
      <Btn title="Подзаголовок" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
        <Heading3 size={16} />
      </Btn>
      <span className="mx-1 h-5 w-px bg-slate-300" />
      <Btn title="Маркированный список" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
        <List size={16} />
      </Btn>
      <Btn title="Нумерованный список" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
        <ListOrdered size={16} />
      </Btn>
      <Btn title="Цитата" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
        <Quote size={16} />
      </Btn>
      <Btn title="Ссылка" onClick={addLink} active={editor.isActive("link")}>
        <LinkIcon size={16} />
      </Btn>
      <span className="mx-1 h-5 w-px bg-slate-300" />
      <Btn title="Отменить" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo size={16} />
      </Btn>
      <Btn title="Повторить" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo size={16} />
      </Btn>
    </div>
  );
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // обязательно для Next.js (SSR)
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[160px] px-4 py-3 focus:outline-none",
      },
    },
  });

  // Синхронизация при смене редактируемого элемента (handleEdit задаёт новое значение)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border-2 border-slate-200 focus-within:border-orange-600">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
