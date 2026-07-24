'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

const COUNT = 40;

/**
 * Sistema de partículas con Three.js puro (sin React Three Fiber). `three` se
 * importa dinámicamente dentro del efecto. No renderiza con reduced-motion.
 */
export default function FloatingParticles({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (reduced || !mount) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const THREE = await import('three');
      if (cancelled || !mount) return;

      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
      camera.position.z = 3;

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      mount.appendChild(renderer.domElement);

      const positions = new Float32Array(COUNT * 3);
      const velocities = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT * 3; i += 1) {
        positions[i] = (Math.random() - 0.5) * 8;
        velocities[i] = (Math.random() - 0.5) * 0.004;
      }

      const geometry = new THREE.BufferGeometry();
      const positionAttribute = new THREE.BufferAttribute(positions, 3);
      geometry.setAttribute('position', positionAttribute);

      const material = new THREE.PointsMaterial({
        color: 0x8b5cf6,
        size: 0.03,
        transparent: true,
        opacity: 0.4,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const onResize = () => {
        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      let animId = 0;
      let lastTime = 0;
      const animate = (time: number) => {
        animId = requestAnimationFrame(animate);
        if (time - lastTime < 16) return; // ~60fps
        lastTime = time;
        for (let i = 0; i < COUNT * 3; i += 1) {
          const velocity = velocities[i] ?? 0;
          const next = (positions[i] ?? 0) + velocity;
          positions[i] = next;
          if (Math.abs(next) > 4) velocities[i] = -velocity;
        }
        positionAttribute.needsUpdate = true;
        points.rotation.y += 0.0006;
        renderer.render(scene, camera);
      };
      animId = requestAnimationFrame(animate);

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        renderer.domElement.remove();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    };

    void init();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reduced]);

  return <div ref={mountRef} aria-hidden className={cn('size-full', className)} />;
}
