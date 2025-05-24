import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { useSocket } from '@/components/base/socketContext/SocketContext';

interface VideoPlayerProps {
  videoUrl: string;
  videoId: string | number;
  initialViewCount?: number;
  onViewCountUpdate?: (newViewCount: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  videoId,
  initialViewCount = 0,
  onViewCountUpdate 
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const { socket } = useSocket();

  
  // Track playback time and view status
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [totalDuration, setTotalDuration] = useState(0);
  const watchTimeRef = useRef(0);
  const hasCountedViewRef = useRef(false);
  const isPlayingRef = useRef(false);
  
  // We'll use 10% of the video duration instead of a fixed time
  const WATCH_PERCENTAGE_THRESHOLD = 0.1; // 10% of video duration
  
  // Parse videoId to number if needed
  const numericVideoId = typeof videoId === 'string' ? parseInt(videoId, 10) : videoId;
  
  // Detect iOS device
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };
  
  // Update parent component when view count changes
  useEffect(() => {
    if (onViewCountUpdate) {
      onViewCountUpdate(viewCount);
    }
  }, [viewCount, onViewCountUpdate]);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize video.js player
    const videoElement = document.createElement("video-js");
    videoElement.classList.add('vjs-big-play-centered', 'vjs-theme-twitch');
    
    // Set attributes for iOS Safari compatibility
    videoElement.setAttribute('playsinline', 'true');
    videoElement.setAttribute('webkit-playsinline', 'true');
    
    if (videoRef.current) {
      videoRef.current.innerHTML = '';
      videoRef.current.appendChild(videoElement);
    }

    // Check iOS compatibility
    const iOS = isIOS();

    // Video.js options
    const options = {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      aspectRatio: '16:9',
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
      html5: {
        vhs: {
          overrideNative: !iOS,
        },
        nativeAudioTracks: iOS,
        nativeVideoTracks: iOS,
        nativeTextTracks: iOS
      },
      sources: [
        {
          src: videoUrl || 'https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4',
          type: 'video/mp4'
        }
      ]
    };

    // Initialize player
    const player = videojs(videoElement, options, () => {
      // iOS Safari specific setup
      if (iOS) {
        const videoEl = player.el().querySelector('video');
        if (videoEl) {
          videoEl.setAttribute('playsinline', 'true');
          videoEl.setAttribute('webkit-playsinline', 'true');
        }
      }
      
      // Get current view count when player is ready
      socket.emit('getVideoViewCount', numericVideoId);
    });
    
    playerRef.current = player;
    
    // Get total duration when metadata is loaded
    player.on('loadedmetadata', () => {
      const duration = player.duration();
      if (duration && !isNaN(duration)) {
        setTotalDuration(duration);
      }
    });
    
    // safari support
    if (iOS) {
      player.on('loadstart', () => {
        // For iOS, we need to repeatedly check for duration 
        // as it might not be immediately available
        const checkDuration = setInterval(() => {
          const duration = player.duration();
          if (duration && !isNaN(duration) && duration > 0) {
            setTotalDuration(duration);
            clearInterval(checkDuration);
          }
        }, 500);
        
        // Clear the interval after 10 seconds to prevent infinite checks
        setTimeout(() => clearInterval(checkDuration), 10000);
      });
    }

    // Track play/pause state
    player.on('play', () => {
      isPlayingRef.current = true;
    });

    player.on('pause', () => {
      isPlayingRef.current = false;
    });
    
    // Reset watch status when video ends
    player.on('ended', () => {
      watchTimeRef.current = 0;
      hasCountedViewRef.current = false;
      isPlayingRef.current = false;
    });
    
    // Handle seeking
    player.on('seeking', () => {
      const currentTime = player.currentTime();
      // If seeking to near the start, reset view counting
      if (currentTime !== undefined && currentTime < 3) {
        watchTimeRef.current = 0;
        hasCountedViewRef.current = false;
      }
    });
    
    // Track play time and handle view counting
    player.on('timeupdate', () => {
      // Only process if video is actually playing
      if (!isPlayingRef.current) return;

      const currentTime = player.currentTime();
      if (currentTime === undefined) return;
      
      // Calculate threshold time (10% of total duration)
      const thresholdTime = totalDuration * WATCH_PERCENTAGE_THRESHOLD;
      
      // Update watch time only for forward playback
      if (currentTime > watchTimeRef.current) {
        watchTimeRef.current = currentTime;
        
        // Check if we've reached 10% and haven't counted the view yet
        if (totalDuration > 0 && 
            currentTime >= thresholdTime && 
            !hasCountedViewRef.current) {
          hasCountedViewRef.current = true;
          // Increment view count
          socket.emit('incrementViewCount', numericVideoId);
        }
      }
    });
    
    // Listen for viewCount updates from server
    socket.on('incrementViewCountResponse', (response) => {
      if (response.status === 'success' && response.videoId === numericVideoId) {
        setViewCount(response.viewCount);
      }
    });
    
    socket.on('getVideoViewCountResponse', (response) => {
      if (response.status === 'success' && response.videoId === numericVideoId) {
        setViewCount(response.viewCount);
      }
    });

    // Add Twitch-like styles with CSS
    const style = document.createElement('style');
    style.textContent = `
      /* Custom Twitch-like player styles */
      .video-js.vjs-theme-twitch {
        /* Primary Twitch purple color */
        --vjs-theme-twitch--primary: #9146FF;
        --vjs-theme-twitch--secondary: #fff;
      }
      
      .video-js.vjs-theme-twitch .vjs-big-play-button {
        background-color: var(--vjs-theme-twitch--primary) !important;
        border-color: var(--vjs-theme-twitch--primary) !important;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        line-height: 60px;
        margin-top: -30px;
        margin-left: -30px;
      }
      
      .video-js.vjs-theme-twitch:hover .vjs-big-play-button,
      .video-js.vjs-theme-twitch .vjs-big-play-button:focus {
        background-color: #772ce8 !important;
        border-color: #772ce8 !important;
      }
      
      .video-js.vjs-theme-twitch .vjs-control-bar {
        background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.7));
        height: 45px;
      }
      
      .video-js.vjs-theme-twitch .vjs-play-control {
        font-size: 1.5em;
      }
      
      /* iOS Safari specific styles */
      .video-js.vjs-theme-twitch video::-webkit-media-controls {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Clean up on component unmount
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      // Cleanup socket listeners
      socket.off('incrementViewCountResponse');
      socket.off('getVideoViewCountResponse');
    };
  }, [videoUrl, numericVideoId, socket, totalDuration]);

  return (
    <div className="video-container" style={{ aspectRatio: '16/9' }}>
      <div data-vjs-player>
        <div ref={videoRef} className="w-full h-full" />
      </div>
    </div>
  );
}; 