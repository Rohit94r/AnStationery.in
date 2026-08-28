"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Loader2, Star, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export type UploadedImage = {
  id: string;
  url: string;
  isPrimary: boolean;
};

export function ImageUploader({
  images,
  onChange,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;
      setUploading(true);
      setError("");
      const formData = new FormData();
      list.forEach((f) => formData.append("images", f));
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Upload failed");
          return;
        }
        const newImages: UploadedImage[] = data.urls.map((url: string) => ({
          id: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          url,
          isPrimary: false,
        }));
        const merged = [...images, ...newImages];
        // auto-set first as primary if none primary
        if (!merged.some((i) => i.isPrimary) && merged.length > 0) {
          merged[0].isPrimary = true;
        }
        onChange(merged);
      } catch {
        setError("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [images, onChange],
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  };

  const setPrimary = (id: string) => {
    onChange(images.map((i) => ({ ...i, isPrimary: i.id === id })));
  };

  const removeImage = (id: string) => {
    const filtered = images.filter((i) => i.id !== id);
    if (!filtered.some((i) => i.isPrimary) && filtered.length > 0) {
      filtered[0].isPrimary = true;
    }
    onChange(filtered);
  };

  const moveImage = (id: string, dir: -1 | 1) => {
    const idx = images.findIndex((i) => i.id === id);
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition",
          dragOver ? "border-yellow-deep bg-yellow-soft" : "border-line bg-cream hover:border-yellow-deep",
        )}
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-yellow-deep" />
        ) : (
          <Upload className="h-8 w-8 text-muted" />
        )}
        <p className="text-sm font-semibold">
          {uploading ? "Uploading..." : "Drag & drop or click to upload"}
        </p>
        <p className="text-xs text-muted">PNG, JPG, WEBP up to 5MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="mt-2 text-xs font-semibold text-badge-sale">{error}</p>
      )}

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {images.map((img, i) => (
            <div
              key={img.id}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-xl border-2 bg-white",
                img.isPrimary ? "border-yellow-deep" : "border-line",
              )}
            >
              <Image
                src={img.url}
                alt="Product image"
                fill
                sizes="120px"
                className="object-cover"
              />
              {img.isPrimary && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-yellow px-1.5 py-0.5 text-[9px] font-black text-ink">
                  PRIMARY
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ink/70 px-1.5 py-1 opacity-0 transition group-hover:opacity-100">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setPrimary(img.id)}
                    title="Set primary"
                    className={cn(
                      "grid h-6 w-6 place-items-center rounded-full",
                      img.isPrimary ? "bg-yellow text-ink" : "bg-white/80 text-ink hover:bg-yellow",
                    )}
                  >
                    <Star className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(img.id, -1)}
                    disabled={i === 0}
                    className="grid h-6 w-6 place-items-center rounded-full bg-white/80 text-xs font-bold disabled:opacity-30"
                  >
                    {"\u2190"}
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(img.id, 1)}
                    disabled={i === images.length - 1}
                    className="grid h-6 w-6 place-items-center rounded-full bg-white/80 text-xs font-bold disabled:opacity-30"
                  >
                    {"\u2192"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  title="Remove"
                  className="grid h-6 w-6 place-items-center rounded-full bg-badge-sale/90 text-white hover:bg-badge-sale"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
