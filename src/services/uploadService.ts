import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Interface for file upload response
 */
interface FileUploadResponse {
  fileUrl: string;
  filename: string;
  mimeType: string;
}

/**
 * Uploads a file to the server
 * @param file - The file to upload
 * @param folder - Optional folder name (defaults to 'uploads')
 * @returns Promise with the file URL response
 */
export const uploadFile = async (file: File, folder?: string): Promise<FileUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await axios.post<FileUploadResponse>(
      `${API_URL}/uploads/file`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Validate if a file is an image
 * @param file - The file to validate
 * @returns boolean indicating if the file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Validate if a file is a video
 * @param file - The file to validate
 * @returns boolean indicating if the file is a video
 */
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

/**
 * Get file size in a human-readable format
 * @param bytes - File size in bytes
 * @returns String with human-readable file size
 */
export const getReadableFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}; 