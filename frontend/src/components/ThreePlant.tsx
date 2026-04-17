import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

export default function ThreePlant() {
  const meshRef = useRef<THREE.Group>(null);
  
  // Rotate gently
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  const leavesMaterials = useMemo(() => {
    return [
      new THREE.MeshStandardMaterial({ color: '#2d6a4f', roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: '#40916c', roughness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: '#1b4332', roughness: 0.9 })
    ];
  }, []);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef} position={[0, -1.8, 0]} scale={1.2}>
        {/* Pot */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.5, 0.8, 32]} />
          <meshStandardMaterial color="#f4a261" roughness={0.6} metalness={0.1} />
        </mesh>
        
        {/* Pot Rim */}
        <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.7, 0.05, 16, 32]} />
          <meshStandardMaterial color="#e76f51" roughness={0.7} />
        </mesh>

        {/* Soil */}
        <mesh position={[0, 0.78, 0]} receiveShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.05, 32]} />
          <meshStandardMaterial color="#3e2723" roughness={1} />
        </mesh>

        {/* Main Trunk */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.25, 1.5, 16]} />
          <meshStandardMaterial color="#5d4037" roughness={0.9} />
        </mesh>

        {/* Branch 1 */}
        <group position={[0, 1.6, 0]} rotation={[0, 0, 0.6]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.15, 1.2, 16]} />
            <meshStandardMaterial color="#5d4037" roughness={0.9} />
          </mesh>
          <mesh position={[0.2, 1.2, 0]} castShadow>
            <sphereGeometry args={[0.7, 16, 16]} />
            <primitive object={leavesMaterials[0]} />
          </mesh>
        </group>

        {/* Branch 2 */}
        <group position={[0, 1.8, 0]} rotation={[0.5, 2, -0.5]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 1, 16]} />
            <meshStandardMaterial color="#5d4037" roughness={0.9} />
          </mesh>
          <mesh position={[0, 1, 0]} castShadow>
            <sphereGeometry args={[0.6, 16, 16]} />
            <primitive object={leavesMaterials[1]} />
          </mesh>
        </group>

        {/* Branch 3 */}
        <group position={[0, 2.1, 0]} rotation={[-0.5, -1, -0.4]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.1, 0.8, 16]} />
            <meshStandardMaterial color="#5d4037" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.8, 0]} castShadow>
            <sphereGeometry args={[0.55, 16, 16]} />
            <primitive object={leavesMaterials[2]} />
          </mesh>
        </group>

        {/* Top Canopy */}
        <mesh position={[0, 2.8, 0]} castShadow>
          <sphereGeometry args={[0.8, 16, 16]} />
          <primitive object={leavesMaterials[0]} />
        </mesh>
        <mesh position={[0.4, 2.6, 0.4]} castShadow>
          <sphereGeometry args={[0.6, 16, 16]} />
          <primitive object={leavesMaterials[1]} />
        </mesh>
        <mesh position={[-0.4, 2.7, -0.3]} castShadow>
          <sphereGeometry args={[0.65, 16, 16]} />
          <primitive object={leavesMaterials[2]} />
        </mesh>

        <Sparkles count={40} scale={3} size={2} speed={0.4} opacity={0.6} color="#a7f3d0" position={[0, 2, 0]} />
      </group>
      <ContactShadows position={[0, -1.8, 0]} opacity={0.7} scale={10} blur={2.5} far={4} />
    </Float>
  );
}
