import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const CARD_IMAGE_SIZES = "(max-width: 1024px) 100vw, 34vw";

export default function SmallCard({ item, onClick, imageLoading = "lazy", index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index !== undefined ? index * 0.1 : 0,
        duration: 0.5,
        ease: "easeOut",
      }}
      onClick={onClick}
      className="relative flex flex-col bg-bg-primary w-full rounded-xl md:rounded-[24px] overflow-hidden shadow-card border border-border-color group cursor-pointer hover:shadow-[var(--ds-shadow-brand-primary)] hover:-translate-y-1 transition-all duration-500 flex-1 h-full hover:border-brand-mint/50"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
      <div className="relative w-full flex-1 min-h-[160px] bg-gray-100 overflow-hidden shrink-0 z-10">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes={CARD_IMAGE_SIZES}
          loading={imageLoading}
          className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
      </div>
      <div className="flex flex-col p-4 md:p-6 md:px-8 bg-bg-primary shrink-0 relative z-10">
        <h4 className="font-playfair text-lg md:text-xl font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors duration-300">
          {item.title}
        </h4>
        <p className="font-montserrat text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-3">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
