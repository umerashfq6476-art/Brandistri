"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, Image as ImageIcon, Loader2, Trash2 } from "lucide-react";
import { uploadImage, type StorageBucket } from "@/lib/supabase/storage";
import ConfirmDialog from "./ui/ConfirmDialog";
import { cn } from "@/lib/utils";

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  bucket: StorageBucket;
  pathPrefix?: string;
  maxSize?: number;
}

/**
 * Multi-image uploader with drag-to-reorder and per-image delete confirmation.
 *
 * Stores a plain ordered array of public URLs — caller persists that array.
 */
export default function MultiImageUploader({
  value,
  onChange,
  bucket,
  pathPrefix,
  maxSize = 10 * 1024 * 1024,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const onDrop = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      setUploading(true);
      try {
        const uploaded: string[] = [];
        for (const file of files) {
          if (file.size > maxSize) {
            toast.error(
              `${file.name}: too large (max ${Math.round(maxSize / 1024 / 1024)} MB)`,
            );
            continue;
          }
          const { publicUrl } = await uploadImage({ bucket, file, pathPrefix });
          uploaded.push(publicUrl);
        }
        if (uploaded.length > 0) {
          onChange([...value, ...uploaded]);
          toast.success(
            `Uploaded ${uploaded.length} image${uploaded.length === 1 ? "" : "s"}`,
          );
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        toast.error(message);
      } finally {
        setUploading(false);
      }
    },
    [bucket, pathPrefix, maxSize, onChange, value],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: { "image/*": [] },
    disabled: uploading,
    maxSize,
  });

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const next = Array.from(value);
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    onChange(next);
  }

  function handleDelete(url: string) {
    onChange(value.filter((u) => u !== url));
    toast.success("Image removed");
    setPendingDelete(null);
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-6 py-8 text-center transition",
          isDragActive && "border-accent-primary/60 bg-accent-primary/5",
          uploading && "cursor-wait opacity-70",
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
          {uploading ? "Uploading…" : "Drop images here or click to upload"}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          Drag tiles below to reorder · {value.length} image
          {value.length === 1 ? "" : "s"} in gallery
        </p>
      </div>

      {value.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="gallery" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
              >
                {value.map((url, index) => (
                  <Draggable key={url} draggableId={url} index={index}>
                    {(prov, snapshot) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        className={cn(
                          "group relative overflow-hidden rounded-xl border border-border bg-background",
                          snapshot.isDragging && "ring-2 ring-accent-primary/50",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Gallery image ${index + 1}`}
                          className="aspect-square w-full object-cover"
                        />
                        <div
                          {...prov.dragHandleProps}
                          className="absolute left-2 top-2 grid h-7 w-7 cursor-grab place-items-center rounded-full border border-border bg-black/60 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label="Drag to reorder"
                        >
                          <GripVertical className="h-3.5 w-3.5" aria-hidden />
                        </div>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(url)}
                          aria-label="Remove image"
                          className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border border-red-500/40 bg-black/60 text-red-300 opacity-0 transition-opacity hover:bg-red-500/20 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </button>
                        <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-text-secondary">
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && handleDelete(pendingDelete)}
        title="Remove image"
        description="The image will be removed from this gallery. It will still exist in storage."
        confirmLabel="Remove"
      />
    </div>
  );
}
