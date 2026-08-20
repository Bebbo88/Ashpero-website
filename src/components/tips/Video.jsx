import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Image from "@/components/ui/AppImage";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

const LAZY_LOAD_ROOT_MARGIN = "320px 0px";
const IN_VIEW_THRESHOLD = 0.2;

function VideoCard({ item, index }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const rawVideoSource = item?.video?.src || item?.video || "";
  const posterSource = item?.video?.poster || item?.cards?.[0]?.image || "";

  const isImageMedia = React.useMemo(() => {
    if (!rawVideoSource || typeof rawVideoSource !== "string") return false;
    return (
      /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?.*)?$/i.test(rawVideoSource) ||
      rawVideoSource.includes("/image/upload/")
    );
  }, [rawVideoSource]);

  const videoSource = rawVideoSource;

  const togglePlay = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      try {
        await videoElement.play();
      } catch (err) {
        console.error("Video play failed:", err);
      }
    }
  }, [isPlaying]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        delay: index !== undefined ? index * 0.08 : 0,
        duration: 0.45,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group w-full h-full flex flex-col bg-bg-primary rounded-xl md:rounded-[24px] overflow-hidden shadow-card border border-border-color hover:shadow-[var(--ds-shadow-brand-primary)] hover:border-brand-mint/50 transition-all duration-500"
    >
      <div className="relative w-full flex-1 min-h-[250px] overflow-hidden shrink-0 bg-gray-100">
        {isImageMedia ? (
          <Image
            src={videoSource}
            alt={item.video?.title || item.title || "Media"}
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoSource}
              poster={posterSource || undefined}
              playsInline
              preload="none"
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              className="absolute inset-0 w-full h-full object-cover z-0"
            >
              <source src={videoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Custom Play Overlay - disappears when playing to allow native controls interaction */}
            {!isPlaying && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors duration-300 cursor-pointer"
                onClick={togglePlay}
              >
                <button
                  type="button"
                  className="w-14 h-14 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-brand-mint shadow-xl transform transition-transform hover:scale-110"
                  aria-label="Play video"
                >
                  <Play className="w-6 h-6 md:w-8 md:h-8 fill-current ml-1" />
                </button>
              </div>
            )}
          </>
        )}

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

function areEqual(prevProps, nextProps) {
  return (
    prevProps.item === nextProps.item && prevProps.index === nextProps.index
  );
}

export default memo(VideoCard, areEqual);
