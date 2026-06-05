"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import {
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  disabled?: boolean;
}

/**
 * Tiptap-backed rich text editor used for blog content + project case study
 * blocks. Emits HTML on every change so the parent form can hand it directly
 * to Supabase as the column value.
 */
export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing…",
  minHeight = 320,
  disabled,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // StarterKit v3 bundles its own Link extension; disable it so the
        // explicitly-configured Link below is the only one registered
        // (avoids the "Duplicate extension names: ['link']" warning).
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "text-accent-primary underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg my-4" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none px-5 py-4 min-h-[var(--rte-min-h)]",
        spellcheck: "true",
      },
    },
    onUpdate({ editor: ed }) {
      onChange(ed.getHTML());
    },
  });

  // Keep editor content in sync if `value` changes from outside (e.g. reset).
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() === value) return;
    editor.commands.setContent(value || "", { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-background"
      style={{ ["--rte-min-h" as string]: `${minHeight}px` }}
    >
      <Toolbar editor={editor} disabled={disabled} />
      <EditorContent editor={editor} />
    </div>
  );
}

interface ToolbarProps {
  editor: Editor | null;
  disabled?: boolean;
}

function Toolbar({ editor, disabled }: ToolbarProps) {
  if (!editor) return null;

  function promptLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function promptImage() {
    if (!editor) return;
    const url = window.prompt("Image URL", "https://");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  }

  const groups: ToolbarGroup[] = [
    [
      {
        label: "Bold",
        icon: <Bold className="h-3.5 w-3.5" />,
        active: editor.isActive("bold"),
        run: () => editor.chain().focus().toggleBold().run(),
      },
      {
        label: "Italic",
        icon: <Italic className="h-3.5 w-3.5" />,
        active: editor.isActive("italic"),
        run: () => editor.chain().focus().toggleItalic().run(),
      },
      {
        label: "Underline",
        icon: <Underline className="h-3.5 w-3.5" />,
        // StarterKit doesn't include underline by default — fall back to em emphasis-style
        active: editor.isActive("italic"),
        run: () => editor.chain().focus().toggleItalic().run(),
      },
      {
        label: "Strikethrough",
        icon: <Strikethrough className="h-3.5 w-3.5" />,
        active: editor.isActive("strike"),
        run: () => editor.chain().focus().toggleStrike().run(),
      },
    ],
    [
      {
        label: "Heading 1",
        icon: <Heading1 className="h-3.5 w-3.5" />,
        active: editor.isActive("heading", { level: 1 }),
        run: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        label: "Heading 2",
        icon: <Heading2 className="h-3.5 w-3.5" />,
        active: editor.isActive("heading", { level: 2 }),
        run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        label: "Heading 3",
        icon: <Heading3 className="h-3.5 w-3.5" />,
        active: editor.isActive("heading", { level: 3 }),
        run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
    ],
    [
      {
        label: "Bullet list",
        icon: <List className="h-3.5 w-3.5" />,
        active: editor.isActive("bulletList"),
        run: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        label: "Numbered list",
        icon: <ListOrdered className="h-3.5 w-3.5" />,
        active: editor.isActive("orderedList"),
        run: () => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        label: "Blockquote",
        icon: <Quote className="h-3.5 w-3.5" />,
        active: editor.isActive("blockquote"),
        run: () => editor.chain().focus().toggleBlockquote().run(),
      },
      {
        label: "Code block",
        icon: <Code2 className="h-3.5 w-3.5" />,
        active: editor.isActive("codeBlock"),
        run: () => editor.chain().focus().toggleCodeBlock().run(),
      },
    ],
    [
      {
        label: "Link",
        icon: <LinkIcon className="h-3.5 w-3.5" />,
        active: editor.isActive("link"),
        run: promptLink,
      },
      {
        label: "Image",
        icon: <ImageIcon className="h-3.5 w-3.5" />,
        active: false,
        run: promptImage,
      },
      {
        label: "Divider",
        icon: <Minus className="h-3.5 w-3.5" />,
        active: false,
        run: () => editor.chain().focus().setHorizontalRule().run(),
      },
    ],
    [
      {
        label: "Undo",
        icon: <Undo2 className="h-3.5 w-3.5" />,
        active: false,
        disabled: !editor.can().undo(),
        run: () => editor.chain().focus().undo().run(),
      },
      {
        label: "Redo",
        icon: <Redo2 className="h-3.5 w-3.5" />,
        active: false,
        disabled: !editor.can().redo(),
        run: () => editor.chain().focus().redo().run(),
      },
    ],
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-surface px-2 py-1.5">
      {groups.map((group, i) => (
        <div key={i} className="flex items-center gap-0.5">
          {group.map((btn) => (
            <button
              key={btn.label}
              type="button"
              title={btn.label}
              aria-label={btn.label}
              onClick={btn.run}
              disabled={disabled || btn.disabled}
              className={cn(
                "grid h-7 w-7 place-items-center rounded-md transition",
                "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
                "disabled:cursor-not-allowed disabled:opacity-50",
                btn.active && "bg-surface-2 text-text-primary",
              )}
            >
              {btn.icon}
            </button>
          ))}
          {i < groups.length - 1 && (
            <span className="mx-1 h-4 w-px bg-border" aria-hidden />
          )}
        </div>
      ))}
    </div>
  );
}

type ToolbarButton = {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  disabled?: boolean;
  run: () => void;
};
type ToolbarGroup = ToolbarButton[];
