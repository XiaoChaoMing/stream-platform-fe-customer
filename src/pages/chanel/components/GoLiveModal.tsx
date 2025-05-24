import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Radio, RefreshCw, Copy, ArrowLeft, ArrowRight, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useSocket } from "@/components/base/socketContext/SocketContext";
import HLSPlayer from "@/components/app/video/hls-stream-video";
import { toast, Toaster } from "sonner";
import Hls from "hls.js";
import { Label } from "@/components/ui/label";
import { uploadFile } from "@/services/uploadService";

interface StreamFormData {
  title: string;
  description: string;
  stream_url: string;
  status: 'scheduled' | 'live' | 'ended';
  thumbnail?: File;
  thumbnailUrl?: string;
}

const STREAM_URL_PREFIX = import.meta.env.VITE_STREAM_URL;

// Function to generate a random stream token
const generateStreamToken = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 12;
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const STEPS = [
  { number: 1, title: 'Stream Details' },
  { number: 2, title: 'Stream Setup' }
];

export const GoLiveModal = ({streamId}:{streamId:string}) => {
  const { t } = useTranslation();
  const { socket } = useSocket();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isStreamValid, setIsStreamValid] = useState<boolean>(false);
  const [streamToken, setStreamToken] = useState<string>('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<StreamFormData>({
    defaultValues: {
      title: '',
      description: '',
      stream_url: '',
      status: 'live'
    }
  });

  // Handle thumbnail change
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('thumbnail', file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  // Generate initial stream token
  useEffect(() => {
    if (currentStep === 2 && !streamToken) {
      setStreamToken(generateStreamToken());
    }
  }, [currentStep]);

  const fullStreamUrl = `${STREAM_URL_PREFIX}${streamToken}.m3u8`;

  const handleRegenToken = () => {
    setStreamToken(generateStreamToken());
    setIsStreamValid(false);
  };

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(streamToken);
      toast.success(t('Stream token copied to clipboard'));
    } catch (err) {
      toast.error(t('Failed to copy token'));
    }
  };

  const validateStream = useCallback(() => {
    if (!streamToken) return;
    setIsValidating(true);

    // Add a timeout to ensure we don't wait forever
    const timeoutId = setTimeout(() => {
      setIsValidating(false);
      setIsStreamValid(false);
      toast.error(t('Stream validation timeout'));
    }, 15000);

    // We'll use the HLSPlayer's error handling to validate
    const videoElement = document.createElement('video');
    const hls = new Hls();

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      setIsValidating(false);
      setIsStreamValid(true);
      clearTimeout(timeoutId);
      hls.destroy();
    });

    hls.on(Hls.Events.ERROR, () => {
      setIsValidating(false);
      setIsStreamValid(false);
      clearTimeout(timeoutId);
      hls.destroy();
    });

    hls.loadSource(fullStreamUrl);
    hls.attachMedia(videoElement);
  }, [streamToken, fullStreamUrl, t]);

  const onSubmit = async (data: StreamFormData) => {
    if (!isStreamValid) {
      toast.error(t('Please validate stream first'));
      return;
    }

    if (!socket.isConnected()) {
      toast.error(t('Socket connection lost. Please refresh the page.'));
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload thumbnail if available
      let thumbnailUrl = '';
      if (data.thumbnail) {
        try {
          const uploadResponse = await uploadFile(data.thumbnail, 'thumbnails');
          thumbnailUrl = uploadResponse.fileUrl;
        } catch (error) {
          console.error('Failed to upload thumbnail:', error);
          toast.error(t('Failed to upload thumbnail'));
          setIsUploading(false);
          return;
        }
      }
      
      // Define the stream data object
      type StreamDataType = {
        id: string;
        title: string;
        description: string;
        stream_url: string;
        status: 'scheduled' | 'live' | 'ended';
        thumbnail_url?: string;
      };

      // Create stream data object
      const streamData: StreamDataType = {
        id: streamId,
        title: data.title,
        description: data.description || '',
        stream_url: fullStreamUrl,
        status: data.status,
      };
      
      // Add thumbnail URL if available
      if (thumbnailUrl) {
        streamData.thumbnail_url = thumbnailUrl;
      }

      setIsUploading(false);

      const handleSuccess = () => {
        toast.success(t('Stream started successfully'));
        setIsOpen(false);
        socket.off('streamStarted', handleSuccess);
        socket.off('streamError', handleError);
      };

      const handleError = (error: any) => {
        console.error("Stream error:", error);
        toast.error(typeof error === 'string' ? error : t('Failed to start stream'));
        socket.off('streamStarted', handleSuccess);
        socket.off('streamError', handleError);
      };

      // Remove any existing listeners first
      socket.off('streamStarted', handleSuccess);
      socket.off('streamError', handleError);

      // Add new listeners
      socket.on('streamStarted', handleSuccess);
      socket.on('streamError', handleError);

      // Set a timeout for the socket response
      const timeout = setTimeout(() => {
        toast.error(t('Stream request timed out. Please try again.'));
        socket.off('streamStarted', handleSuccess);
        socket.off('streamError', handleError);
      }, 10000); // 10 seconds timeout
      
      console.log(streamData);
      
      // Emit event with the regular object
      socket.emit('startStream', streamData);

      // Add a one-time listener for acknowledgment
      socket.on('streamAck', (response: any) => {
        clearTimeout(timeout);
        socket.off('streamAck');
        if (response?.error) {
          handleError(response.error);
        }
      });

    } catch (error) {
      setIsUploading(false);
      toast.error(t('Failed to start stream'));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('Title')}</label>
              <Input
                {...register('title', { required: t('Title is required') })}
                placeholder={t('Enter stream title')}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('Description')}</label>
              <Textarea
                {...register('description')}
                placeholder={t('Enter stream description')}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('Thumbnail')}</Label>
              <div className="flex flex-col gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="cursor-pointer"
                />
                {thumbnailPreview && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                {!thumbnailPreview && (
                  <div className="flex aspect-video w-full items-center justify-center rounded-lg border bg-muted">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('Stream Token')}</label>
              <div className="flex gap-2">
                <Input
                  value={streamToken}
                  readOnly
                  className="font-mono bg-muted"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRegenToken}
                  title={t('Generate new token')}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyToken}
                  title={t('Copy token')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground break-all">
                {t('Stream URL')}: {fullStreamUrl}
              </p>
            </div>

            <div className="space-y-2">
              <Button 
                type="button" 
                onClick={validateStream}
                disabled={!streamToken || isValidating}
                className="w-full"
              >
                {isValidating ? t('Validating...') : t('Validate Stream')}
              </Button>
            </div>

            {streamToken && isStreamValid && (
              <div className="rounded-lg overflow-hidden">
                <HLSPlayer
                  src={fullStreamUrl}
                  controls={true}
                  height={240}
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="relative flex items-center justify-between mb-8">
        {/* Progress Bar */}
        <div className="absolute top-4/12 -translate-x-1/2 w-4/6 h-1 bg-gray-200 left-1/2 -translate-y-1/2">
          <div 
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {STEPS.map((step) => (
          <div 
            key={step.number}
            className="relative flex flex-col items-center gap-2"
          >
            <div 
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                transition-colors duration-300 z-10
                ${currentStep >= step.number 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {step.number}
            </div>
            <span 
              className={`
                text-sm font-medium transition-colors duration-300
                ${currentStep >= step.number ? 'text-purple-500' : 'text-gray-500'}
              `}
            >
              {t(step.title)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: { zIndex: 100000 }
        }}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            className="ml-2 bg-purple-500 hover:bg-purple-600 text-white"
            title={t('Go Live')}
          >
            <Radio className="h-4 w-4 mr-2" />
            {t('Go Live')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentStep === 1 ? t('Stream Details') : t('Stream Setup')}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {renderStepIndicator()}

            {renderStepContent()}

            <div className="flex justify-between pt-4 border-t">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('Back')}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  {t('Cancel')}
                </Button>
              )}

              {currentStep < 2 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!watch('title')}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {t('Next')}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !isStreamValid || isUploading}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {isSubmitting || isUploading ? t('Starting...') : t('Start Stream')}
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}; 