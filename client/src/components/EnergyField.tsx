/**
 * Crimson Reliquary style reminder: the WebGL field is a living sealed mechanism.
 * It reacts to pointer inertia, scroll travel, and scroll velocity without obscuring
 * the supplied MK hero artwork or running on reduced-motion devices.
 */
import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

type EnergyFieldProps = {
  scrollProgress: MotionValue<number>;
  scrollVelocity: MotionValue<number>;
};

export default function EnergyField({ scrollProgress, scrollVelocity }: EnergyFieldProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 0, 10);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const field = new THREE.Group();
    field.position.set(1.95, -0.2, -1.1);
    scene.add(field);

    const rings: THREE.Mesh[] = [];
    const ringSpecs = [
      { radius: 2.85, tube: 0.018, color: 0xd82b36, rotation: [0.88, -0.36, 0.44] },
      { radius: 2.2, tube: 0.012, color: 0xf3eee9, rotation: [1.55, 0.24, -0.6] },
      { radius: 1.5, tube: 0.024, color: 0xd82b36, rotation: [0.22, 0.85, 0.15] },
    ];
    ringSpecs.forEach((spec) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(spec.radius, spec.tube, 10, 120), new THREE.MeshBasicMaterial({ color: spec.color, transparent: true, opacity: spec.color === 0xd82b36 ? 0.64 : 0.32 }));
      ring.rotation.set(spec.rotation[0], spec.rotation[1], spec.rotation[2]);
      field.add(ring);
      rings.push(ring);
    });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.68, 2), new THREE.MeshBasicMaterial({ color: 0xd82b36, wireframe: true, transparent: true, opacity: 0.46 }));
    field.add(core);

    const count = 220;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = 1.2 + Math.random() * 3.25;
      const angle = Math.random() * Math.PI * 2;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 4.1;
      positions[index * 3 + 2] = Math.sin(angle) * radius * 0.5;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: 0xf5b1ad, size: 0.026, transparent: true, opacity: 0.74, depthWrite: false });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    field.add(particles);

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 1.15;
      pointerTarget.y = (event.clientY / window.innerHeight - 0.5) * 0.8;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const clock = new THREE.Clock();
    let animationFrame = 0;
    const render = () => {
      const elapsed = clock.getElapsedTime();
      const progress = scrollProgress.get();
      const velocity = THREE.MathUtils.clamp(scrollVelocity.get() * 0.00022, -0.42, 0.42);
      pointer.lerp(pointerTarget, 0.035);
      const targetY = pointer.x * 0.28 + progress * 1.8 + velocity;
      const targetX = -pointer.y * 0.18 + progress * 0.44;
      field.rotation.y += (targetY - field.rotation.y) * 0.026;
      field.rotation.x += (targetX - field.rotation.x) * 0.02;
      field.rotation.z += (velocity * 0.55 - field.rotation.z) * 0.018;
      field.position.y += (-0.2 + Math.sin(elapsed * 0.82) * 0.13 - progress * 1.25 - field.position.y) * 0.026;
      field.position.z += (-1.1 - progress * 2.9 - Math.abs(velocity) * 1.5 - field.position.z) * 0.032;
      camera.position.z += (10 - progress * 2.2 - Math.abs(velocity) * 0.65 - camera.position.z) * 0.035;
      rings[0].rotation.z += 0.0024 + velocity * 0.012;
      rings[1].rotation.x -= 0.0017 - velocity * 0.009;
      rings[2].rotation.y += 0.0032 + velocity * 0.014;
      core.rotation.x += 0.006 + velocity * 0.018;
      core.rotation.y -= 0.004 - velocity * 0.012;
      particles.rotation.y -= 0.0008 + velocity * 0.002;
      particleMaterial.size = 0.026 + Math.abs(velocity) * 0.032;
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", onPointerMove);
      observer.disconnect();
      particleGeometry.dispose(); particleMaterial.dispose();
      rings.forEach((ring) => { ring.geometry.dispose(); (ring.material as THREE.Material).dispose(); });
      core.geometry.dispose(); (core.material as THREE.Material).dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [scrollProgress, scrollVelocity]);

  return <div ref={mountRef} className="hero-energy-field" aria-hidden="true" />;
}
