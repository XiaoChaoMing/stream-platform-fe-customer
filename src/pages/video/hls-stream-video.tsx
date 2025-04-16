import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HLSPlayerProps {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({
  src,
  controls = true,
  width = "100%",
  height = "auto"
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS support
      video.src = src;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    } else {
      console.error("HLS is not supported in this browser.");
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay={true}
      muted
      controls={controls}
      width={width}
      height={height}
      style={{ backgroundColor: "#000", borderRadius: "8px" }}
    />
  );
};

export default HLSPlayer;
