import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshPortalMaterial } from '@react-three/drei'
import { easing } from 'maath'


export default function Portal({ name, bg, children, targetName, ...props }) {
    const portal = useRef();

    useFrame((state, dt) => {
        easing.damp(portal.current, 'blend', targetName === name ? 1 : 0, 0.35, dt);
    });

    return (
        <group {...props}>
            <mesh >
                <MeshPortalMaterial ref={portal}>

                    <ambientLight intensity={1} />
                    <directionalLight position={[5, 5, 5]} intensity={2} />
                    <color attach="background" args={[bg]} />

                    {children}
                </MeshPortalMaterial>
            </mesh>
        </group>
    );
}