import { useGLTF, } from "@react-three/drei"

export default function BrainModel({ name, modelRef, ...props }) {
    const { scene } = useGLTF(process.env.PUBLIC_URL + '/assets/models/brain.glb');

    return <primitive ref={modelRef} name={name} object={scene} position={[0, 1.55, 0]} dispose={null} />;
}