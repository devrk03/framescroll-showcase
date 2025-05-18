"use client"; // This makes the whole component a client component

import React from "react";
import { ImageModalProvider } from "@/context/ImageModalContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ImageModalProvider>
      {children}
    </ImageModalProvider>
  );
}
