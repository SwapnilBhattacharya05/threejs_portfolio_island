import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Loader from '../components/Loader'
import Island from '../models/Island'
import Sky from '../models/Sky'
import Bird from '../models/Bird'
import Plane from '../models/Plane'
import HomeInfo from '../components/HomeInfo'

import sakura from '../assets/sakura.mp3'
import { use } from 'react'
import { soundoff, soundon } from '../assets/icons'

const Home = () => {
    const audioRef = useRef(new Audio(sakura));
    audioRef.current.volume = 0.4;
    audioRef.current.loop = true;

    const [isRotating, setIsRotating] = useState(false);
    const [currentStage, setCurrentStage] = useState(1);
    const [isPlayingMusic, setIsPlayingMusic] = useState(false);

    useEffect(() => {
        if (isPlayingMusic) {
            audioRef.current.play();
        }

        return () => {
            audioRef.current.pause();
        }

    }, [isPlayingMusic]);

    const adjustIslandForScreenSize = () => {
        let screenScale = null;

        // *POSITION:     X,   Y,   Z
        let screenPosition = [0, -6.5, -43];

        // *DEFAULT ROTATION
        let rotation = [0.1, 4.7, 0]

        if (window.innerWidth < 768) {
            screenScale = [0.9, 0.9, 0.9];
        } else {
            // SINCE ON LARGER SCREEN THEM
            screenScale = [1, 1, 1];
        }

        return [screenScale, screenPosition, rotation];
    };

    const adjustPlaneForScreenSize = () => {
        let screenScale, screenPosition;

        if (window.innerWidth < 768) {
            screenScale = [1.5, 1.5, 1.5];
            screenPosition = [0, -1.5, 0];
        } else {
            // SINCE ON LARGER SCREEN THEM
            screenScale = [3, 3, 3];
            screenPosition = [0, -4, -4];
        }

        return [screenScale, screenPosition];
    };

    // CALLING THE FUNCTION ISLAND
    const [islandScale, islandPosition, islandRotation] = adjustIslandForScreenSize();

    // CALLING THE FUNCTION PLANE
    const [planeScale, planePosition] = adjustPlaneForScreenSize();

    return (
        <section className='w-full h-screen relative'>
            <div className='flex items-center justify-center absolute top-28 left-0 right-0 z-10'>
                {
                    // ?CHECK IF CURRENT STAGE EXISTS
                    currentStage && (<HomeInfo currentStage={currentStage} />)
                }
            </div>

            {/* 3D SCENE */}
            <Canvas className={`w-full h-screen bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}
                camera={{
                    near: 0.1,
                    far: 1000,
                }}
            >
                {/* USED FOR RENDERING THE LOADING SCREEN */}
                <Suspense fallback={<Loader />} >

                    {/* ALL LIGHTS IN THE SCENE */}
                    {/* SIMULATES THE LIGHT COMING FROM DISTANT SOURCE */}
                    <directionalLight
                        position={[1, 1, 1]}
                        intensity={2}
                    />

                    {/* ILLUMINATES ALL OBJECTS IN THE SCENE EQUALLY CASTING SHADOWS */}
                    <ambientLight
                        intensity={0.5}
                    />

                    {/* EMITES LIGHT IN ALL DIRECTIONS FROM SINGLE POINT */}
                    {/* // !NOT NEEDED HERE SINCE IN OUR MODEL WE ARE OUTSIDE */}
                    {/* <pointLight /> */}

                    {/* SIMILAR TO SPOTLIGHT BUT HAS A CONE SHAPE */}
                    {/* // !NOT NEEDED HERE */}
                    {/* <spotLight /> */}

                    {/* ILLUMINATES THE SCENE WITH A GRADIENT */}
                    <hemisphereLight
                        skyColor='#b1e1ff'
                        groundColor='#000'
                        intensity={1}
                    />

                    <Bird />
                    <Sky
                        isRotating={isRotating}
                    />
                    <Island
                        scale={islandScale}
                        position={islandPosition}
                        rotation={islandRotation}
                        isRotating={isRotating}
                        setIsRotating={setIsRotating}
                        setCurrentStage={setCurrentStage}
                    />
                    <Plane
                        scale={planeScale}
                        position={planePosition}
                        isRotating={isRotating}
                        rotation={[0, 20, 0]}
                    />
                </Suspense>
            </Canvas>

            {/* MUSIC TOGGLE BUTTON */}
            <div className='absolute bottom-2 left-2'>
                <img
                    src={!isPlayingMusic ? soundoff : soundon}
                    alt="sound"
                    className='w-10 h-10 cursor-pointer object-contain'
                    onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                />
            </div>
        </section>
    );
};

export default Home;