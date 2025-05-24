import { useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';


interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  containerClassName?: string;
}

export const Image = ({
  src,
  alt = '',
  className,
  containerClassName,
  fallback = <Skeleton className="h-full w-full" />,
  ...props
}: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        containerClassName
      )}
    >
      {(isLoading || error) && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          {fallback}
        </div>
      )}
      
      {!error && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          rel='preload'
          onLoad={() => setIsLoading(false)}
          onError={() => setError(true)}
          {...props}  
        />
      )}
    </div>
  );
};

export default Image;