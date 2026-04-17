"use client";

import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Image Skeleton */}
      <Skeleton className="w-full aspect-[4/5] rounded-2xl" />

      {/* Info Skeleton */}
      <div className="flex flex-col gap-2 px-1 pb-2">
        {/* Category */}
        <Skeleton className="h-3 w-[30%] rounded-md" />

        {/* Title */}
        <Skeleton className="h-5 w-[85%] rounded-md" />

        {/* Price Row */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-[25%] rounded-md" />
          <Skeleton className="h-3 w-[20%] rounded-md" />
        </div>
      </div>
    </div>
  );
}
