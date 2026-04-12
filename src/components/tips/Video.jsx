import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";

const LAZY_LOAD_ROOT_MARGIN = "320px 0px";
const IN_VIEW_THRESHOLD = 0.2;

function VideoCard({ item, index }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const playRequestedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  const videoSource = item?.video?.src || item?.video || "";
  const posterSource = item?.video?.poster || item?.cards?.[0]?.image || "";

  useEffect(() => {
    setIsPlaying(false);
    setShouldLoadVideo(false);
    playRequestedRef.current = false;
  }, [videoSource]);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) {
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoadVideo(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: LAZY_LOAD_ROOT_MARGIN,
        threshold: IN_VIEW_THRESHOLD,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [videoSource]);

  useEffect(() => {
    const target = containerRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting && videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      },
      {
        root: null,
        threshold: 0.1,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  const togglePlay = useCallback(async () => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    if (!shouldLoadVideo) {
      playRequestedRef.current = true;
      setShouldLoadVideo(true);
      return;
    }

    if (isPlaying) {
      videoElement.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await videoElement.play();
      setIsPlaying(true);
    } catch (_error) {
      setIsPlaying(false);
    }
  }, [isPlaying, shouldLoadVideo]);

  const handleCanPlay = useCallback(async () => {
    if (!playRequestedRef.current || !videoRef.current) {
      return;
    }

    playRequestedRef.current = false;

    try {
      await videoRef.current.play();
      setIsPlaying(true);
    } catch (_error) {
      setIsPlaying(false);
    }
  }, []);

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
      <div className="relative w-full flex-1 overflow-hidden shrink-0 bg-gray-100">
        <video
          ref={videoRef}
          src={shouldLoadVideo ? videoSource : undefined}
          poster={posterSource || undefined}
          playsInline
          preload={shouldLoadVideo ? "metadata" : "none"}
          controls={shouldLoadVideo}
          onCanPlay={handleCanPlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <button
          type="button"
          className={`absolute inset-0 z-10 transition-opacity duration-300 flex items-center justify-center cursor-pointer ${
            isPlaying ? "opacity-0 pointer-events-none" : "bg-black/15 group-hover:bg-black/25"
          }`}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          <span className="w-14 h-14 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-brand-mint shadow-xl transform transition-transform hover:scale-110">
            {isPlaying ? (
              <Pause className="w-6 h-6 md:w-8 md:h-8 fill-current" />
            ) : (
              <Play className="w-6 h-6 md:w-8 md:h-8 fill-current ml-1" />
            )}
          </span>
        </button>

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
  return prevProps.item === nextProps.item && prevProps.index === nextProps.index;
}

export default memo(VideoCard, areEqual);
