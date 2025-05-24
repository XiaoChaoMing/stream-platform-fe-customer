import { useState } from "react";
import { videoService } from "@/services/app/video";

/**
 * This hook is deprecated and should no longer be used.
 * The video service now handles file uploads through FormData directly.
 * Use the createVideo method from the video service or useVideoQuery hook instead.
 */
export function useMinio() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /**
   * Upload a file directly using the video service
   * @deprecated - Use createVideo method from video service instead
   */
  const upload = async (file: File, folder: string = 'uploads'): Promise<string> => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);
      
      // Simulate progress for compatibility with existing components
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          if (progress >= 95) {
            clearInterval(interval);
            progress = 95;
          }
          setUploadProgress(progress);
        }, 200);
        
        return () => clearInterval(interval);
      };
      
      const stopSimulation = simulateProgress();
      
      // Instead of uploading directly, we just return a temporary URL
      // The actual upload should be done through createVideo
      const tempUrl = URL.createObjectURL(file);
      
      // Finish simulation
      stopSimulation();
      setUploadProgress(100);
      
      console.warn(
        "useMinio.upload is deprecated. Use videoService.createVideo to upload files directly."
      );
      
      return tempUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Delete file is not implemented 
   * @deprecated - File deletion should be handled by the backend
   */
  const remove = async (path: string) => {
    try {
      setIsDeleting(true);
      setError(null);
      console.warn("useMinio.remove is deprecated. File deletion should be handled by the backend.");
      throw new Error("Delete functionality needs to be implemented by the backend");
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
    uploadProgress,
    error
  };
}
