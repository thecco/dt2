import { Environment, MeshReflectorMaterial } from '@react-three/drei';

export default function Background({ preset, color }) {
    return (
        <>
            <Environment preset={preset} background backgroundBlurriness={1} />
            <fog attach="fog" args={[color, 8, 10]} />
            <mesh
                position={[0, 0, 0]}
                scale={[0.1, 0.1, 0.1]}
                rotation={[-Math.PI / 2, 0, Math.PI]}
                receiveShadow  >
                <planeGeometry args={[70, 70]} />
                <MeshReflectorMaterial
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={0.5}
                    depthScale={1}
                    minDepthThreshold={0.8}
                    maxDepthThreshold={1}
                    metalness={0.25}
                    color="#ffffff"
                    roughness={1} />
            </mesh>
        </>
    );
}