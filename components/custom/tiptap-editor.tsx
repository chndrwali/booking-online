"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Undo,
  Redo,
} from "lucide-react";
import "./tiptap-editor.css";

interface TiptapEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function ToolbarButton({
  onClick,
  isActive = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("tiptap-toolbar-btn", isActive && "is-active")}
      title={title}
    >
      {children}
    </button>
  );
}

export function TiptapEditor({
  value = "",
  onChange,
  placeholder = "Tulis sesuatu...",
  disabled = false,
  className,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Return empty string if editor only has empty paragraph
      onChange?.(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: {
        class: "tiptap",
      },
    },
  });

  // Sync editable state with disabled prop
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentHTML = editor.getHTML();
      const normalizedCurrent = currentHTML === "<p></p>" ? "" : currentHTML;
      if (normalizedCurrent !== value) {
        editor.commands.setContent(value || "");
      }
    }
  }, [editor, value]);

  const runCommand = useCallback(
    (callback: () => void) => {
      return () => {
        callback();
        editor?.chain().focus().run();
      };
    },
    [editor],
  );

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("tiptap-editor", disabled && "disabled", className)}>
      <div className="tiptap-toolbar">
        {/* Text formatting */}
        <div className="tiptap-toolbar-group">
          <ToolbarButton
            onClick={runCommand(() =>
              editor.chain().focus().toggleBold().run(),
            )}
            isActive={editor.isActive("bold")}
            title="Bold"
          >
            <Bold />
          </ToolbarButton>
          <ToolbarButton
            onClick={runCommand(() =>
              editor.chain().focus().toggleItalic().run(),
            )}
            isActive={editor.isActive("italic")}
            title="Italic"
          >
            <Italic />
          </ToolbarButton>
          <ToolbarButton
            onClick={runCommand(() =>
              editor.chain().focus().toggleUnderline().run(),
            )}
            isActive={editor.isActive("underline")}
            title="Underline"
          >
            <UnderlineIcon />
          </ToolbarButton>
          <ToolbarButton
            onClick={runCommand(() =>
              editor.chain().focus().toggleStrike().run(),
            )}
            isActive={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="tiptap-toolbar-group">
          <ToolbarButton
            onClick={runCommand(() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run(),
            )}
            isActive={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 />
          </ToolbarButton>
          <ToolbarButton
            onClick={runCommand(() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run(),
            )}
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 />
          </ToolbarButton>
          <ToolbarButton
            onClick={runCommand(() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run(),
            )}
            isActive={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 />
          </ToolbarButton>
        </div>

        {/* Lists & blocks */}
        <div className="tiptap-toolbar-group">
          <ToolbarButton
            onClick={runCommand(() =>
              editor.chain().focus().toggleBulletList().run(),
            )}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List />
          </ToolbarButton>
          <ToolbarButton
            onClick={runCommand(() =>
              editor.chain().focus().toggleOrderedList().run(),
            )}
            isActive={editor.isActive("orderedList")}
            title="Ordered List"
          >
            <ListOrdered />
          </ToolbarButton>
          <ToolbarButton
            onClick={runCommand(() =>
              editor.chain().focus().toggleBlockquote().run(),
            )}
            isActive={editor.isActive("blockquote")}
            title="Blockquote"
          >
            <Quote />
          </ToolbarButton>
          <ToolbarButton
            onClick={runCommand(() =>
              editor.chain().focus().toggleCodeBlock().run(),
            )}
            isActive={editor.isActive("codeBlock")}
            title="Code Block"
          >
            <Code />
          </ToolbarButton>
          <ToolbarButton
            onClick={runCommand(() =>
              editor.chain().focus().setHorizontalRule().run(),
            )}
            title="Horizontal Rule"
          >
            <Minus />
          </ToolbarButton>
        </div>

        {/* Undo/Redo */}
        <div className="tiptap-toolbar-group">
          <ToolbarButton
            onClick={runCommand(() => editor.chain().focus().undo().run())}
            title="Undo"
          >
            <Undo />
          </ToolbarButton>
          <ToolbarButton
            onClick={runCommand(() => editor.chain().focus().redo().run())}
            title="Redo"
          >
            <Redo />
          </ToolbarButton>
        </div>
      </div>

      <div className="tiptap-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
