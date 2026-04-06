import React from "react";
import { PackageOpen } from "lucide-react";
import styles from "@/animations/EmptyState.animations.module.css";
import { useLanguage } from "@/hooks/useLanguage";

export default function EmptyState({ 
  icon: Icon = PackageOpen,
  title, 
  description,
  actionButton = null,
  className = ""
}) {
  const { t } = useLanguage();
  
  const displayTitle = title || t("EmptyState.title");
  const displayDescription = description || t("EmptyState.description");
  return (
    <div className={`w-full flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center ${styles.root} ${className}`}>
      <div className={`w-20 h-20 md:w-24 md:h-24 mb-6 rounded-full bg-brand-creme/50 dark:bg-brand-dark/30 flex items-center justify-center text-brand-orange shadow-sm ${styles.iconWrapper}`}>
        <Icon className="w-10 h-10 md:w-12 md:h-12 opacity-80" strokeWidth={1.5} />
      </div>
      
      <h3 className="font-playfair text-2xl md:text-3xl font-medium text-text-primary mb-3 tracking-wide">
        {displayTitle}
      </h3>
      
      <p className="text-sm md:text-base text-text-secondary max-w-md mx-auto leading-relaxed mb-8">
        {displayDescription}
      </p>

      {actionButton && (
        <div className="mt-2">
          {actionButton}
        </div>
      )}
    </div>
  );
}
