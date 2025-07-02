import * as THREE from 'three';
import { useEffect } from 'react';
import { useGLTF, useAnimations } from "@react-three/drei"
import Background from '../Background';

export default function HeartModel({ name, modelRef, ...props }) {
    const { scene, animations } = useGLTF(process.env.PUBLIC_URL + '/assets/models/heart.glb');
    const { actions } = useAnimations(animations, scene);

    useEffect(() => {
        const idleAction = actions['idle'];

        if (idleAction) {
            idleAction.timeScale = 0.7;
            idleAction.reset().setLoop(THREE.LoopRepeat).play();
        }
    }, [actions]);

    return <primitive ref={modelRef} name={name} object={scene} position={[0.04, 1.25, 0]} scale={[0.1, 0.1, 0.1]} dispose={null} />;
}