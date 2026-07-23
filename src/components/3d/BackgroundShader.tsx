'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const GRID = 40; // 40x40 = 1600 puntos
const TOTAL = GRID * GRID;
const SPAN = 12;
const BASE_Y = -1.5;

/**
 * Fondo interactivo: rejilla 3D de puntos (InstancedMesh, 1 draw call) que
 * "respira" con olas concéntricas y reacciona al cursor — como el suelo de una
 * pista visto desde arriba. Three.js puro, import dinámico, solo desktop.
 */
export default function BackgroundShader() {
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

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0a0a0a, 0.06);

      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 4, 6);
      camera.lookAt(0, BASE_Y, 0);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      mount.appendChild(renderer.domElement);

      const geometry = new THREE.SphereGeometry(0.018, 4, 4);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mesh = new THREE.InstancedMesh(geometry, material, TOTAL);

      const dummy = new THREE.Object3D();
      const points: { x: number; z: number }[] = [];
      const colorOff = new THREE.Color(0x111111);
      const colorOn = new THREE.Color(0x22d3ee);
      const tmpColor = new THREE.Color();

      let i = 0;
      for (let row = 0; row < GRID; row += 1) {
        for (let col = 0; col < GRID; col += 1) {
          const x = (col / (GRID - 1) - 0.5) * SPAN;
          const z = (row / (GRID - 1) - 0.5) * SPAN;
          points.push({ x, z });
          dummy.position.set(x, BASE_Y, z);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
          mesh.setColorAt(i, colorOff);
          i += 1;
        }
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      scene.add(mesh);

      scene.add(new THREE.AmbientLight(0xffffff, 0.1));

      // --- Interacción ---
      let mouseX = 0;
      let mouseZ = 0;
      let mouseWaveRadius = 6;
      const onMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * SPAN;
        mouseZ = (event.clientY / window.innerHeight - 0.5) * 8;
        mouseWaveRadius = 0;
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      const onScroll = () => {
        const progress = window.scrollY / window.innerHeight;
        camera.position.y = 4 + progress * 2;
        camera.lookAt(0, BASE_Y, 0);
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      let waveRadius = 0;
      const waveSpeed = 0.04;
      let animId = 0;
      let lastTime = 0;
      const animate = (time: number) => {
        animId = requestAnimationFrame(animate);
        if (time - lastTime < 16) return; // ~60fps
        lastTime = time;

        waveRadius += waveSpeed;
        if (waveRadius > 10) waveRadius = 0;
        const wave2Radius = (waveRadius + 5) % 10;
        if (mouseWaveRadius < 6) mouseWaveRadius += 0.06;

        for (let idx = 0; idx < points.length; idx += 1) {
          const p = points[idx];
          if (!p) continue;

          const dist = Math.sqrt(p.x * p.x + p.z * p.z);
          const waveHeight = Math.max(0, 0.4 - Math.abs(dist - waveRadius) * 2);
          const waveHeight2 = Math.max(0, 0.2 - Math.abs(dist - wave2Radius) * 2);

          const dx = p.x - mouseX;
          const dz = p.z - mouseZ;
          const mouseDist = Math.sqrt(dx * dx + dz * dz);
          const mouseHeight = Math.max(0, 0.6 - Math.abs(mouseDist - mouseWaveRadius) * 3);

          const totalHeight = waveHeight + waveHeight2 + mouseHeight;

          dummy.position.set(p.x, BASE_Y + totalHeight, p.z);
          dummy.updateMatrix();
          mesh.setMatrixAt(idx, dummy.matrix);

          tmpColor.lerpColors(colorOff, colorOn, Math.min(1, totalHeight * 3));
          mesh.setColorAt(idx, tmpColor);
        }

        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

        renderer.render(scene, camera);
      };
      animId = requestAnimationFrame(animate);

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        renderer.domElement.remove();
        geometry.dispose();
        material.dispose();
        mesh.dispose();
        renderer.dispose();
      };
    };

    void init();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reduced]);

  return <div ref={mountRef} aria-hidden className="fixed inset-0 -z-10" />;
}
