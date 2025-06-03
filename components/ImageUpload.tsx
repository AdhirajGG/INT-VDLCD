// components/ImageUpload.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { colors } from "@/lib/colors";

interface ImageUploadProps {
  value: string;
  onChange: (url: string, publicId?: string) => void;
  onPublicIdChange?: (publicId: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({ 
  value, 
  onChange, 
  onPublicIdChange,
  disabled = false 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url, publicId } = await response.json();
      onChange(url, publicId);
      if (onPublicIdChange) {
        onPublicIdChange(publicId);
      }
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    if (onPublicIdChange) {
      onPublicIdChange('');
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || uploading}
      />

      {value ? (
        <div className="relative">
          <div 
            className="relative aspect-square w-full max-w-sm rounded-lg overflow-hidden border-2"
            style={{ borderColor: colors.primary.main }}
          >
            <img
              src={value}
              alt="Uploaded image"
              className="object-cover w-full h-full"
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemove}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-opacity-80 transition-colors"
          style={{ 
            borderColor: colors.primary.main,
            backgroundColor: colors.background.light 
          }}
          onClick={handleFileSelect}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" 
                style={{ borderColor: colors.primary.main }}
              />
              <p className="mt-2" style={{ color: colors.text.secondary }}>
                Uploading...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="h-12 w-12 mb-4" style={{ color: colors.primary.main }} />
              <p className="text-lg font-medium mb-2" style={{ color: colors.text.primary }}>
                Click to upload image
              </p>
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          )}
        </div>
      )}

      {!value && !disabled && (
        <Button 
          type="button"
          variant="outline" 
          onClick={handleFileSelect}
          disabled={uploading}
          className="w-full"
          style={{ borderColor: colors.primary.main, color: colors.primary.main }}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>
      )}
    </div>
  );
}