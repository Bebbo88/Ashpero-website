"use client";

import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Image Skeleton */}
      <Skeleton className="w-full aspect-[4/5] rounded-2xl" />
      
      {/* Info Skeleton */}
      <div className="flex flex-col gap-2 px-1 pb-2">
        {/* Category */}
        <Skeleton height={12} width="30%" className="rounded-md" />
        
        {/* Title */}
        <Skeleton height={20} width="85%" className="rounded-md" />
        
        {/* Price Row */}
        <div className="flex items-center gap-3">
          <Skeleton height={18} width="25%" className="rounded-md" />
          <Skeleton height={14} width="20%" className="rounded-md" />
        </div>
      </div>
    </div>
  );
}
