import * as THREE from 'three'
import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'

export default function Rig({ targetRef }) {
    const { controls, camera } = useThree();

    useEffect(() => {
        if (!controls) { return; }
        if (targetRef && targetRef.current) {
            const box = new THREE.Box3().setFromObject(targetRef.current);
            const center = new THREE.Vector3();
            const size = new THREE.Vector3();
            box.getCenter(center);
            box.getSize(size);

            const fov = THREE.MathUtils.degToRad(camera.fov);
            const aspect = camera.aspect;

            const maxDim = Math.max(size.y, size.x / aspect, size.z);
            const distance = maxDim / Math.tan(fov / 2) * 1.2;

            const cameraOffset = new THREE.Vector3(0, 0, distance);
            const cameraPosition = new THREE.Vector3().addVectors(center, cameraOffset);

            controls.setLookAt(
                cameraPosition.x, cameraPosition.y, cameraPosition.z,
                center.x, center.y, center.z,
                true
            );
        } else {
            controls.setLookAt(
                0, 0.82, 7.07,
                0, 0.82, 0,
                true
            );
        }
    }, [targetRef, controls]);

    return <CameraControls makeDefault minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} target={[0, 0.82, 0]} />
}
