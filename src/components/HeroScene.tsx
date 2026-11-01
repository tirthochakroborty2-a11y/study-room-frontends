import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const CYAN = "#5fd4ff";
const BLUE = "#2f7bff";

function Book({ position, rotation, color }: { position: [number, number, number]; rotation: [number, number, number]; color: string }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => { if (g.current) g.current.rotation.z = rotation[2] + Math.sin(s.clock.elapsedTime * 0.8) * 0.05; });
  return (
    <group ref={g} position={position} rotation={rotation}>
      {[-1, 1].map((side) => (
        <group key={side} rotation={[0, 0, side * -0.25]}>
          <mesh position={[side * 0.55, 0, 0]}>
            <boxGeometry args={[1.1, 0.06, 1.4]} />
            <meshStandardMaterial color={color} roughness={0.5} />
          </mesh>
          <mesh position={[side * 0.55, 0.06, 0]}>
            <boxGeometry args={[1.04, 0.07, 1.32]} />
            <meshStandardMaterial color="#f3efe4" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Cap() {
  const g = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (g.current) g.current.rotation.y += Math.min(d, 0.05) * 0.6; });
  return (
    <group ref={g} position={[2.6, 0.9, -0.5]} rotation={[0.25, 0, 0.1]}>
      <mesh><boxGeometry args={[1.6, 0.06, 1.6]} /><meshStandardMaterial color="#141a2e" roughness={0.4} metalness={0.3} /></mesh>
      <mesh position={[0, -0.28, 0]}><cylinderGeometry args={[0.5, 0.55, 0.5, 32]} /><meshStandardMaterial color="#1b2340" roughness={0.5} /></mesh>
      <mesh position={[0.7, -0.25, 0.7]}><cylinderGeometry args={[0.02, 0.02, 0.5]} /><meshStandardMaterial color="#e8b84a" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0.7, -0.55, 0.7]}><sphereGeometry args={[0.07]} /><meshStandardMaterial color="#e8b84a" metalness={0.8} roughness={0.3} /></mesh>
    </group>
  );
}

function Atom({ position }: { position: [number, number, number] }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (g.current) { g.current.rotation.y += d * 0.5; g.current.rotation.x += d * 0.2; } });
  return (
    <group ref={g} position={position} scale={0.5}>
      <mesh><sphereGeometry args={[0.25, 24, 24]} /><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.5} /></mesh>
      {[0, Math.PI / 3, -Math.PI / 3].map((r) => (
        <mesh key={r} rotation={[Math.PI / 2, r, 0]}><torusGeometry args={[0.9, 0.02, 8, 64]} /><meshStandardMaterial color={BLUE} emissive={BLUE} emissiveIntensity={1} /></mesh>
      ))}
    </group>
  );
}

function Fireflies({ count = 80, lite = false }) {
  const ref = useRef<THREE.Points>(null);
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.015;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, velocities, phases };
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const { velocities, phases } = data;
    const t = state.clock.elapsedTime;
    // Target: mouse/touch pointer in world-ish space
    const targetX = state.pointer.x * 6;
    const targetY = state.pointer.y * 4;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      // gentle attraction to pointer (firefly feel)
      const dx = targetX - pos[ix];
      const dy = targetY - pos[ix + 1];
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
      const force = Math.min(0.018 / dist, 0.04);
      velocities[ix] += dx * force * 0.015;
      velocities[ix + 1] += dy * force * 0.015;
      // damping + wander
      velocities[ix] = velocities[ix] * 0.96 + Math.sin(t * 0.7 + phases[i]) * 0.004;
      velocities[ix + 1] = velocities[ix + 1] * 0.96 + Math.cos(t * 0.9 + phases[i]) * 0.004;
      velocities[ix + 2] = velocities[ix + 2] * 0.97 + Math.sin(t * 0.5 + phases[i] * 1.3) * 0.003;

      pos[ix] += velocities[ix];
      pos[ix + 1] += velocities[ix + 1];
      pos[ix + 2] += velocities[ix + 2];

      // soft bounds
      if (Math.abs(pos[ix]) > 8) velocities[ix] *= -0.5;
      if (Math.abs(pos[ix + 1]) > 6) velocities[ix + 1] *= -0.5;
      if (Math.abs(pos[ix + 2]) > 6) velocities[ix + 2] *= -0.5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    // subtle glow pulse
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.55 + Math.sin(t * 2.2) * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={lite ? 0.06 : 0.09}
        color="#a5f3fc"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function MouseLight() {
  const l = useRef<THREE.PointLight>(null);
  useFrame((s) => { l.current?.position.set(s.pointer.x * 5, s.pointer.y * 3, 2.5); });
  return <pointLight ref={l} intensity={25} color={CYAN} distance={10} />;
}

function Rig() {
  useFrame((s) => {
    s.camera.position.x = THREE.MathUtils.lerp(s.camera.position.x, s.pointer.x * 0.6, 0.04);
    s.camera.position.y = THREE.MathUtils.lerp(s.camera.position.y, s.pointer.y * 0.3, 0.04);
    s.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({ lite = false }: { lite?: boolean }) {
  return (
    <Canvas dpr={[1, lite ? 1.25 : 1.75]} camera={{ position: [0, 0, 7], fov: 45 }} gl={{ antialias: !lite, alpha: true }}
      onCreated={(s) => s.gl.domElement.parentElement?.setAttribute("data-scene-ready", "")}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <MouseLight />
      <Environment resolution={64}>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
        <Lightformer intensity={1} color={CYAN} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
      </Environment>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1}><Book position={[-2.7, -0.6, 0]} rotation={[0.5, 0.4, 0]} color={BLUE} /></Float>
      <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1.2}><Book position={[-1.6, 1.5, -2]} rotation={[0.8, -0.3, 0.2]} color="#1d3a8a" /></Float>
      <Float speed={1.3} floatIntensity={0.8}><Cap /></Float>
      <Float speed={2} floatIntensity={1.5}><Atom position={[-3.4, 1.8, -1]} /></Float>
      <Float speed={1.7} floatIntensity={1.5}><Atom position={[3.4, -1.6, -1]} /></Float>
      <Float speed={1} floatIntensity={2}>
        <mesh position={[1.4, 2, -3]}><sphereGeometry args={[0.45, 32, 32]} /><meshStandardMaterial color="#3b5bdb" roughness={0.3} metalness={0.4} /></mesh>
        <mesh position={[1.4, 2, -3]} rotation={[1.2, 0, 0.3]}><torusGeometry args={[0.75, 0.03, 8, 64]} /><meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={0.8} /></mesh>
      </Float>
      <Fireflies count={lite ? 45 : 90} lite={lite} />
      <Rig />
    </Canvas>
  );
}
