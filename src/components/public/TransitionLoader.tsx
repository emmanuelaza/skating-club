'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export function TransitionLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When pathname changes, keep the loading state briefly then fade it out.
    // This creates a smooth minimum loading display so it doesn't just flash on fast navigations.
    const timer = setTimeout(() => {
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find the closest anchor tag
      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== 'A') {
        target = target.parentElement;
      }

      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Ignore external links, mailto, tel, hash anchors, target="_blank", or download links
      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        targetAttr === '_blank' ||
        target.hasAttribute('download')
      ) {
        return;
      }

      // Parse absolute URLs to determine if they are internal
      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(href, window.location.href);

        // Ignore same pathname transitions (e.g. only search params or hash changes)
        if (
          currentUrl.origin === targetUrl.origin &&
          currentUrl.pathname !== targetUrl.pathname
        ) {
          setLoading(true);
        }
      } catch (err) {
        // Fallback for relative paths: check if they look internal
        if (!href.startsWith('//') && !href.startsWith('http')) {
          setLoading(true);
        }
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="route-transition-loader"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0A0A0A]/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Premium minimal label */}
            <span className="font-display text-xs font-black uppercase tracking-[0.3em] text-[#F5F5F5]">
              Skating Club
            </span>
            {/* Grandes Paisas progress line */}
            <div className="relative h-[2px] w-[120px] overflow-hidden rounded-full bg-[#222222]">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8B5CF6] to-[#22D3EE]"
                style={{ boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)' }}
                initial={{ left: '-100%', width: '100%' }}
                animate={{ left: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 0.7,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
