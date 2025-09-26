'use client';

import React, { useRef, useMemo, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, OrbitControls, PerspectiveCamera, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 마우스 추적 훅
function useMousePosition() {
  const mouse = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return mouse;
}

// 메인 구체 - 마우스 반응형
function MainSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const mouse = useMousePosition();
  
  // 마우스 따라가는 부드러운 움직임
  const targetRotation = useRef({ x: 0, y: 0 });
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // 마우스 위치에 따른 회전 목표값
    targetRotation.current = {
      x: mouse.current.y * 0.5,
      y: mouse.current.x * 0.5
    };
    
    if (meshRef.current) {
      // 부드러운 보간
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotation.current.x + time * 0.1,
        0.1
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation.current.y + time * 0.15,
        0.1
      );
      
      // 마우스 위치에 따른 이동
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        mouse.current.x * 0.5,
        0.05
      );
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        mouse.current.y * 0.5,
        0.05
      );
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.x = -time * 0.2 + mouse.current.y * 0.3;
      innerRef.current.rotation.y = time * 0.1 + mouse.current.x * 0.3;
    }
    
    if (outerRef.current) {
      outerRef.current.rotation.x = time * 0.05 - mouse.current.y * 0.2;
      outerRef.current.rotation.z = -time * 0.1 - mouse.current.x * 0.2;
    }
  });

  return (
    <group>
      {/* 외부 와이어프레임 구체 - 더 화려하게 */}
      <mesh ref={outerRef} scale={3.5}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial 
          color="#94a3b8"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* 추가 와이어프레임 레이어 */}
      <mesh scale={4} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial 
          color="#cbd5e1"
          wireframe
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* 중간 유리질 구체 - 마우스 반응 */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={meshRef} scale={2.5}>
          <icosahedronGeometry args={[1, 4]} />
          <MeshDistortMaterial
            color="#e2e8f0"
            emissive="#cbd5e1"
            emissiveIntensity={0.15}
            roughness={0.1}
            metalness={0.9}
            distort={0.2}
            speed={2}
            transparent
            opacity={0.4}
            envMapIntensity={1}
          />
        </mesh>
      </Float>

      {/* 내부 코어 - 홀로그래픽 효과 */}
      <mesh ref={innerRef} scale={1.8}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#f8fafc"
          emissive="#e2e8f0"
          emissiveIntensity={0.3}
          roughness={0}
          metalness={1}
          clearcoat={1}
          clearcoatRoughness={0}
          transparent
          opacity={0.95}
          transmission={0.95}
          thickness={0.5}
          envMapIntensity={1}
          reflectivity={1}
          iridescence={1}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[100, 400]}
        />
      </mesh>

      {/* 중심 발광 코어 - 펄스 효과 */}
      <mesh scale={[1, 1, 1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* 오비탈 링들 - 다양한 각도 */}
      {[0, 45, 90, 135].map((angle, i) => (
        <mesh 
          key={i}
          rotation={[
            (Math.PI / 180) * angle, 
            (Math.PI / 180) * (angle * 0.5), 
            0
          ]} 
          scale={2.5 + i * 0.2}
        >
          <torusGeometry args={[1, 0.003, 16, 100]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#cbd5e1" : "#94a3b8"}
            transparent
            opacity={0.3 - i * 0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

// 주변 떠다니는 파티클 - 마우스 반응형
function FloatingParticles() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const spherical = new THREE.Spherical();
    
    for (let i = 0; i < 1000; i++) {
      const radius = 3 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      spherical.set(radius, phi, theta);
      const point = new THREE.Vector3().setFromSpherical(spherical);
      pts.push(point);
    }
    return pts;
  }, []);

  const ref = useRef<THREE.Points>(null);
  const mouse = useMousePosition();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.01;
      
      // 마우스에 반응하는 파티클
      ref.current.position.x = mouse.current.x * 0.3;
      ref.current.position.y = mouse.current.y * 0.3;
    }
  });

  return (
    <>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          color="#e2e8f0"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* 추가 글로우 파티클 */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={new Float32Array(
              Array.from({ length: 100 }, () => [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
              ]).flat()
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#ffffff"
          transparent
          opacity={0.3}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

// 배경 그리드 - 더 세련되게
function BackgroundGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    }
  });
  
  return (
    <>
      <gridHelper 
        ref={gridRef}
        args={[60, 60, 0x475569, 0x475569]} 
        position={[0, -5, 0]}
      />
      <gridHelper 
        args={[60, 20, 0x334155, 0x334155]} 
        position={[0, -5.01, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.02, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial 
          color="#0f172a"
          transparent
          opacity={0.9}
        />
      </mesh>
    </>
  );
}

// 환경 조명 - 더 다이나믹하게
function Lighting() {
  const lightRef = useRef<THREE.PointLight>(null);
  const mouse = useMousePosition();
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x = 5 + mouse.current.x * 3;
      lightRef.current.position.y = 5 + mouse.current.y * 3;
      lightRef.current.intensity = 0.5 + Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });
  
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight ref={lightRef} position={[10, 10, 10]} intensity={0.5} color="#f1f5f9" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#cbd5e1" />
      <pointLight position={[0, 0, 0]} intensity={0.2} color="#ffffff" />
      <spotLight
        position={[15, 15, 15]}
        angle={0.3}
        penumbra={1}
        intensity={0.3}
        color="#e2e8f0"
        castShadow
      />
      <spotLight
        position={[-15, 10, -15]}
        angle={0.4}
        penumbra={1}
        intensity={0.2}
        color="#94a3b8"
      />
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={50} />
        
        <Suspense fallback={null}>
          <Lighting />
          
          {/* 메인 구체 시스템 */}
          <MainSphere />
          
          {/* 떠다니는 파티클 */}
          <FloatingParticles />
          
          {/* 배경 그리드 */}
          <BackgroundGrid />
        </Suspense>
        
        {/* 자유 회전 컨트롤 - 자동 회전 비활성화 */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
          autoRotate={false}
          enableRotate={true}
        />
        
        {/* Fog effect */}
        <fog attach="fog" args={["#0f172a", 8, 25]} />
      </Canvas>
    </div>
  );
}