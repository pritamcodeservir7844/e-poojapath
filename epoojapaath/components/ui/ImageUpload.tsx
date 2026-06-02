"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  required?: boolean;
  className?: string;
  previewHeight?: string;
}

export function ImageUpload({
  label,
  value,
  onChange,
  folder = "epoojapaath",
  required,
  className = "",
  previewHeight = "h-40",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualUrl, setManualUrl] = useState(value || "");

  useEffect(() => {
    setManualUrl(value || "");
  }, [value]);

  async function handleFile(file: File) {
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Sirf image files allowed hain (JPG, PNG, WEBP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image 5MB se chhoti honi chahiye");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success) {
        onChange(data.url);
        setError("");
      } else {
        // Upload failed — show error + manual URL input as fallback
        setError(`Upload failed: ${data.error}. Ya neeche URL manually daalo.`);
        setShowManualUrl(true);
      }
    } catch {
      setError("Network error. Ya neeche URL manually daalo.");
      setShowManualUrl(true);
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function remove() {
    onChange("");
    setError("");
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onInputChange}
      />

      {value ? (
        <div className={`relative rounded-xl overflow-hidden border border-border ${previewHeight} w-full group`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30 transition"
            >
              <Upload size={13} /> Change
            </button>
            <button
              type="button"
              onClick={remove}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/70 backdrop-blur-sm text-white text-xs font-medium hover:bg-red-500 transition"
            >
              <X size={13} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`
            flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed
            transition-all cursor-pointer select-none ${previewHeight} w-full
            ${dragOver ? "border-saffron bg-saffron/5 scale-[1.01]" : "border-border hover:border-saffron/50 hover:bg-muted/30"}
            ${uploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="text-saffron animate-spin" size={28} />
              <p className="text-xs text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center">
                <ImageIcon className="text-saffron" size={20} />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-foreground">Click karo ya drag & drop karo</p>
                <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WEBP • Max 5MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between gap-2 mt-1.5">
          <p className="text-xs text-red-500 flex items-center gap-1">
            <X size={11} /> {error}
          </p>
          {!showManualUrl && (
            <button
              type="button"
              onClick={() => setShowManualUrl(true)}
              className="text-[10px] font-bold text-saffron hover:underline"
            >
              Enter URL Manually
            </button>
          )}
        </div>
      )}

      {/* Fallback: manual URL input jab upload fail ho */}
      {showManualUrl && (
        <div className="mt-2.5 p-3 bg-muted/30 border border-border rounded-xl space-y-2">
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ya image URL manually daalo:</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. /tripura-sundari.jpeg or https://..."
              value={manualUrl}
              onChange={e => setManualUrl(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (manualUrl.trim()) {
                    onChange(manualUrl.trim());
                    setShowManualUrl(false);
                    setError("");
                  }
                }
              }}
              className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-saffron transition"
            />
            <button
              type="button"
              onClick={() => {
                if (manualUrl.trim()) {
                  onChange(manualUrl.trim());
                  setShowManualUrl(false);
                  setError("");
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-saffron text-white text-xs font-semibold hover:bg-saffron/90 transition shadow-sm"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => {
                setShowManualUrl(false);
                setManualUrl(value || "");
              }}
              className="px-3 py-2 rounded-xl bg-muted text-muted-foreground text-xs hover:bg-muted/80 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
