'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import React, { useRef, useMemo, useEffect, useState, Suspense, Component, type ReactNode } from 'react';
import * as THREE from 'three';

/* ============================================================
   CONSTANTS
   ============================================================ */
const PARTICLE_COUNT = 2500;
const BG_COLOR = '#030014';
const CYAN = new THREE.Color('#00f0ff');
const PURPLE = new THREE.Color('#8b5cf6');
const AMBER = new THREE.Color('#f59e0b');
const WHITE = new THREE.Color('#ffffff');
const PALETTE = [CYAN, PURPLE, AMBER, WHITE];

/* ============================================================
   CUSTOM VERTEX/FRAGMENT SHADERS for the particle nebula
   ============================================================ */
const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAlpha;

  varying vec3 vColor;
  varying float vAlpha;

  uniform float uTime;
  uniform float uPixelRatio;

  void main() {
    vColor = aColor;
    vAlpha = aAlpha;

    vec3 pos = position;
    // Gentle undulation
    pos.x += sin(uTime * 0.3 + position.y * 0.5) * 0.08;
    pos.y += cos(uTime * 0.25 + position.z * 0.5) * 0.08;
    pos.z += sin(uTime * 0.2 + position.x * 0.4) * 0.06;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * uPixelRatio * (180.0 / -mvPosition.z);
    gl_PointSize = max(gl_PointSize, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    // Soft glow falloff
    float strength = 1.0 - (dist * 2.0);
    strength = pow(strength, 1.8);

    // Core brightness
    float core = 1.0 - smoothstep(0.0, 0.15, dist);
    vec3 finalColor = mix(vColor, vec3(1.0), core * 0.6);

    gl_FragColor = vec4(finalColor, strength * vAlpha);
  }
`;

/* ============================================================
   MOUSE TRACKER (shared ref across components)
   ============================================================ */
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

/* ============================================================
   ERROR BOUNDARY — catches WebGL / Three.js crashes
   ============================================================ */
interface EBProps {
  children: ReactNode;
  fallback: ReactNode;
}
interface EBState {
  hasError: boolean;
}

class ThreeErrorBoundary extends Component<EBProps, EBState> {
  constructor(props: EBProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): EBState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn('[ParticleField] Three.js error caught, showing fallback:', error.message, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

/* ============================================================
   CAMERA RIG — parallax mouse reactivity
   ============================================================ */
function CameraRig() {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    cameraRef.current = camera as THREE.PerspectiveCamera;
    const onPointerMove = (e: PointerEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [camera]);

  useFrame(() => {
    mouse.x += (mouse.targetX - mouse.x) * 0.04;
    mouse.y += (mouse.targetY - mouse.y) * 0.04;
    if (cameraRef.current) {
      cameraRef.current.rotation.y = -mouse.x * 0.15;
      cameraRef.current.rotation.x = mouse.y * 0.1;
    }
  });

  return null;
}

/* ============================================================
   PARTICLE NEBULA — spiral galaxy formation
   ============================================================ */
const ParticleNebula = React.memo(function ParticleNebula() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, colors, sizes, alphas } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const siz = new Float32Array(PARTICLE_COUNT);
    const alp = new Float32Array(PARTICLE_COUNT);

    const ARMS = 3;
    const ARM_SPREAD = 0.45;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Spiral galaxy distribution
      const radius = Math.random() * 5 + 0.2;
      const armAngle = ((i % ARMS) / ARMS) * Math.PI * 2;
      const spinAngle = radius * 0.8;
      const scatter = (Math.random() - 0.5) * ARM_SPREAD * (radius * 0.6 + 0.3);
      const scatterY = (Math.random() - 0.5) * 0.8 * (1.0 / (radius * 0.3 + 0.5));

      pos[i3]     = Math.cos(armAngle + spinAngle) * radius + scatter;
      pos[i3 + 1] = scatterY;
      pos[i3 + 2] = Math.sin(armAngle + spinAngle) * radius + scatter * 0.5;

      // Color — bias toward cyan/purple with occasional amber/white
      const colorIndex = Math.random() < 0.35 ? 0
        : Math.random() < 0.55 ? 1
        : Math.random() < 0.8  ? 2
        : 3;
      const c = PALETTE[colorIndex];
      // Add slight variation
      col[i3]     = Math.min(1, c.r + (Math.random() - 0.5) * 0.15);
      col[i3 + 1] = Math.min(1, c.g + (Math.random() - 0.5) * 0.15);
      col[i3 + 2] = Math.min(1, c.b + (Math.random() - 0.5) * 0.15);

      // Size — brighter particles near center
      const distFromCenter = radius / 5;
      siz[i] = (Math.random() * 3 + 1) * (1 - distFromCenter * 0.5);

      // Alpha
      alp[i] = Math.random() * 0.5 + 0.25 + (1 - distFromCenter) * 0.2;
    }

    return { positions: pos, colors: col, sizes: siz, alphas: alp };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    return geo;
  }, [positions, colors, sizes, alphas]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1 },
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});

/* ============================================================
   WIREFRAME SHAPES — rotating geometric shapes with glow
   ============================================================ */

const TorusKnotWireframe = React.memo(function TorusKnotWireframe() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(
    () => new THREE.TorusKnotGeometry(1.8, 0.6, 128, 16, 2, 3),
    []
  );

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: CYAN,
        wireframe: true,
        transparent: true,
        opacity: 0.07,
      }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.05;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.07;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.03;
  });

  return (
    <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={meshRef} geometry={geometry} material={material} />
    </Float>
  );
});

const IcosahedronWireframe = React.memo(function IcosahedronWireframe() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(1.2, 1),
    []
  );

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: PURPLE,
        wireframe: true,
        transparent: true,
        opacity: 0.09,
      }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.08;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.5;
    meshRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.12) * 0.3;
  });

  return (
    <Float speed={0.6} rotationIntensity={0.15} floatIntensity={0.4}>
      <mesh ref={meshRef} geometry={geometry} material={material} />
    </Float>
  );
});

const OctahedronWireframe = React.memo(function OctahedronWireframe() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(
    () => new THREE.OctahedronGeometry(0.7, 0),
    []
  );

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: AMBER,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.z = t * 0.1;
    // Orbiting motion
    meshRef.current.position.x = Math.cos(t * 0.2) * 2.5;
    meshRef.current.position.y = Math.sin(t * 0.18) * 1.5;
    meshRef.current.position.z = Math.sin(t * 0.22) * 1.0;
  });

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} geometry={geometry} material={material} />
    </Float>
  );
});

/* ============================================================
   ORBITAL RINGS — thin torus rings at different angles
   ============================================================ */

const OrbitalRing = React.memo(function OrbitalRing({
  radius,
  rotation,
  speed,
  color,
  opacity,
}: {
  radius: number;
  rotation: [number, number, number];
  speed: number;
  color: THREE.Color;
  opacity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(
    () => new THREE.TorusGeometry(radius, 0.005, 8, 200),
    [radius]
  );

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
      }),
    [color, opacity]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = state.clock.elapsedTime * speed;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} rotation={rotation} />
  );
});

const OrbitalRings = React.memo(function OrbitalRings() {
  return (
    <group>
      <OrbitalRing
        radius={3.2}
        rotation={[Math.PI * 0.5, 0, 0]}
        speed={0.08}
        color={CYAN}
        opacity={0.15}
      />
      <OrbitalRing
        radius={4.0}
        rotation={[Math.PI * 0.35, Math.PI * 0.25, 0]}
        speed={-0.06}
        color={PURPLE}
        opacity={0.12}
      />
      <OrbitalRing
        radius={2.6}
        rotation={[Math.PI * 0.7, Math.PI * -0.15, Math.PI * 0.1]}
        speed={0.1}
        color={AMBER}
        opacity={0.1}
      />
    </group>
  );
});

/* ============================================================
   SCENE CONTENT — all 3D objects
   ============================================================ */
function SceneContent() {
  return (
    <>
      <CameraRig />
      <ParticleNebula />
      <TorusKnotWireframe />
      <IcosahedronWireframe />
      <OctahedronWireframe />
      <OrbitalRings />
    </>
  );
}

/* ============================================================
   FALLBACK — simple CSS gradient if WebGL fails
   ============================================================ */
function Fallback() {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #0a0a2e 0%, #030014 70%)',
      }}
    />
  );
}

/* ============================================================
   MAIN EXPORT — ParticleField component
   ============================================================ */
function hasWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return gl !== null;
  } catch {
    return false;
  }
}

export default function ParticleField() {
  const [canRenderWebGL] = useState(() => hasWebGLSupport());

  if (!canRenderWebGL) {
    return <Fallback />;
  }

  return (
    <div className="fixed inset-0 z-0">
      <ThreeErrorBoundary fallback={<Fallback />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 100 }}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
          style={{ background: BG_COLOR }}
          frameloop="always"
        >
          <Suspense fallback={null}>
            <color attach="background" args={[BG_COLOR]} />
            <SceneContent />
            <EffectComposer>
              <Bloom
                intensity={1.2}
                luminanceThreshold={0.1}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
}
