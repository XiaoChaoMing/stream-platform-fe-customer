import { Client } from "minio";

export const minioClient = new Client({
  endPoint: import.meta.env.VITE_MINIO_ENDPOINT || "localhost",
  port: Number(import.meta.env.VITE_MINIO_PORT) || 9000,
  useSSL: import.meta.env.VITE_MINIO_USE_SSL === "true",
  accessKey: import.meta.env.VITE_MINIO_ACCESS_KEY || "minioadmin",
  secretKey: import.meta.env.VITE_MINIO_SECRET_KEY || "minioadmin"
});

export const MINIO_BUCKET_NAME =
  import.meta.env.VITE_MINIO_BUCKET_NAME || "products";

// Initialize bucket if it doesn't exist
export async function initializeMinioBucket() {
  try {
    const exists = await minioClient.bucketExists(MINIO_BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(MINIO_BUCKET_NAME);
    }
  } catch (error) {
    console.error("Error initializing MinIO bucket:", error);
  }
}

// Upload file to MinIO
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    await minioClient.putObject(
      MINIO_BUCKET_NAME,
      path,
      Buffer.from(buffer),
      file.size,
      { "Content-Type": file.type }
    );
    return `${import.meta.env.VITE_MINIO_PUBLIC_URL}/${MINIO_BUCKET_NAME}/${path}`;
  } catch (error) {
    console.error("Error uploading file to MinIO:", error);
    throw error;
  }
}

// Delete file from MinIO
export async function deleteFile(path: string): Promise<void> {
  try {
    await minioClient.removeObject(MINIO_BUCKET_NAME, path);
  } catch (error) {
    console.error("Error deleting file from MinIO:", error);
    throw error;
  }
}
