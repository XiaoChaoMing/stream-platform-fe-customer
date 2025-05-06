import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  videoUrl: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize video.js player
    const videoElement = document.createElement("video-js");
    videoElement.classList.add('vjs-big-play-centered', 'vjs-theme-twitch');

    if (videoRef.current) {
      videoRef.current.innerHTML = '';
      videoRef.current.appendChild(videoElement);
    }

    // Video.js options
    const options = {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      aspectRatio: '16:9',
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
      sources: [
        {
          // We would typically use the real video URL. For demo, using a placeholder.
          // In a real implementation, this would be an HLS URL for clips
          src: videoUrl || 'https://stream.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/high.mp4',
          type: 'video/mp4'
        }
      ]
    };

    // Initialize player
    const player = videojs(videoElement, options, () => {
      console.log('Player is ready');
    });
    
    playerRef.current = player;

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
    };
  }, [videoUrl]);

  return (
    <div className="video-container" style={{ aspectRatio: '16/9' }}>
      <div data-vjs-player>
        <div ref={videoRef} className="w-full h-full" />
      </div>
    </div>
  );
}; 