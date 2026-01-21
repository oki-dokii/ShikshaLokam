import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function StarField() {
    const ref = useRef<any>();

    // Generate random points for the starfield
    const positions = useMemo(() => {
        const pos = new Float32Array(2000 * 3);
        for (let i = 0; i < 2000; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return pos;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#3b82f6"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}

function FloatingNodes() {
    const nodes = useMemo(() => {
        return Array.from({ length: 8 }).map((_, i) => ({
            position: [(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2] as [number, number, number],
            speed: 0.5 + Math.random(),
            rotationSpeed: [Math.random() * 0.01, Math.random() * 0.01, Math.random() * 0.01] as [number, number, number],
        }));
    }, []);

    return (
        <>
            {nodes.map((node, i) => (
                <Float key={i} speed={node.speed} rotationIntensity={1} floatIntensity={1}>
                    <mesh position={node.position}>
                        <octahedronGeometry args={[0.2, 0]} />
                        <meshStandardMaterial
                            color={i % 2 === 0 ? "#3b82f6" : "#10b981"}
                            wireframe
                            emissive={i % 2 === 0 ? "#3b82f6" : "#10b981"}
                            emissiveIntensity={2}
                        />
                    </mesh>
                </Float>
            ))}
        </>
    );
}

export const SpaceScene = () => {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} />
                <StarField />
                <FloatingNodes />
            </Canvas>
        </div>
    );
};
