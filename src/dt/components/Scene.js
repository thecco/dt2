import { Suspense, useState } from 'react'
import { Canvas } from "@react-three/fiber"
import { Stats, Preload, Html } from '@react-three/drei';
import MainRenderer from './models/MainRenderer';
import Background from './Background';

export function Scene() {
    const [targetName, setTargetName] = useState(null);

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.82, 7.07], fov: 20 }} style={{ touchAction: 'none', width: '100%', height: '100%' }}>
                <Suspense fallback={null}>
                    <Background preset="sunset" color={'#a3b2c8'} />
                    <MainRenderer targetName={targetName} setTargetName={setTargetName} />
                </Suspense>

                <Stats className="stats" />
                <Preload all />
            </Canvas>

            {targetName && <div style={{
                position: 'absolute', // 부모 relative에 대해 절대 위치
                top: '20px',
                left: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)', // 배경색으로 가시성 확보
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                zIndex: 2 // Canvas (zIndex: 1)보다 높게 설정하여 위에 표시
            }}>
                <button onClick={() => setTargetName(null)}>
                    &lt; 뒤로
                </button>
            </div>
            }
        </div >
    );
}