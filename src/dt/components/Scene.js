import { Suspense, useRef } from 'react'
import { Canvas } from "@react-three/fiber"
import { PresentationControls, Stats, Html } from '@react-three/drei';
import AnimatedFemale from './models/AnimatedFemale';
import { Stage } from './Stage';
import Background from './Background';

export function Scene() {
    const modelRef = useRef();

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 2, 5], target: [0, 15, 0], fov: 20 }} style={{ touchAction: 'none', width: '100%', height: '100%' }}>
                <Suspense fallback={null}>
                    <Background preset="sunset" color={'#a3b2c8'} />

                    <Stage>
                        <PresentationControls
                            global
                            speed={2.5}
                            polar={[0, 0]}
                            config={{ mass: 2, tension: 400 }}
                            snap={false}>

                            <AnimatedFemale ref={modelRef} />
                        </PresentationControls>
                    </Stage>

                    <Html position={[0.3, 1.3, 1]}>
                        <div className="annotation">
                            심장 <span className='outlineText' style={{ color: 'red' }}>32.6</span> <span style={{ fontSize: '1.5em' }}>😮</span>
                        </div>
                    </Html>

                    <Html position={[-0.55, 0.8, 1]}>
                        <div className="annotation">
                            대장  <span className='outlineText' style={{ color: '#00ff2a' }}>87.3</span> <span style={{ fontSize: '1.5em' }}>😊</span>
                        </div>
                    </Html>
                </Suspense>
                <Stats className="stats" />
            </Canvas>
        </div >
    );
}