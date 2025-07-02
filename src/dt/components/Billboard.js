import { useRef, useLayoutEffect, useMemo } from 'react';
import { Html } from '@react-three/drei';

export default function Billboard({ scene, boneName, offset = [0, 0, 0], children, ...props }) {
    const groupRef = useRef();
    // eslint-disable-next-line
    const bone = useMemo(() => scene.getObjectByName(boneName), [boneName]);

    useLayoutEffect(() => {
        const currentGroup = groupRef.current;

        if (bone && currentGroup) {
            bone.add(currentGroup);
            currentGroup.position.set(...offset);

            return () => {
                bone.remove(currentGroup);
            };
        }
        // eslint-disable-next-line
    }, [offset]);

    return bone ? <group ref={groupRef} {...props}><Html center>{children}</Html></group> : null;
}