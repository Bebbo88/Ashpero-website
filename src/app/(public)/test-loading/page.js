"use client";

import Loading from "@/app/loading";

export default function TestLoadingPage() {
  return (
    <>
      {/* 
        This page simply renders the global Loading component permanently
        so you can inspect the animations.
      */}
      <Loading />
    </>
  );
}
