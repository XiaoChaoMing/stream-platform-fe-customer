import { useState } from "react";
import { uploadFile, deleteFile } from "@/config/minioConfig";

export function useMinio() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File, path: string) => {
    try {
      setIsUploading(true);
      setError(null);
      const url = await uploadFile(file, path);
      return url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const remove = async (path: string) => {
    try {
      setIsDeleting(true);
      setError(null);
      await deleteFile(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete file");
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    upload,
    remove,
    isUploading,
    isDeleting,
    error
  };
}
