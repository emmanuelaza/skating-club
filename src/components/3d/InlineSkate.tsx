'use client';

import { useEffect, useRef } from 'react';
import type { BufferGeometry, Material, Mesh } from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

/**
 * Patín inline construido íntegramente con geometrías primitivas de Three.js.
 * Animación de ensamblado con GSAP (import dinámico) e interacciones: parallax
 * con el mouse, ruedas girando (aceleran al hover/scroll), click para spin y
 * flotación constante. Three.js y GSAP se importan dentro del efecto.
 */
export default function InlineSkate({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const THREE = await import('three');
      if (cancelled || !mount) return;

      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.z = 3.5;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(width, height);
      mount.appendChild(renderer.domElement);

      const geometries: BufferGeometry[] = [];
      const materials: Material[] = [];
      const track = <T extends BufferGeometry>(geo: T): T => {
        geometries.push(geo);
        return geo;
      };
      const trackMat = <T extends Material>(mat: T): T => {
        materials.push(mat);
        return mat;
      };

      // --- Materiales ---
      const bootMaterial = trackMat(
        new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.3, roughness: 0.7 }),
      );
      const frameMaterial = trackMat(
        new THREE.MeshStandardMaterial({ color: 0x2a2a3a, metalness: 0.8, roughness: 0.2 }),
      );
      const wheelMaterial = trackMat(
        new THREE.MeshStandardMaterial({ color: 0x0d0d1a, metalness: 0.1, roughness: 0.9 }),
      );
      const accentMaterial = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x8b5cf6,
          emissive: 0x8b5cf6,
          emissiveIntensity: 0.4,
          metalness: 0.5,
          roughness: 0.3,
        }),
      );
      const brakeMaterial = trackMat(
        new THREE.MeshStandardMaterial({ color: 0x14141f, metalness: 0.2, roughness: 0.8 }),
      );
      const stripeMaterial = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x8b5cf6,
          emissive: 0x8b5cf6,
          emissiveIntensity: 0.3,
        }),
      );

      // --- Bota ---
      const boot = new THREE.Group();
      const bootLower = new THREE.Mesh(track(new THREE.BoxGeometry(0.28, 0.22, 0.7)), bootMaterial);
      const bootUpper = new THREE.Mesh(track(new THREE.BoxGeometry(0.22, 0.35, 0.55)), bootMaterial);
      bootUpper.position.y = 0.27;
      const tongue = new THREE.Mesh(track(new THREE.BoxGeometry(0.15, 0.2, 0.08)), accentMaterial);
      tongue.position.set(0, 0.25, 0.3);
      const stripe = new THREE.Mesh(track(new THREE.BoxGeometry(0.002, 0.25, 0.6)), stripeMaterial);
      stripe.position.set(0.14, 0.15, 0);
      boot.add(bootLower, bootUpper, tongue, stripe);

      // --- Chasis + ruedas ---
      const frame = new THREE.Mesh(track(new THREE.BoxGeometry(0.12, 0.06, 0.85)), frameMaterial);
      frame.position.y = -0.15;

      const wheelGeometry = track(new THREE.CylinderGeometry(0.12, 0.12, 0.07, 32));
      const wheelPositions = [-0.32, -0.11, 0.11, 0.32];
      const wheels: Mesh[] = [];
      wheelPositions.forEach((z) => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(0, -0.22, z);
        wheels.push(wheel);
        frame.add(wheel);
      });

      const brake = new THREE.Mesh(track(new THREE.BoxGeometry(0.1, 0.07, 0.1)), brakeMaterial);
      brake.position.set(0, -0.19, -0.38);
      frame.add(brake);

      const skate = new THREE.Group();
      skate.add(boot, frame);
      skate.position.set(0, 0, 0);
      skate.rotation.set(0.1, -0.4, 0.05);
      skate.scale.setScalar(1.8);
      scene.add(skate);

      // --- Luces ---
      scene.add(new THREE.AmbientLight(0xffffff, 0.3));
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
      keyLight.position.set(-2, 3, 2);
      scene.add(keyLight);
      const accentLight = new THREE.PointLight(0x22d3ee, 2, 5);
      accentLight.position.set(1, -1, 1);
      scene.add(accentLight);
      const rimLight = new THREE.DirectionalLight(0x22d3ee, 0.5);
      rimLight.position.set(2, 1, -2);
      scene.add(rimLight);
      const groundLight = new THREE.PointLight(0x4444aa, 1, 3);
      groundLight.position.set(0, -1, 0);
      scene.add(groundLight);

      const onResize = () => {
        const w = mount.clientWidth || 1;
        const h = mount.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      // Reduced motion: modelo estático, un solo render, sin animación.
      if (reduced) {
        renderer.render(scene, camera);
        cleanup = () => {
          window.removeEventListener('resize', onResize);
          renderer.domElement.remove();
          geometries.forEach((geo) => geo.dispose());
          materials.forEach((mat) => mat.dispose());
          renderer.dispose();
        };
        return;
      }

      const { gsap } = await import('gsap');
      if (cancelled) {
        window.removeEventListener('resize', onResize);
        renderer.domElement.remove();
        geometries.forEach((geo) => geo.dispose());
        materials.forEach((mat) => mat.dispose());
        renderer.dispose();
        return;
      }

      // --- Interacción (estado) ---
      const mouseTilt = { x: 0, y: 0 };
      const spinState = { value: 0 };
      const wheelState = { speed: 0.008 };
      let scrollTilt = 0;
      let scrollVelocity = 0;
      let currentRotX = 0.1;
      let currentRotY = -0.4;

      const canvas = renderer.domElement;

      const onMouseMove = (event: MouseEvent) => {
        mouseTilt.x = (event.clientY / window.innerHeight - 0.5) * 0.3;
        mouseTilt.y = (event.clientX / window.innerWidth - 0.5) * 0.4;
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      const onScroll = () => {
        scrollTilt = (window.scrollY / window.innerHeight) * 0.3;
        scrollVelocity = 0.05;
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      const onClick = () => {
        gsap.to(spinState, { value: spinState.value + Math.PI * 2, duration: 0.8, ease: 'power2.inOut' });
      };
      canvas.addEventListener('click', onClick);

      const onEnter = () => {
        gsap.to(wheelState, { speed: 0.06, duration: 0.3 });
      };
      const onLeave = () => {
        gsap.to(wheelState, { speed: 0.008, duration: 0.5 });
      };
      canvas.addEventListener('mouseenter', onEnter);
      canvas.addEventListener('mouseleave', onLeave);

      // --- Timeline de ensamblado ---
      const tl = gsap.timeline({ delay: 0.5 });
      tl.from(boot.position, { y: 3, duration: 0.8, ease: 'power3.out' });
      tl.from(frame.position, { y: -3, duration: 0.6, ease: 'power3.out' }, '-=0.4');
      wheels.forEach((wheel, i) => {
        tl.from(
          wheel.position,
          { x: i % 2 === 0 ? -3 : 3, duration: 0.4, ease: 'back.out(1.7)' },
          `-=0.${3 - i}`,
        );
      });
      tl.from(brake.position, { z: -2, duration: 0.3, ease: 'power2.out' }, '-=0.1');
      tl.to(skate.scale, { x: 1.85, y: 1.85, z: 1.85, duration: 0.2, yoyo: true, repeat: 1 });

      const clock = new THREE.Clock();
      let animId = 0;
      let lastTime = 0;
      const animate = (time: number) => {
        animId = requestAnimationFrame(animate);
        if (time - lastTime < 16) return; // ~60fps
        lastTime = time;

        // Flotación constante.
        skate.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.05;

        // Parallax suave (mouse + scroll).
        const targetRotX = 0.1 + mouseTilt.x + scrollTilt;
        const targetRotY = -0.4 + mouseTilt.y;
        currentRotX += (targetRotX - currentRotX) * 0.04;
        currentRotY += (targetRotY - currentRotY) * 0.04;
        skate.rotation.x = currentRotX;
        skate.rotation.y = currentRotY + spinState.value;

        // Ruedas girando (aceleran con scroll/hover).
        scrollVelocity *= 0.95;
        const speed = wheelState.speed + scrollVelocity;
        wheels.forEach((wheel) => {
          wheel.rotation.y += speed;
        });

        renderer.render(scene, camera);
      };
      animId = requestAnimationFrame(animate);

      cleanup = () => {
        cancelAnimationFrame(animId);
        tl.kill();
        gsap.killTweensOf([spinState, wheelState, skate.scale]);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
        canvas.removeEventListener('click', onClick);
        canvas.removeEventListener('mouseenter', onEnter);
        canvas.removeEventListener('mouseleave', onLeave);
        renderer.domElement.remove();
        geometries.forEach((geo) => geo.dispose());
        materials.forEach((mat) => mat.dispose());
        renderer.dispose();
      };
    };

    void init();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reduced]);

  return <div ref={mountRef} className={cn('size-full', className)} />;
}
