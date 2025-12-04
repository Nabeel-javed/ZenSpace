import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Add type definitions for React Three Fiber elements to satisfy the compiler
// We augment both 'react' module (for React.JSX) and global JSX to ensure compatibility
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      dodecahedronGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      group: any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      dodecahedronGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      group: any;
    }
  }
}

const FloatingShape = ({ position, color, speed, rotationIntensity, scale }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Randomize initial rotation slightly
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.cos(t / 4) * 0.2 + rotationIntensity;
    meshRef.current.rotation.y = Math.sin(t / 4) * 0.2;
  });

  return (
    <Float
      speed={speed} // Animation speed
      rotationIntensity={rotationIntensity} // XYZ rotation intensity
      floatIntensity={1} // Up/down float intensity
      position={position}
    >
      <mesh ref={meshRef} scale={scale} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.1} 
          metalness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>
    </Float>
  );
};

export const ZenBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#2dd4bf" />
        
        <group position={[0, -1, 0]}>
          <FloatingShape 
            position={[-4, 2, -2]} 
            color="#ccfbf1" // teal-100
            speed={1.5} 
            rotationIntensity={1} 
            scale={1.5} 
          />
          <FloatingShape 
            position={[4, -1, -4]} 
            color="#e7e5e4" // stone-200
            speed={2} 
            rotationIntensity={1.5} 
            scale={2} 
          />
          <FloatingShape 
            position={[-3, -3, -1]} 
            color="#0d9488" // teal-600
            speed={1} 
            rotationIntensity={0.5} 
            scale={0.8} 
          />
           <FloatingShape 
            position={[3, 4, -5]} 
            color="#ffffff" 
            speed={1.2} 
            rotationIntensity={0.8} 
            scale={1.2} 
          />
        </group>
        
        <Environment preset="city" />
        <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      </Canvas>
    </div>
  );
};