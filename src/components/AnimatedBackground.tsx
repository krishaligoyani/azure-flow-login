import { useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const LINE_COUNT = 80;
const POINTS_PER_LINE = 60;

function AnimatedLines({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  const lines = useMemo(() => {
    const arr: {
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
      speed: number;
      phase: number;
      baseY: number;
      baseZ: number;
      isLight: boolean;
    }[] = [];

    for (let i = 0; i < LINE_COUNT; i++) {
      const isLight = i % 3 !== 0;
      const points: THREE.Vector3[] = [];
      const baseY = (Math.random() - 0.5) * 12;
      const baseZ = (Math.random() - 0.5) * 10 - 3;

      for (let j = 0; j < POINTS_PER_LINE; j++) {
        const x = (j / (POINTS_PER_LINE - 1) - 0.5) * 20;
        points.push(new THREE.Vector3(x, baseY, baseZ));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      let color: THREE.Color;
      let opacity: number;
      if (isLight) {
        const lightColors = [
          new THREE.Color(0x00d4ff), // cyan
          new THREE.Color(0x4da8ff), // neon blue
          new THREE.Color(0x88ccff), // soft blue
          new THREE.Color(0xbbddff), // soft white blue
        ];
        color = lightColors[Math.floor(Math.random() * lightColors.length)];
        opacity = 0.15 + Math.random() * 0.35;
      } else {
        const darkColors = [
          new THREE.Color(0x0a1628), // deep navy
          new THREE.Color(0x0d2f3f), // dark teal
          new THREE.Color(0x1a2a3a), // charcoal blue
          new THREE.Color(0x0e3355), // navy blue
        ];
        color = darkColors[Math.floor(Math.random() * darkColors.length)];
        opacity = 0.3 + Math.random() * 0.4;
      }

      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
      });

      arr.push({
        geometry,
        material,
        speed: (isLight ? 0.3 : 0.15) + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        baseY,
        baseZ,
        isLight,
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mx = mouse.current.x;
    const my = mouse.current.y;

    lines.forEach((line, i) => {
      const positions = line.geometry.attributes.position as THREE.BufferAttribute;
      const arr = positions.array as Float32Array;

      for (let j = 0; j < POINTS_PER_LINE; j++) {
        const idx = j * 3;
        const x = arr[idx];
        const wave1 = Math.sin(x * 0.3 + t * line.speed + line.phase) * 0.8;
        const wave2 = Math.cos(x * 0.15 + t * line.speed * 0.7 + line.phase * 1.3) * 0.5;
        arr[idx + 1] = line.baseY + wave1 + wave2;
        arr[idx + 2] = line.baseZ + Math.sin(x * 0.2 + t * line.speed * 0.5) * 0.6;
      }
      positions.needsUpdate = true;

      // Fade in/out based on position
      const fadeVal = 0.5 + 0.5 * Math.sin(t * 0.3 + line.phase);
      line.material.opacity = (line.isLight ? 0.15 + fadeVal * 0.35 : 0.2 + fadeVal * 0.3);
    });

    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, my * 0.15, 0.02);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mx * 0.15, 0.02);
    }
  });

  const lineObjects = useMemo(() => {
    return lines.map((l) => {
      const obj = new THREE.Line(l.geometry, l.material);
      return obj;
    });
  }, [lines]);

  return (
    <group ref={groupRef}>
      {lineObjects.map((obj, i) => (
        <primitive key={i} object={obj} />
      ))}
    </group>
  );
}

export default function AnimatedBackground() {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="fixed inset-0 -z-10" style={{
      background: "linear-gradient(135deg, hsl(210 50% 12%), hsl(200 60% 20%), hsl(195 70% 15%))"
    }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <AnimatedLines mouse={mouse} />
      </Canvas>
    </div>
  );
}
