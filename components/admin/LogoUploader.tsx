"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { Image as ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { uploadImage } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";

interface LogoUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  /** Max file size in bytes. Defaults to 2 MB. */
  maxSize?: number;
  className?: string;
}

/**
 * Single-image uploader tuned for logos: previews with `object-contain` so the
 * mark is never cropped, and uploads to the `brand-assets` bucket. Writes the
 * resulting public URL back through `onChange` (or `null` when removed).
 */
export default function LogoUploader({
  value,
  onChange,
  maxSize = 2 * 1024 * 1024,
  className,
}: LogoUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > maxSize) {
        toast.error(`File too large. Max ${Math.round(maxSize / 1024 / 1024)} MB.`);
        return;
      }

      setUploading(true);
      try {
        const { publicUrl } = await uploadImage({
          bucket: "brand-assets",
          file,
          pathPrefix: "logo",
        });
        onChange(publicUrl);
        toast.success("Logo uploaded");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        toast.error(message);
      } finally {
        setUploading(false);
      }
    },
    [maxSize, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
    disabled: uploading,
    maxSize,
  });

  if (value) {
    return (
      <div
        className={cn(
          "group relative flex h-28 items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-4",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="Logo preview" className="max-h-full max-w-[220px] object-contain" />
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            {...getRootProps({
              type: "button",
              className:
                "inline-flex items-center gap-1.5 rounded-full border border-border bg-black/70 px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-black",
            })}
          >
            <input {...getInputProps()} />
            <Upload className="h-3.5 w-3.5" aria-hidden />
            Replace
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-black/70 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/20"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-6 text-center transition",
        isDragActive && "border-accent-primary/60 bg-accent-primary/5",
        uploading && "cursor-wait opacity-70",
        className,
      )}
    >
      <input {...getInputProps()} />
      <div className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-text-secondary">
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <ImageIcon className="h-4 w-4" aria-hidden />
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-text-primary">
        {uploading ? "Uploading…" : "Upload logo"}
      </p>
      <p className="mt-1 text-xs text-text-muted">
        PNG or SVG with transparent background recommended · up to{" "}
        {Math.round(maxSize / 1024 / 1024)} MB
      </p>
    </div>
  );
}
