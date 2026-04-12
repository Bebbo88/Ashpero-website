import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

export default function VideoCard({ item, index }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index !== undefined ? index * 0.1 : 0,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group w-full h-full flex flex-col bg-bg-primary rounded-xl md:rounded-[24px] overflow-hidden shadow-card border border-border-color hover:shadow-[var(--ds-shadow-brand-primary)] hover:border-brand-mint/50 transition-all duration-500"
    >
      <div className="relative w-full flex-1 overflow-hidden shrink-0 bg-gray-100">
        <video
          ref={videoRef}
          src={item.video?.src || item.video}
          playsInline
          loop
          preload="metadata"
          controls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div 
          className={`absolute inset-0 transition-opacity duration-500 flex items-center justify-center cursor-pointer ${
            isPlaying ? "opacity-0 pointer-events-none" : "bg-black/10 group-hover:bg-black/20"
          }`}
          onClick={togglePlay}
        >
          <button
            className="w-14 h-14 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-brand-mint shadow-xl transform transition-transform hover:scale-110 cursor-pointer"
            aria-label="Play video"
          >
            <Play className="w-6 h-6 md:w-8 md:h-8 fill-current ml-1" />
          </button>
        </div>

        {item.badge ? (
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
            <span className="inline-block bg-brand-mint/90 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
              {item.badge}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col p-6 md:p-8 bg-bg-primary shrink-0 relative z-10">
        <h3 className="font-playfair text-2xl md:text-3xl font-bold text-text-primary mb-3 group-hover:text-brand-mint transition-colors duration-300">
          {item.video?.title || item.title}
        </h3>
        {item.video?.description || item.description ? (
          <p className="font-montserrat text-text-secondary text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3">
            {item.video?.description || item.description}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}
