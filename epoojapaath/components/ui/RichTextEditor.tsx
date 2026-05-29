"use client";

import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (html: string) => void;
  required?: boolean;
  placeholder?: string;
}

export function RichTextEditor({
  label,
  value,
  onChange,
  required,
  placeholder,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInputting = useRef(false);

  // Sync internal HTML with external value
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value && !isInputting.current) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isInputting.current = true;
      const html = editorRef.current.innerHTML;
      // If it's just empty paragraphs/br, treat as empty string
      if (html === "<p><br></p>" || html === "<br>" || html === "") {
        onChange("");
      } else {
        onChange(html);
      }
      setTimeout(() => {
        isInputting.current = false;
      }, 0);
    }
  };

  const executeCommand = (command: string, arg: string = "") => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");

    if (html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      
      const cleanNode = (node: Node): Node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          // Strip all attributes except href for links
          const attributes = Array.from(el.attributes);
          for (const attr of attributes) {
            if (attr.name !== "href") {
              el.removeAttribute(attr.name);
            }
          }
          // Clean children recursively
          const children = Array.from(el.childNodes);
          for (const child of children) {
            cleanNode(child);
          }
        }
        return node;
      };

      const cleanBody = cleanNode(doc.body) as HTMLElement;
      const cleanHtml = cleanBody.innerHTML;
      document.execCommand("insertHTML", false, cleanHtml);
    } else {
      document.execCommand("insertText", false, text);
    }
    handleInput();
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="border border-border bg-background rounded-xl overflow-hidden focus-within:border-saffron transition">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 bg-muted/40 border-b border-border px-3 py-1.5 text-xs select-none">
          <button
            type="button"
            onClick={() => executeCommand("bold")}
            className="p-1.5 rounded hover:bg-muted text-foreground font-bold font-mono w-7 h-7 flex items-center justify-center border border-transparent hover:border-border"
            title="Bold (Ctrl+B)"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => executeCommand("italic")}
            className="p-1.5 rounded hover:bg-muted text-foreground italic font-mono w-7 h-7 flex items-center justify-center border border-transparent hover:border-border"
            title="Italic (Ctrl+I)"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<h3>")}
            className="p-1.5 rounded hover:bg-muted text-foreground font-bold w-9 h-7 flex items-center justify-center border border-transparent hover:border-border"
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => executeCommand("formatBlock", "<p>")}
            className="p-1.5 rounded hover:bg-muted text-foreground font-semibold px-1.5 h-7 flex items-center justify-center border border-transparent hover:border-border text-[10px]"
            title="Normal Paragraph Text"
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertUnorderedList")}
            className="p-1.5 rounded hover:bg-muted text-foreground w-7 h-7 flex items-center justify-center border border-transparent hover:border-border"
            title="Bullet List"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertOrderedList")}
            className="p-1.5 rounded hover:bg-muted text-foreground w-7 h-7 flex items-center justify-center border border-transparent hover:border-border"
            title="Numbered List"
          >
            1.
          </button>
          <div className="w-px h-4 bg-border mx-1" />
          <button
            type="button"
            onClick={() => executeCommand("removeFormat")}
            className="p-1.5 rounded hover:bg-muted text-muted-foreground text-[10px] uppercase font-bold border border-transparent hover:border-border"
            title="Clear Formatting"
          >
            Clear
          </button>
        </div>

        {/* Editable Area */}
        <div className="relative">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            onPaste={handlePaste}
            placeholder={placeholder || "History, significance, and details..."}
            className="px-3 py-2.5 min-h-[180px] text-sm text-foreground focus:outline-none overflow-y-auto prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 empty:before:content-[attr(placeholder)] empty:before:text-muted-foreground/50 empty:before:pointer-events-none empty:before:absolute"
            style={{ outline: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
