import { useRef, useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

export default function Billboard({ scene, boneName, offset = [0, 0, 0], children }) {
    const groupRef = useRef();
    const bone = useMemo(() => scene.getObjectByName(boneName), [boneName]);

    useLayoutEffect(() => {
        if (bone && groupRef.current) {
            bone.add(groupRef.current);
            groupRef.current.position.set(...offset);

            return () => {
                bone.remove(groupRef.current);
            };
        }
    }, [bone, offset]);

    // bone이 있을 때만 렌더링
    return bone ? <group ref={groupRef}>{children}</group> : null;
}