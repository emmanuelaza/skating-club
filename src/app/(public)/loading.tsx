'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0A0A]">
      {/* Container for animations */}
      <div className="relative flex flex-col items-center gap-6">
        
        {/* Sleek Minimalist Ring Loader (Linear/Vercel-inspired) */}
        <div className="relative size-12">
          {/* Static outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[#222222]" />
          
          {/* Animated accent ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00E5A0]"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              ease: 'linear',
            }}
          />
        </div>

        {/* Brand Text Pulse */}
        <motion.span
          className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-[#888888]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          }}
        >
          Cargando Club
        </motion.span>
      </div>
    </div>
  );
}
