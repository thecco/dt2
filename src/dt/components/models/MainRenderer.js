import * as THREE from 'three';
import { useState, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import { useGLTF, useAnimations, Html } from "@react-three/drei"
import { GlowMaterial } from '../materials/GlowMaterial';
import { HighlightMaterial } from '../materials/HighlightMaterial';
import { useControls, folder, button } from 'leva'
import Billboard from '../Billboard';
import HeartModel from './HeartModel';
import Portal from './Portal';
import Rig from '../Rig';
import BrainModel from './BrainModel';
import IntestineModel from './IntestineModel';

export default function MainRenderer({ ref, targetName, setTargetName, ...props }) {
    const { nodes, scene, animations } = useGLTF(process.env.PUBLIC_URL + '/assets/models/female.glb');
    const { actions } = useAnimations(animations, scene);
    const [targetRef, setTargetRef] = useState(null);
    const heartRef = useRef();
    const intestinesRef = useRef();
    const brainRef = useRef();

    //#region Materials
    const transparentMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#939393'),
        roughness: 1,
        clearcoat: 0,
        opacity: 0.2,
        iridescence: 1,
        flatShading: false,
        wireframe: false,
        depthWrite: true,
        depthTest: true,
        transparent: true,
        side: THREE.FrontSide,
    }), []);

    // eslint-disable-next-line
    const glowMat = useMemo(() => GlowMaterial({ glowColor: new THREE.Color(0xffffff), c: 0.8, p: 2 }));

    const heartMat = useMemo(() => new HighlightMaterial({
        mesh: nodes.body,
        baseColor: new THREE.Color('#ff3724'),
        xMin: 0.48,
        xMax: 0.69,
        yMin: 0.66,
        yMax: 0.87,
        softness: 0.08,
        alpha: 0.4,
    }), [nodes.body]);

    const stomachMat = useMemo(() => new HighlightMaterial({
        mesh: nodes.body,
        baseColor: new THREE.Color('#ad82ff'),
        xMin: 0.25,
        xMax: 0.75,
        yMin: 0.5,
        yMax: 0.73,
        softness: 0.12,
        alpha: 0.4,
    }), [nodes.body]);
    //#endregion

    //#region Leva
    const [materialProps, setMaterialProps] = useControls(() => ({
        'Manual Controls': folder({
            color: '#939393',
            roughness: { value: 1, min: 0, max: 1.0 },
            opacity: { value: 0.2, min: 0, max: 1.0 },
            clearcoat: { value: 0, min: 0, max: 1.0 },
            flatShading: false,
            wireframe: false,
        }, { collapsed: false })
    }));

    useControls(() => ({
        'Material': folder({
            '투명': button(() => {
                setMaterialProps({
                    color: '#939393',
                    roughness: 1,
                    clearcoat: 0,
                    opacity: 0.2,
                });
            }),
            '반투명+유리': button(() => {
                setMaterialProps({
                    color: '#939393',
                    roughness: 0,
                    clearcoat: 1,
                    opacity: 0.5,
                });
            }),
            '불투명+유리': button(() => {
                setMaterialProps({
                    color: '#939393',
                    roughness: 0,
                    clearcoat: 1,
                    opacity: 1,
                });
            }),
        }, { collapsed: false }),
    }));

    useEffect(() => {
        if (transparentMat) {
            transparentMat.color.set(materialProps.color);
            transparentMat.roughness = materialProps.roughness;
            transparentMat.opacity = materialProps.opacity;
            transparentMat.clearcoat = materialProps.clearcoat;
            transparentMat.flatShading = materialProps.flatShading;
            transparentMat.wireframe = materialProps.wireframe;

            transparentMat.needsUpdate = true;
        }
    }, [materialProps, transparentMat]);
    //#endregion

    useEffect(() => {
        const idleAction = actions['idle1'];

        if (idleAction) {
            idleAction.timeScale = 0.7;
            idleAction.reset().setLoop(THREE.LoopRepeat).play();
        }
    }, [actions]);

    useLayoutEffect(() => {
        if (!nodes || !nodes.body || !nodes.body.parent || scene.getObjectByName('overlay_0')) return;
        const mesh = nodes.body;
        const matrix = mesh.bindMatrix.clone();

        mesh.material?.dispose();
        mesh.material = transparentMat;
        mesh.renderOrder = 0;

        const overlays = [glowMat, heartMat, stomachMat].map((mat, i) => {
            const overlay = new THREE.SkinnedMesh(mesh.geometry, mat);

            overlay.bind(mesh.skeleton, matrix);
            overlay.name = `overlay_${i}`;
            overlay.renderOrder = 1;

            return overlay;
        })

        overlays.forEach(overlay => mesh.parent.add(overlay));

        return () => {
            overlays.forEach(overlay => mesh.parent.remove(overlay));

            transparentMat.dispose();
            glowMat.dispose();
            heartMat.dispose();
            stomachMat.dispose();

            mesh.geometry.dispose();
        };

        // eslint-disable-next-line
    }, [nodes]);

    // useEffect(() => {
    //     if (!scene) return;

    //     console.log("--- 모델의 모든 뼈(Bone) 이름 목록 ---");

    //     scene.traverse((object) => {
    //         if (object.isBone) {
    //             console.log(object.name);
    //         }
    //     });
    //     console.log("------------------------------------");

    // }, [scene]);

    //#region Handlers
    function onButtonClick(name) {
        setTargetName(name);

        if (name === '심장') setTargetRef(heartRef);
        if (name === '대장') setTargetRef(intestinesRef);
        if (name === '뇌') setTargetRef(brainRef);
        if (!name) setTargetRef(null);
    }
    //#endregion

    return (
        <group {...props} dispose={null}>
            <primitive object={scene} ref={ref} dispose={null} />

            {!targetName && (
                <>
                    <Html position={[0.3, 1.3, 0.2]}>
                        <div className="annotation">
                            심장 <span className='outlineText' style={{ color: 'red' }}>32.6</span> <span style={{ fontSize: '1.5em' }}>😮</span>
                        </div>
                    </Html>

                    <Html position={[-0.55, 0.8, 0.2]}>
                        <div className="annotation">
                            대장  <span className='outlineText' style={{ color: '#00ff2a' }}>87.3</span> <span style={{ fontSize: '1.5em' }}>😊</span>
                        </div>
                    </Html>

                    <Billboard scene={scene} boneName="mixamorigSpine2" offset={[6, 0.1, 5]}>
                        <button className="annotation-button" onClick={() => onButtonClick('심장')}></button>
                    </Billboard>

                    <Billboard scene={scene} boneName="mixamorigSpine" offset={[0, -3, 5]}>
                        <button className="annotation-button" onClick={() => onButtonClick('대장')}></button>
                    </Billboard>

                    <Billboard scene={scene} boneName="mixamorigHeadTop_End" offset={[10, -3, 5]}>
                        <button className="annotation-button" onClick={() => onButtonClick('뇌')}></button>
                    </Billboard>
                </>
            )}

            <Portal name={'심장'} bg="#e4cdac" targetName={targetName}>
                <HeartModel name={'심장'} modelRef={heartRef} />
            </Portal>

            <Portal name={'대장'} bg="#e4cdac" targetName={targetName}>
                <IntestineModel name={'대장'} modelRef={intestinesRef} />
            </Portal>

            <Portal name={'뇌'} bg="#e4cdac" targetName={targetName}>
                <BrainModel name={'뇌'} modelRef={brainRef} />
            </Portal>

            <Rig targetRef={targetRef} />
        </group >
    );
}

useGLTF.preload(process.env.PUBLIC_URL + '/assets/models/brain.glb');
useGLTF.preload(process.env.PUBLIC_URL + '/assets/models/female.glb');
useGLTF.preload(process.env.PUBLIC_URL + '/assets/models/heart.glb');
useGLTF.preload(process.env.PUBLIC_URL + '/assets/models/intestine.glb');
useGLTF.preload(process.env.PUBLIC_URL + '/assets/models/kidney.glb');
useGLTF.preload(process.env.PUBLIC_URL + '/assets/models/liver.glb');