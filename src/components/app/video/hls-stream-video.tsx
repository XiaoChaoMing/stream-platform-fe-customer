import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Player from "video.js/dist/types/player";

interface HLSPlayerProps {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  startLevel?: number;
  abr?: boolean;
  bufferSize?: number;
}

interface QualityLevel {
  height: number;
  width: number;
  bitrate: number;
  name: string;
  index: number;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({
  src,
  controls = true,
  width = "100%",
  height = "auto",
  startLevel = -1,
  abr = true,
  bufferSize = 30
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<string>("Auto");
  const [isBuffering, setIsBuffering] = useState(false);
  const [stats, setStats] = useState<{ bitrate: number; buffered: number }>({
    bitrate: 0,
    buffered: 0,
  });

  useEffect(() => {
    // Initialize video.js player
    if (!videoRef.current) return;

    // Create videojs player with custom CSS to hide progress bar
    const videoJsOptions = {
      autoplay: true,
      muted: true,
      controls: controls,
      responsive: true,
      fluid: true,
      html5: {
        vhs: {
          overrideNative: true
        }
      }
    };

    // Initialize the player
    const player = videojs(videoRef.current, videoJsOptions);
    playerRef.current = player;

    // Hide progress bar with CSS
    const style = document.createElement('style');
    style.textContent = `
      .video-js .vjs-progress-control {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Handle HLS
    if (Hls.isSupported()) {
      // Clean up previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        capLevelToPlayerSize: true,
        autoStartLoad: true,
        startLevel: startLevel,
        abrEwmaDefaultEstimate: 500000,
        abrEwmaFastLive: 3.0,
        abrEwmaSlowLive: 9.0,
        abrBandWidthFactor: 0.95,
        abrBandWidthUpFactor: 0.7,
        abrMaxWithRealBitrate: true,
        maxBufferLength: bufferSize,
        maxMaxBufferLength: bufferSize * 1.5,
        enableWorker: true,
        lowLatencyMode: false,
        fragLoadingTimeOut: 20000,
        manifestLoadingTimeOut: 10000,
      });
      
      hlsRef.current = hls;
      hls.loadSource(src);
      
      // Attach hls to video element
      const videoElement = player.tech({ IWillNotUseThisInPlugins: true }).el() as HTMLVideoElement;
      hls.attachMedia(videoElement);

      // Set ABR mode based on prop
      if (!abr && startLevel >= 0) {
        hls.startLevel = startLevel;
      } else {
        hls.startLevel = -1; 
      }
      
      // Handle manifest parsing and quality levels
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const levels = data.levels.map((level, index) => ({
          height: level.height,
          width: level.width,
          bitrate: level.bitrate,
          name: level.height ? `${level.height}p` : `Level ${index}`,
          index
        }));

        // Sort levels by resolution (height) in descending order
        levels.sort((a, b) => b.height - a.height);
        setQualityLevels(levels);
        
        if (!abr && startLevel >= 0 && startLevel < levels.length) {
          hls.currentLevel = startLevel;
        }
      });
      
      // Track quality level changes
      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = data.level;
        const currentLevel = hlsRef.current?.levels[level];
        const levelName = currentLevel?.height ? `${currentLevel.height}p` : "Auto";
        setCurrentQuality(level === -1 ? "Auto" : levelName);
      });
      
      // Track buffering states
      hls.on(Hls.Events.BUFFER_CREATED, () => {
        setIsBuffering(true);
      });
      
      hls.on(Hls.Events.BUFFER_APPENDED, () => {
        setIsBuffering(false);
      });
      
      // Track fragmentation loading
      hls.on(Hls.Events.FRAG_BUFFERED, (event, data) => {
        setStats({
          bitrate: data.stats.bwEstimate,
          buffered: videoElement.buffered.length || 0,
        });
      });
      
      // Handle errors with retry logic
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Network error, trying to recover", data);
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Media error, trying to recover", data);
              hls.recoverMediaError();
              break;
            default:
              console.error("Fatal error, cannot recover", data);
              hls.destroy();
              break;
          }
        }
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari which has native HLS support
      player.src(src);
    } else {
      console.error("HLS is not supported in this browser.");
    }

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      
      // Remove custom style
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [src, startLevel, abr, bufferSize, controls]);

  const handleQualityChange = (levelIndex: number) => {
    if (!hlsRef.current) return;

    if (levelIndex === -1) {
      // Auto quality - set nextLevel to -1 and currentLevel to -1
      hlsRef.current.nextLevel = -1;
      hlsRef.current.currentLevel = -1;
      setCurrentQuality("Auto");
    } else {
      // Manual quality selection - directly set currentLevel
      hlsRef.current.nextLevel = levelIndex;
      hlsRef.current.currentLevel = levelIndex;
      setCurrentQuality(qualityLevels.find(q => q.index === levelIndex)?.name || "Unknown");
    }
    
    setShowQualityMenu(false);
  };
  
  // Force ABR to re-evaluate based on current conditions
  const forceABRUpdate = () => {
    if (!hlsRef.current) return;
    
    // Force a level change to trigger ABR re-evaluation
    const currentLevel = hlsRef.current.currentLevel;
    hlsRef.current.nextLevel = 0; // Force to lowest level
    setTimeout(() => {
      if (hlsRef.current) {
        hlsRef.current.nextLevel = -1; // Back to auto
      }
    }, 200);
  };

  return (
    <div className="relative w-full">
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          playsInline
          style={{ backgroundColor: "#000", borderRadius: "8px" }}
        />
      </div>
      
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="loading-spinner w-10 h-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {qualityLevels.length > 0 && (
        <div className="absolute bottom-12 right-4 flex flex-col items-end">
          <button 
            onClick={() => setShowQualityMenu(!showQualityMenu)}
            className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            {currentQuality} {abr && currentQuality === "Auto" && <span className="ml-1 text-xs">ABR</span>}
          </button>
          
          {showQualityMenu && (
            <div className="bg-black bg-opacity-80 rounded-md mt-1 overflow-hidden">
              <ul className="text-white text-sm">
                <li 
                  className={`px-4 py-2 hover:bg-gray-700 cursor-pointer ${currentQuality === "Auto" ? "bg-gray-700" : ""}`}
                  onClick={() => handleQualityChange(-1)}
                >
                  Auto {abr && <span className="ml-1 text-xs opacity-70">(ABR)</span>}
                </li>
                {qualityLevels.map((quality) => (
                  <li 
                    key={quality.index}
                    className={`px-4 py-2 hover:bg-gray-700 cursor-pointer ${currentQuality === quality.name ? "bg-gray-700" : ""}`}
                    onClick={() => handleQualityChange(quality.index)}
                  >
                    {quality.name} {quality.bitrate ? <span className="text-xs ml-1 opacity-70">({Math.round(quality.bitrate/1000)} Kbps)</span> : null}
                  </li>
                ))}
                {abr && currentQuality === "Auto" && (
                  <li 
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer border-t border-gray-600"
                    onClick={forceABRUpdate}
                  >
                    Force ABR Update
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HLSPlayer;
