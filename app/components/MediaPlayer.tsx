"use client";
import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface MediaPlayerProps {
  src: string;
  poster: string;
  title: string;
  subtitle?: string; 
  aspectRatio?: string; // Allows us to override the default 16/9
}

export default function MediaPlayer({ 
  src, 
  poster, 
  title, 
  subtitle = "Video", 
  aspectRatio = "aspect-video" 
}: MediaPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        // .play() returns a Promise. We MUST catch it to prevent Next.js from crashing!
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Video playback failed:", error);
              // Reset the UI state if the browser rejects playback
              setIsPlaying(false); 
            });
        }
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={`relative w-full ${aspectRatio} bg-[#242424] rounded-sm overflow-hidden group border border-white/10 shadow-2xl`}>
      
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        autoPlay={true}
        className="w-full h-full object-cover"
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
            console.error("Video failed to load. The URL might be broken or blocked by CORS.", e);
            setIsPlaying(false);
        }}
      />

      {/* Custom Marque-Branded Overlay & Controls */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
        
        {/* Dark gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none transition-colors duration-300" />

        {/* Center Play Button */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-copper/90 hover:bg-copper rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-xl z-10"
            aria-label="Play Media"
          >
            <Play size={22} className="text-white fill-current ml-1" />
          </button>
        )}

        {/* Bottom Text & Control Bar */}
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
          
          <div className="text-left max-w-[70%]">
            {subtitle && (
              <p className="text-white/50 text-[10px] font-bold tracking-widest uppercase mb-1">
                {subtitle}
              </p>
            )}
            <p className="text-white text-sm font-medium tracking-wide line-clamp-1">
              {title}
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <button onClick={togglePlay} className="text-white hover:text-copper transition-colors">
              {isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current" />}
            </button>
            <button onClick={toggleMute} className="text-white hover:text-copper transition-colors">
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}