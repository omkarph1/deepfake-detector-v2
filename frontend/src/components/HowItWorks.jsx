import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
    {
        icon: '🎬',
        title: 'Upload Video',
        desc: 'Drop any MP4, AVI, or MOV file. The video is securely processed on the server.',
        color: '#00f5ff',
        detail: 'Supports MP4 · AVI · MOV · WebM'
    },
    {
        icon: '🖼️',
        title: 'MTCNN Face Extraction',
        desc: '15 frames sampled at uniform intervals. MTCNN aligns and crops the face region. Falls back to center-crop if no face is detected.',
        color: '#bf00ff',
        detail: '15 frames · 224×224 pixels · auto-fallback'
    },
    {
        icon: '🧠',
        title: '3-Model Parallel Inference',
        desc: 'ConvNeXt V2, XceptionNet v3, and ResNeXt50-BiLSTM run simultaneously with 4-view Test-Time Augmentation (TTA) for robustness.',
        color: '#00ff88',
        detail: '4-view TTA · Parallel execution · 124 inferences'
    },
    {
        icon: '🗳️',
        title: 'Majority Voting',
        desc: 'Each model votes Real or Fake at threshold 0.50. Two or more "Fake" votes → FAKE verdict. Confidence tier assigned from agreement level.',
        color: '#f97316',
        detail: 'Threshold 0.50 · ≥2/3 decides · HIGH / MODERATE / BORDERLINE'
    },
    {
        icon: '📄',
        title: 'PDF Report',
        desc: 'Download a full PDF report including the verdict, all model scores, extracted face frames, radar chart, and formula explanation.',
        color: '#ec4899',
        detail: 'jsPDF · html2canvas · full visual report'
    },
]

export default function HowItWorks() {
    const containerRef = useRef()

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Flowy staggered entrance
            gsap.from('.timeline-step', {
                opacity: 0,
                y: 80,
                scale: 0.9,
                duration: 1,
                stagger: 0.25,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse',
                }
            })

            // Animate central glowing pipeline line
            gsap.from('.timeline-line', {
                scaleY: 0,
                transformOrigin: 'top center',
                duration: 2.5,
                ease: 'power3.inOut',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 60%',
                }
            })

            // Connectors sweeping in
            gsap.from('.connector-line', {
                scaleX: 0,
                opacity: 0,
                transformOrigin: (i) => i % 2 === 0 ? 'right center' : 'left center',
                duration: 1,
                stagger: 0.25,
                delay: 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 60%',
                }
            })
        }, containerRef)
        return () => ctx.revert()
    }, [])

    return (
        <section id="how-it-works" className="py-32 px-6 max-w-6xl mx-auto overflow-hidden" ref={containerRef}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-24"
            >
                <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#00f5ff' }}>
                    The Pipeline
                </span>
                <h2 className="section-heading mt-3">How It Works</h2>
                <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
                    From raw video to an AI verdict in seconds. Watch data flow through the DeepGuard neural engine.
                </p>
            </motion.div>

            <div className="relative">
                {/* Central glowing vertical line */}
                <div
                    className="timeline-line absolute left-1/2 top-0 bottom-0 w-1 hidden md:block"
                    style={{
                        background: 'linear-gradient(180deg, transparent 0%, #00f5ff 15%, #bf00ff 50%, #00ff88 85%, transparent 100%)',
                        boxShadow: '0 0 20px rgba(0,245,255,0.4)',
                        transform: 'translateX(-50%)'
                    }}
                />

                <div className="flex flex-col gap-20">
                    {STEPS.map((step, i) => {
                        const isEven = i % 2 === 0
                        return (
                            <div key={i} className={`timeline-step relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? 'md:flex-row-reverse' : ''}`}>

                                {/* Timeline Dot (Center on desktop) */}
                                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full items-center justify-center text-xl font-bold z-10"
                                    style={{
                                        background: 'var(--card-bg)',
                                        border: `3px solid ${step.color}`,
                                        boxShadow: `0 0 25px ${step.color}60`,
                                        color: step.color
                                    }}>
                                    {i + 1}
                                </div>

                                {/* Flowy Connector Line (Desktop) */}
                                <div className={`connector-line hidden md:block absolute top-1/2 w-[calc(50%-3rem)] h-px bg-gradient-to-r ${isEven ? 'right-1/2 from-transparent to-[' + step.color + ']' : 'left-1/2 from-[' + step.color + '] to-transparent'}`}
                                    style={{ zIndex: 0, opacity: 0.5 }}
                                />

                                {/* Content Card */}
                                <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                                    <div
                                        className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-500"
                                        style={{
                                            borderColor: `${step.color}30`,
                                            boxShadow: `0 10px 40px -10px ${step.color}20`
                                        }}
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${step.color}15`, border: `1px solid ${step.color}40` }}>
                                                {step.icon}
                                            </div>
                                            <h3 className="text-xl font-bold" style={{ color: 'var(--text-color)' }}>{step.title}</h3>
                                        </div>
                                        <p className="text-base mb-5" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>

                                        {/* Injecting example image into the flowchart dynamically */}
                                        {i === 1 && (
                                            <div className="mt-4 mb-5 rounded-lg overflow-hidden border" style={{ borderColor: `${step.color}30` }}>
                                                <img src="/images/deepfake_img.png" alt="Example Frame Extraction" className="w-full h-32 object-cover opacity-90" />
                                            </div>
                                        )}
                                        {i === 2 && (
                                            <div className="mt-4 mb-5 rounded-lg overflow-hidden border" style={{ borderColor: `${step.color}30` }}>
                                                <img src="/images/deepfake_image.jpg" alt="Neural Network Analysis" className="w-full h-32 object-cover opacity-90" />
                                            </div>
                                        )}

                                        <div
                                            className="inline-flex items-center gap-2 text-xs px-4 py-1.5 rounded-full font-mono"
                                            style={{
                                                background: `${step.color}12`,
                                                color: step.color,
                                                border: `1px solid ${step.color}30`
                                            }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: step.color }} />
                                            {step.detail}
                                        </div>
                                    </div>
                                </div>

                                {/* Empty spacer for the other side on desktop */}
                                <div className="hidden md:block w-1/2" />
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
