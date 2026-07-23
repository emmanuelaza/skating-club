'use client';

import { useEffect, useRef } from 'react';
import type { Vector3 } from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

const COUNT = 60;
const MAX_LINES = 80;
const LINK_DISTANCE = 2.5;

interface Particle {
  pos: Vector3;
  vel: Vector3;
  orig: Vector3;
}

/** Campo de partículas con conexiones y repulsión del cursor. Solo desktop. */
export default function ParticleField({ className }: { className?: string }) {
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
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);

      // --- Partículas ---
      const particles: Particle[] = [];
      const pointPositions = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i += 1) {
        const pos = new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4,
        );
        const vel = new THREE.Vector3(
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.004,
        );
        particles.push({ pos, vel, orig: pos.clone() });
        pointPositions[i * 3] = pos.x;
        pointPositions[i * 3 + 1] = pos.y;
        pointPositions[i * 3 + 2] = pos.z;
      }

      const pointGeometry = new THREE.BufferGeometry();
      const pointAttribute = new THREE.BufferAttribute(pointPositions, 3);
      pointGeometry.setAttribute('position', pointAttribute);
      const pointMaterial = new THREE.PointsMaterial({
        color: 0x22d3ee,
        size: 0.05,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6,
      });
      const points = new THREE.Points(pointGeometry, pointMaterial);
      scene.add(points);

      // --- Líneas de conexión ---
      const linePositions = new Float32Array(MAX_LINES * 2 * 3);
      const lineColors = new Float32Array(MAX_LINES * 2 * 3);
      const lineGeometry = new THREE.BufferGeometry();
      const linePosAttr = new THREE.BufferAttribute(linePositions, 3);
      const lineColorAttr = new THREE.BufferAttribute(lineColors, 3);
      lineGeometry.setAttribute('position', linePosAttr);
      lineGeometry.setAttribute('color', lineColorAttr);
      const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.2,
      });
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      scene.add(lines);

      // --- Mouse (raytrace a z=0) ---
      const ndc = new THREE.Vector2(2, 2); // fuera de pantalla al inicio
      const raycaster = new THREE.Raycaster();
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const mouseWorld = new THREE.Vector3();
      const onMouseMove = (event: MouseEvent) => {
        ndc.x = (event.clientX / window.innerWidth) * 2 - 1;
        ndc.y = -((event.clientY / window.innerHeight) * 2 - 1);
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      const onResize = () => {
        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      const baseColor = new THREE.Color(0x22d3ee);
      const repel = new THREE.Vector3();

      let animId = 0;
      let lastTime = 0;
      const animate = (time: number) => {
        animId = requestAnimationFrame(animate);
        if (time - lastTime < 16) return; // ~60fps
        lastTime = time;

        const hasMouse = ndc.x >= -1 && ndc.x <= 1;
        if (hasMouse) {
          raycaster.setFromCamera(ndc, camera);
          raycaster.ray.intersectPlane(plane, mouseWorld);
        }

        for (let i = 0; i < COUNT; i += 1) {
          const p = particles[i];
          if (!p) continue;
          p.pos.add(p.vel);

          if (hasMouse) {
            repel.copy(p.pos).sub(mouseWorld);
            const dist = repel.length();
            if (dist < 1.5 && dist > 0) {
              p.vel.addScaledVector(repel.normalize(), 0.02);
            }
          }

          // Recuperación hacia la posición original + amortiguación.
          p.pos.x += (p.orig.x - p.pos.x) * 0.02;
          p.pos.y += (p.orig.y - p.pos.y) * 0.02;
          p.pos.z += (p.orig.z - p.pos.z) * 0.02;
          p.vel.multiplyScalar(0.96);

          // Rebote en los límites.
          if (Math.abs(p.pos.x) > 5) p.vel.x *= -1;
          if (Math.abs(p.pos.y) > 5) p.vel.y *= -1;
          if (Math.abs(p.pos.z) > 5) p.vel.z *= -1;

          pointPositions[i * 3] = p.pos.x;
          pointPositions[i * 3 + 1] = p.pos.y;
          pointPositions[i * 3 + 2] = p.pos.z;
        }
        pointAttribute.needsUpdate = true;

        // Conexiones.
        let lineCount = 0;
        for (let i = 0; i < COUNT && lineCount < MAX_LINES; i += 1) {
          const a = particles[i];
          if (!a) continue;
          for (let j = i + 1; j < COUNT && lineCount < MAX_LINES; j += 1) {
            const b = particles[j];
            if (!b) continue;
            const dist = a.pos.distanceTo(b.pos);
            if (dist >= LINK_DISTANCE) continue;
            const intensity = 1 - dist / LINK_DISTANCE;
            const base = lineCount * 6;
            linePositions[base] = a.pos.x;
            linePositions[base + 1] = a.pos.y;
            linePositions[base + 2] = a.pos.z;
            linePositions[base + 3] = b.pos.x;
            linePositions[base + 4] = b.pos.y;
            linePositions[base + 5] = b.pos.z;
            for (let k = 0; k < 2; k += 1) {
              const c = base + k * 3;
              lineColors[c] = baseColor.r * intensity;
              lineColors[c + 1] = baseColor.g * intensity;
              lineColors[c + 2] = baseColor.b * intensity;
            }
            lineCount += 1;
          }
        }
        lineGeometry.setDrawRange(0, lineCount * 2);
        linePosAttr.needsUpdate = true;
        lineColorAttr.needsUpdate = true;

        renderer.render(scene, camera);
      };
      animId = requestAnimationFrame(animate);

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        renderer.domElement.remove();
        pointGeometry.dispose();
        pointMaterial.dispose();
        lineGeometry.dispose();
        lineMaterial.dispose();
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
