import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVideoQuery } from '@/hooks/useVideoQuery';
import { useStore } from '@/store/useStore';

interface UploadVideoFormProps {
  onSuccess?: () => void; // Optional callback when upload is successful
}

export function UploadVideoForm({ onSuccess }: UploadVideoFormProps) {
  const { user } = useStore();
  // No pagination needed for mutations
  const { createVideo, isCreatingVideo } = useVideoQuery();
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // References to file inputs
  const videoFileRef = useRef<HTMLInputElement>(null);
  const thumbnailFileRef = useRef<HTMLInputElement>(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  
  // File state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  // Video preview
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  // Reset update status after 3 seconds
  useEffect(() => {
    if (updateStatus !== 'idle') {
      const timer = setTimeout(() => {
        setUpdateStatus('idle');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [updateStatus]);

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [videoPreview, thumbnailPreview]);

  // Simulate upload progress 
  useEffect(() => {
    let progressInterval: number | null = null;
    
    if (isCreatingVideo && uploadProgress < 95) {
      progressInterval = window.setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 500);
    }
    
    if (!isCreatingVideo && uploadProgress > 0) {
      // Complete the progress bar when upload is done
      setUploadProgress(100);
      
      // Reset after a delay
      const resetTimer = setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
      
      return () => clearTimeout(resetTimer);
    }
    
    return () => {
      if (progressInterval) window.clearInterval(progressInterval);
    };
  }, [isCreatingVideo, uploadProgress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'video' | 'thumbnail') => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Update file state
      if (fileType === 'video') {
        setVideoFile(file);
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setVideoPreview(previewUrl);
      } else {
        setThumbnailFile(file);
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setThumbnailPreview(previewUrl);
      }
    }
  };

  // Handle removing selected file
  const removeFile = (fileType: 'video' | 'thumbnail') => {
    if (fileType === 'video') {
      setVideoFile(null);
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
      }
      if (videoFileRef.current) {
        videoFileRef.current.value = '';
      }
    } else {
      setThumbnailFile(null);
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
        setThumbnailPreview(null);
      }
      if (thumbnailFileRef.current) {
        thumbnailFileRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.user_id) {
      setUpdateStatus('error');
      return;
    }
    
    if (!videoFile) {
      setUpdateStatus('error');
      return;
    }

    setUploadProgress(0);
    
    try {
      // Create video with files in a single request
      const uploadData = {
        user_id: Number(user.user_id),
        title: formData.title,
        description: formData.description,
        videoFile: videoFile,
        thumbnailFile: thumbnailFile || undefined,
      };

      // Create video record in database and upload files
      createVideo(uploadData, {
        onSuccess: (data) => {
          setUpdateStatus('success');
          setFormData({
            title: '',
            description: '',
          });
          setVideoFile(null);
          setThumbnailFile(null);
          setVideoPreview(null);
          setThumbnailPreview(null);
          if (videoFileRef.current) videoFileRef.current.value = '';
          if (thumbnailFileRef.current) thumbnailFileRef.current.value = '';
          
          // Dispatch event to notify other components about the video upload
          window.dispatchEvent(new CustomEvent('video-uploaded', { 
            detail: { video: data } 
          }));
          
          if (onSuccess) onSuccess();
        },
        onError: (error) => {
          setUpdateStatus('error');
          console.error('Error creating video:', error);
        }
      });
    } catch (error) {
      console.error('Error during upload process:', error);
      setUpdateStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {updateStatus === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          Video uploaded successfully!
        </div>
      )}
      
      {updateStatus === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          Failed to upload video. Please try again.
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          className="w-full resize-y rounded-md border border-input bg-transparent px-3 py-2"
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label>Video File *</Label>
        <div className="flex flex-col space-y-2">
          {/* Video preview */}
          {videoPreview && (
            <div className="relative w-full max-w-md h-64 border border-input rounded-md overflow-hidden">
              <video 
                src={videoPreview}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          )}
          
          {/* File input */}
          <div className="flex items-center gap-2">
            <Input
              ref={videoFileRef}
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, 'video')}
              className="flex-1"
              required={!videoFile}
              disabled={isCreatingVideo}
            />
            {videoFile && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => removeFile('video')}
                disabled={isCreatingVideo}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Thumbnail Image (Optional)</Label>
        <div className="flex flex-col space-y-2">
          {/* Thumbnail preview */}
          {thumbnailPreview && (
            <div className="relative w-48 h-36 border border-input rounded-md overflow-hidden">
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* File input */}
          <div className="flex items-center gap-2">
            <Input
              ref={thumbnailFileRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'thumbnail')}
              className="flex-1"
              disabled={isCreatingVideo}
            />
            {thumbnailFile && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => removeFile('thumbnail')}
                disabled={isCreatingVideo}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Upload progress bar */}
      {isCreatingVideo && uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isCreatingVideo}>
        {isCreatingVideo ? 'Uploading...' : 'Upload Video'}
      </Button>
    </form>
  );
} 