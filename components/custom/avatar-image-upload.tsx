"use client";

import { useState, useCallback } from "react";
import { User, Loader2, Upload, X } from "lucide-react";
import { useDropzone } from "@uploadthing/react";
import { useUploadThing } from "@/components/uploadthing";
import { cn } from "@/lib/utils";
import { appToast } from "@/components/custom/app-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface AvatarImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
  className?: string;
  name?: string; // Used for initials fallback
}

export function AvatarImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  className,
  name = "",
}: AvatarImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { startUpload } = useUploadThing("publicImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        onChange(res[0].ufsUrl);
        appToast.success("Foto profil berhasil diunggah");
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      appToast.error(`Gagal mengunggah: ${error.message}`);
      setIsUploading(false);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        startUpload(acceptedFiles);
      }
    },
    [startUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    disabled: disabled || isUploading,
  });

  const handleRemove = async () => {
    if (!value || isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/uploadthing/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      onRemove();
      appToast.success("Foto profil berhasil dihapus");
    } catch {
      appToast.error("Gagal menghapus foto profil");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative group">
        <Avatar className="h-24 w-24 border-2 border-border transition-all duration-300 group-hover:border-primary/50 shadow-sm">
          {value ? (
            <AvatarImage src={value} alt="Profile" className="object-cover" />
          ) : null}
          <AvatarFallback className="bg-muted text-muted-foreground text-xl transition-colors duration-300 group-hover:bg-primary/5 group-hover:text-primary">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : name ? (
              getInitials(name)
            ) : (
              <User className="h-10 w-10 text-muted-foreground/50" />
            )}
          </AvatarFallback>
        </Avatar>

        {value && !isUploading && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isDeleting || disabled}
            className={cn(
              "absolute -top-2 -right-2 z-10",
              "flex items-center justify-center",
              "size-8 rounded-full",
              "bg-destructive/90 text-destructive-foreground",
              "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100",
              "transition-all duration-200",
              "shadow-sm",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <X className="size-4" />
            )}
          </button>
        )}
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "w-full rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-colors duration-300 outline-none",
          isDragActive
            ? "border-primary bg-primary/5 text-primary"
            : "border-border hover:border-primary/50 text-muted-foreground hover:bg-muted/50",
          (disabled || isUploading) && "opacity-50 cursor-not-allowed",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-5 w-5" />
          <div className="text-sm font-medium">
            {isUploading
              ? "Mengunggah..."
              : isDragActive
                ? "Lepaskan foto di sini"
                : value
                  ? "Pilih gambar lain"
                  : "Unggah foto profil"}
          </div>
          <p className="text-xs opacity-70">PNG, JPG, WEBP • Max 4MB</p>
        </div>
      </div>
    </div>
  );
}
