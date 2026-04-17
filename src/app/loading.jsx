"use client";

import React from "react";
import Image from "@/components/ui/AppImage";
import { motion } from "framer-motion";
import Loader from "@/components/loader/loader";

export default function Loading() {
  return <Loader fullScreen />;
}
