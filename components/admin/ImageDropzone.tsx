"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { Image as ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { uploadImage, type StorageBucket } from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";

interface ImageDropzoneProps {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket: StorageBucket;
  pathPrefix?: string;
  /** Max file size in bytes. Defaults to 5 MB. */
  maxSize?: number;
  label?: string;
  className?: string;
}

/**
 * Single-image drag-and-drop uploader. Uploads to Supabase Storage and writes
 * the public URL back via `onChange`. Shows the existing preview when a value
 * is present, with a remove button.
 */
export default function ImageDropzone({
  value,
  onChange,
  bucket,
  pathPrefix,
  maxSize = 5 * 1024 * 1024,
  label = "Drag & drop or click to upload",
  className,
}: ImageDropzoneProps) {
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
          bucket,
          file,
          pathPrefix,
        });
        onChange(publicUrl);
        toast.success("Image uploaded");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        toast.error(message);
      } finally {
        setUploading(false);
      }
    },
    [bucket, pathPrefix, maxSize, onChange],
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
          "group relative overflow-hidden rounded-xl border border-border bg-background",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value}
          alt="Cover preview"
          className="aspect-[16/9] w-full object-cover"
        />
        <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex gap-2">
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
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex aspect-[16/9] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-6 text-center transition",
        isDragActive && "border-accent-primary/60 bg-accent-primary/5",
        uploading && "cursor-wait opacity-70",
        className,
      )}
    >
      <input {...getInputProps()} />
      <div className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-text-secondary">
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <ImageIcon className="h-4 w-4" aria-hidden />
        )}
      </div>
      <p className="mt-3 text-sm font-medium text-text-primary">
        {uploading ? "Uploading…" : label}
      </p>
      <p className="mt-1 text-xs text-text-muted">
        PNG, JPG, WEBP up to {Math.round(maxSize / 1024 / 1024)} MB
      </p>
    </div>
  );
}
