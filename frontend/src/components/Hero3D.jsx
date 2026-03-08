import { useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, OrbitControls, MeshDistortMaterial } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

/**
 * GlowOrb component renders a glowing, distorted sphere.
 * This component rotates to simulate an active energy core.
 */
function GlowOrb() {
    const meshRef = useRef()
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.1
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
        }
    })
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
            <mesh ref={meshRef} scale={2.2}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshDistortMaterial
                    color="#00f5ff"
                    emissive="#00f5ff"
                    emissiveIntensity={0.4}
                    distort={0.45}
                    speed={2}
                    roughness={0}
                    metalness={0.3}
                    transparent
                    opacity={0.7}
                />
            </mesh>
        </Float>
    )
}

/**
 * OrbitRing component renders a glowing torus that orbits around the core.
 */
function OrbitRing() {
    const ringRef = useRef()
    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.x = state.clock.elapsedTime * 0.3
            ringRef.current.rotation.z = state.clock.elapsedTime * 0.15
        }
    })
    return (
        <mesh ref={ringRef}>
            <torusGeometry args={[3.5, 0.06, 16, 120]} />
            <meshStandardMaterial
                color="#bf00ff"
                emissive="#bf00ff"
                emissiveIntensity={1.2}
                transparent
                opacity={0.8}
            />
        </mesh>
    )
}

/**
 * OrbitRing2 component renders an outer, thinner glowing torus.
 */
function OrbitRing2() {
    const ringRef = useRef()
    useFrame((state) => {
        if (ringRef.current) {
            ringRef.current.rotation.y = state.clock.elapsedTime * 0.25
            ringRef.current.rotation.z = state.clock.elapsedTime * -0.1
        }
    })
    return (
        <mesh ref={ringRef}>
            <torusGeometry args={[4.5, 0.03, 16, 120]} />
            <meshStandardMaterial
                color="#00f5ff"
                emissive="#00f5ff"
                emissiveIntensity={0.8}
                transparent
                opacity={0.5}
            />
        </mesh>
    )
}

/**
 * NeuralParticles renders a static sea of particles to simulate a network.
 * @param {Object} props - Component props
 * @param {number} [props.count=1000] - Number of particles
 * @param {string} [props.color='#00f5ff'] - Color of particles
 * @param {number} [props.radius=6] - Radius of the particle field
 */
function NeuralParticles({ count = 1000, color = '#00f5ff', radius = 6 }) {
    const points = useMemo(() => {
        const pos = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count)
            const theta = Math.sqrt(count * Math.PI) * phi
            const r = radius + (Math.random() - 0.5) * 3
            pos[i * 3] = r * Math.cos(theta) * Math.sin(phi)
            pos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi)
            pos[i * 3 + 2] = r * Math.cos(phi)
        }
        return pos
    }, [count, radius])

    const pointsRef = useRef()
    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.04
            pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" array={points} count={count} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial color={color} size={0.04} transparent opacity={0.7} sizeAttenuation />
        </points>
    )
}

function PurpleParticles({ isDarkMode }) {
    const points = useMemo(() => {
        const pos = new Float32Array(500 * 3)
        for (let i = 0; i < 500; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20
        }
        return pos
    }, [])

    const ref = useRef()
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = -state.clock.elapsedTime * 0.03
        }
    })

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" array={points} count={500} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial color={isDarkMode ? "#bf00ff" : "#8800cc"} size={0.06} transparent opacity={0.5} sizeAttenuation />
        </points>
    )
}

function TypewriterGlitch({ text, isDarkMode }) {
    return (
        <h1
            className="glitch-text font-bold leading-tight"
            data-text={text}
            style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)', color: isDarkMode ? 'white' : '#0f172a' }}
        >
            {text}
        </h1>
    )
}

/**
 * Hero3D is the main landing section of the application.
 * It contains a Three.js canvas for 3D visual effects and an HTML overlay with calls to action.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onDetectClick - Callback invoked when the user clicks 'Detect Now'
 */
export default function Hero3D({ isDarkMode = true }) {
    return (
        <section id="hero" className="relative w-full" style={{ height: '100vh', minHeight: '600px' }}>
            {/* Stunning image background overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url(/images/hero-deepfake.jpg)',
                    opacity: isDarkMode ? 0.25 : 0.4,
                    zIndex: 0,
                    mixBlendMode: isDarkMode ? 'luminosity' : 'normal'
                }}
            />

            {/* Darker gradient overlay to make text pop over the bright image */}
            <div
                className="absolute inset-0"
                style={{
                    background: isDarkMode
                        ? 'radial-gradient(circle at center, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.95) 100%)'
                        : 'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, rgba(248,250,252,0.95) 100%)',
                    zIndex: 0
                }}
            />

            {/* Three.js Subtle Particle Canvas */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                    <ambientLight intensity={isDarkMode ? 0.5 : 1} />
                    {isDarkMode && <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={1.5} />}
                    <NeuralParticles count={800} color={isDarkMode ? "#00f5ff" : "#0088cc"} radius={8} />
                    <PurpleParticles isDarkMode={isDarkMode} />
                </Canvas>
            </div>

            {/* HTML Overlay */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
                style={{ zIndex: 2 }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="max-w-3xl"
                >
                    {/* Eyebrow tag */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-sm font-semibold"
                        style={{
                            background: isDarkMode ? 'rgba(0,245,255,0.08)' : 'rgba(0,136,204,0.1)',
                            border: `1px solid ${isDarkMode ? 'rgba(0,245,255,0.3)' : 'rgba(0,136,204,0.3)'}`,
                            color: isDarkMode ? '#00f5ff' : '#0088cc'
                        }}
                    >
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: isDarkMode ? '#00f5ff' : '#0088cc' }} />
                        AI-Powered Deepfake Detection
                    </motion.div>

                    <TypewriterGlitch text="Can you trust what you see?" isDarkMode={isDarkMode} />

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6 text-lg md:text-xl"
                        style={{ color: isDarkMode ? 'rgba(232,232,240,0.7)' : 'rgba(15,23,42,0.8)' }}
                    >
                        AI-powered deepfake detection using{' '}
                        <span style={{ color: isDarkMode ? '#00f5ff' : '#0088cc' }}>3 neural networks</span> — ConvNeXt V2, XceptionNet &amp; ResNeXt50-BiLSTM
                        <br />with 4-view TTA and majority voting
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            to="/detect"
                            className="btn-neon neon-border-pulse text-lg px-8 py-4"
                        >
                            🔍 Detect Now
                        </Link>
                        <Link
                            to="/how-it-works"
                            className="text-sm font-medium flex items-center gap-2"
                            style={{ color: isDarkMode ? 'rgba(232,232,240,0.5)' : 'rgba(15,23,42,0.6)' }}
                        >
                            Learn how it works ↓
                        </Link>
                    </motion.div>

                    {/* Stats row */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-12 flex flex-wrap items-center justify-center gap-6"
                    >
                        {[
                            ['3', 'Neural Networks'],
                            ['159M+', 'Parameters'],
                            ['4×', 'TTA Views'],
                            ['124', 'Evals/Video'],
                        ].map(([num, label]) => (
                            <div key={label} className="text-center">
                                <div className="text-2xl font-bold" style={{ color: isDarkMode ? '#00f5ff' : '#0088cc' }}>{num}</div>
                                <div className="text-xs mt-1" style={{ color: isDarkMode ? 'rgba(232,232,240,0.5)' : 'rgba(15,23,42,0.6)' }}>{label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                style={{ zIndex: 2, color: isDarkMode ? 'rgba(0,245,255,0.5)' : 'rgba(0,136,204,0.6)' }}
            >
                <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${isDarkMode ? '#00f5ff' : '#0088cc'}, transparent)` }} />
                <span className="text-xs tracking-widest uppercase">Scroll</span>
            </motion.div>
        </section>
    )
}
