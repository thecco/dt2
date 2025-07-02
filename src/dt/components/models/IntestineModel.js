import { useGLTF, } from "@react-three/drei"

export default function IntestineModel({ name, modelRef, ...props }) {
    const { scene } = useGLTF(process.env.PUBLIC_URL + '/assets/models/intestine.glb');

    return <primitive ref={modelRef} name={name} object={scene} position={[-0.05, 0.95, 0]} scale={[0.15, 0.15, 0.15]} dispose={null} rotation={[90, 0, 0]} />;
}