import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroParticles = () => {
    const prefersReducedMotion = useReducedMotion();
    if (prefersReducedMotion) return null;
    return Array.from({ length: 25 }).map((_, i) => (
        <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
                backgroundColor: Math.random() > 0.5 ? 'var(--cyan)' : 'var(--purple)',
                boxShadow: 'var(--particle-glow)',
                width: Math.random() * 4 + 3 + 'px',
                height: Math.random() * 4 + 3 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
            }}
            animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3]
            }}
            transition={{
                duration: Math.random() * 5 + 3,
                delay: Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    ));
}

const Step1Visual = ({ inView }) => {
    const [uploadState, setUploadState] = useState(0);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (!inView || prefersReducedMotion) return;
        const interval = setInterval(() => {
            setUploadState(prev => (prev + 1) % 2);
        }, 3000);
        return () => clearInterval(interval);
    }, [inView, prefersReducedMotion]);

    return (
        <div className="relative w-full max-w-md aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: uploadState === 0 ? 'var(--cyan)' : 'var(--purple)', boxShadow: '0 0 50px rgba(0, 0, 0, 0.05)' }}>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/deepfake_image.jpg')", opacity: 'var(--image-opacity)', mixBlendMode: 'var(--image-blend)' }} />
            <motion.svg
                animate={inView && !prefersReducedMotion ? { translateY: [-10, 0, -10] } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 mb-6" fill="none" viewBox="0 0 24 24" stroke="var(--cyan)">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </motion.svg>

            <div className="w-3/4 h-2 rounded-full overflow-hidden mb-4 border border-[var(--card-border)]" style={{ backgroundColor: 'var(--card-bg)' }}>
                <motion.div
                    className="h-full origin-left"
                    style={{ background: 'linear-gradient(to right, var(--cyan), var(--purple))' }}
                    animate={inView && !prefersReducedMotion ? { scaleX: [0, 1] } : { scaleX: 1 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={uploadState}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="font-mono text-sm tracking-widest uppercase"
                    style={{ color: 'var(--text-color)' }}
                >
                    {uploadState === 0 ? 'Uploading...' : 'Received ✓'}
                </motion.div>
            </AnimatePresence>
        </div >
    )
}

const Step2Visual = ({ inView }) => {
    const prefersReducedMotion = useReducedMotion();
    return (
        <div className="relative w-full max-w-lg flex flex-col items-center">
            <div className="w-full aspect-video rounded-xl relative overflow-hidden border border-[var(--card-border)] mb-8" style={{ backgroundColor: 'var(--card-bg)' }}>
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/Deepfake_Detector.jpg')", opacity: 'var(--image-opacity)', mixBlendMode: 'var(--image-blend)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4 h-1/2 rounded-full blur-sm z-0" style={{ backgroundColor: 'var(--cyan)', opacity: 0.15 }} />

                <motion.div
                    className="absolute top-0 left-0 w-full h-1 z-10"
                    style={{ backgroundColor: 'var(--cyan)', boxShadow: '0 0 15px var(--cyan)' }}
                    animate={inView && !prefersReducedMotion ? { y: ['0%', '900%', '0%'] } : { y: '500%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />

                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-2/3 overflow-visible z-20">
                    <path d="M 0 10 L 0 0 L 10 0" fill="none" stroke="var(--cyan)" strokeWidth="3" />
                    <path d="M 100% 10 L 100% 0 L calc(100% - 10px) 0" fill="none" stroke="var(--cyan)" strokeWidth="3" />
                    <path d="M 0 calc(100% - 10px) L 0 100% L 10 100%" fill="none" stroke="var(--cyan)" strokeWidth="3" />
                    <path d="M 100% calc(100% - 10px) L 100% 100% L calc(100% - 10px) 100%" fill="none" stroke="var(--cyan)" strokeWidth="3" />

                    <motion.rect
                        width="100%" height="100%" fill="none" stroke="var(--cyan)" strokeWidth="2" strokeDasharray="10 10"
                        animate={inView && !prefersReducedMotion ? { opacity: [0, 1, 0, 1, 0] } : { opacity: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                </svg>
            </div>

            <div className="flex gap-3 mt-4">
                {[
                    '/images/hero-deepfake.jpg',
                    '/images/deepfake_img.png',
                    '/images/deepfake_image.jpg',
                    '/images/Deepfake_Detector.jpg',
                    '/images/hero-deepfake.jpg'
                ].map((imgSrc, i) => (
                    <motion.div
                        key={i}
                        className="w-14 h-14 md:w-20 md:h-20 rounded-md border-2 relative overflow-hidden"
                        style={{ borderColor: i === 2 ? 'var(--cyan)' : 'var(--card-border)', boxShadow: i === 2 ? '0 0 15px rgba(0,245,255,0.3)' : 'none' }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={prefersReducedMotion ? {} : { delay: i * 0.15, duration: 0.5 }}
                    >
                        <div className="absolute inset-0 bg-cover origin-center" style={{ backgroundImage: `url('${imgSrc}')`, backgroundPosition: i === 4 ? 'left' : 'center', backgroundSize: 'cover', opacity: 'var(--image-opacity)', mixBlendMode: 'var(--image-blend)' }} />

                        <svg className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] opacity-60 z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <rect x="0" y="0" width="100" height="100" fill="none" stroke={i === 2 ? "var(--cyan)" : "transparent"} strokeWidth="6" strokeDasharray="15 10" />
                        </svg>

                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold px-1 z-20 rounded-t-sm" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-color)' }}>
                            F{i + 1}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

const Step3Visual = ({ inView }) => {
    const prefersReducedMotion = useReducedMotion();
    return (
        <div className="relative w-full max-w-2xl h-[450px] flex justify-between items-start pt-10 px-4 md:px-0">
            {[
                { color: 'cyan', icon: 'M9 12h.01M15 12h.01M12 3a9 9 0 0 1 9 9c0 1.25-.26 2.44-.73 3.51A9.006 9.006 0 0 1 12 21a9 9 0 0 1-8.27-5.49A8.96 8.96 0 0 1 3 12a9 9 0 0 1 9-9z M12 3v3m0 12v3M3 12h3m12 0h3', title: 'ConvNeXt' },
                { color: 'purple', icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Xception' },
                { color: 'green', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', title: 'ResNeXt' }
            ].map((model, i) => (
                <div key={i} className="flex flex-col items-center relative h-[300px] w-1/3">
                    <motion.div animate={inView && !prefersReducedMotion ? { rotate: 360 } : {}} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} className={`mb-4 w-6 h-6 flex justify-center items-center`} style={{ color: `var(--${model.color})` }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </motion.div>

                    <div className="p-4 md:p-6 rounded-xl border mb-4 z-10 relative flex flex-col items-center" style={{ backgroundColor: 'var(--card-bg)', borderColor: `var(--${model.color})`, boxShadow: `0 0 15px var(--${model.color})` }}>
                        <svg className="w-6 h-6 md:w-8 md:h-8 mb-2" style={{ color: `var(--${model.color})` }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={model.icon} />
                        </svg>
                        <span className="font-bold text-[10px] md:text-xs whitespace-nowrap text-center" style={{ color: 'var(--text-color)' }}>{model.title}</span>
                        {i === 2 && (
                            <div className="absolute top-1/2 left-full -translate-y-1/2 ml-2 hidden md:flex items-center text-[10px] text-green-400 font-mono whitespace-nowrap">
                                ←15 FR→
                            </div>
                        )}
                    </div>

                    <div className="absolute top-32 bottom-0 w-full flex justify-center overflow-hidden">
                        {[0, 1].map(j => (
                            <motion.div
                                key={j}
                                className="absolute w-1.5 h-6 md:w-2 md:h-8 rounded-full"
                                style={{ backgroundColor: `var(--${model.color})`, boxShadow: `0 0 10px var(--${model.color})` }}
                                animate={inView && !prefersReducedMotion ? { y: [-50, 150] } : { y: 20 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: j * 0.75 }}
                            />
                        ))}
                    </div>
                </div>
            ))}

            <svg className="absolute bottom-10 left-0 w-full h-[150px] overflow-visible" preserveAspectRatio="none">
                <motion.path d="M 16.66% 0 C 16.66% 80, 50% 80, 50% 150" fill="none" stroke="var(--cyan)" strokeWidth="3" strokeDasharray="5 5" initial={{ pathLength: 0 }} animate={inView && !prefersReducedMotion ? { pathLength: 1 } : { pathLength: 1 }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.path d="M 50% 0 L 50% 150" fill="none" stroke="var(--purple)" strokeWidth="3" strokeDasharray="5 5" initial={{ pathLength: 0 }} animate={inView && !prefersReducedMotion ? { pathLength: 1 } : { pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }} />
                <motion.path d="M 83.33% 0 C 83.33% 80, 50% 80, 50% 150" fill="none" stroke="var(--green)" strokeWidth="3" strokeDasharray="5 5" initial={{ pathLength: 0 }} animate={inView && !prefersReducedMotion ? { pathLength: 1 } : { pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }} />
            </svg>

            <motion.div
                className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,1)] flex items-center justify-center z-20"
                animate={inView && !prefersReducedMotion ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] } : { scale: 1.2, opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity }}
            >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--bg)' }} />
            </motion.div>
        </div>
    )
}

const Step4Visual = ({ inView }) => {
    const prefersReducedMotion = useReducedMotion();
    return (
        <div className="relative w-full max-w-md h-[400px] flex flex-col items-center">
            <div className="flex justify-between w-full px-4 md:px-0 mb-16">
                {['cyan', 'purple', 'green'].map((colorName, i) => (
                    <motion.div
                        key={i}
                        className="w-16 h-16 rounded-xl flex items-center justify-center border z-10"
                        style={{ backgroundColor: 'var(--card-bg)', borderColor: `var(--${colorName})` }}
                        animate={inView && !prefersReducedMotion ? { boxShadow: [`0 0 0px var(--${colorName})`, `0 0 20px var(--${colorName})`, `0 0 0px var(--${colorName})`] } : { boxShadow: `0 0 20px var(--${colorName})` }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    >
                        <div className="w-6 h-6 rounded-full border-2" style={{ backgroundColor: 'var(--bg)', borderColor: `var(--${colorName})` }} />
                    </motion.div>
                ))}

                <svg className="absolute top-[32px] left-0 w-full h-[120px] z-0 overflow-visible px-4 md:px-0">
                    <path d="M 12% 0 Q 50% 60 50% 120" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                    <path d="M 50% 0 L 50% 120" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                    <path d="M 88% 0 Q 50% 60 50% 120" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                </svg>
            </div>

            <motion.div
                className="mt-8 px-8 py-4 rounded-xl border-2 font-black text-2xl tracking-widest text-center z-10"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--green)', boxShadow: '0 0 30px rgba(0, 255, 136, 0.4)', color: 'var(--green)' }}
                animate={inView && !prefersReducedMotion ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
            >
                VERDICT
            </motion.div>

            <div className="mt-16 w-64 h-32 relative overflow-hidden">
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--card-border)" strokeWidth="8" strokeLinecap="round" />
                    <motion.path
                        d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--green)" strokeWidth="8" strokeLinecap="round"
                        pathLength="1" strokeDasharray="1" strokeDashoffset="1"
                        animate={inView && !prefersReducedMotion ? { strokeDashoffset: [1, 0.48] } : { strokeDashoffset: 0.48 }}
                        transition={{ duration: 1.5, ease: "easeOut", forwards: true }}
                    />
                </svg>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-bold text-xl md:text-2xl whitespace-nowrap" style={{ color: 'var(--text-color)' }}>51.7% REAL</div>
            </div>
        </div>
    )
}

const Step5Visual = ({ inView }) => {
    const prefersReducedMotion = useReducedMotion();
    return (
        <div className="relative w-full h-[500px] flex justify-center items-center">
            <motion.div
                className="relative w-[280px] h-[380px] rounded shadow-2xl overflow-hidden p-6 flex flex-col gap-4 border border-[var(--card-border)]"
                style={{ background: 'var(--card-bg)' }}
                initial={{ y: 100, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.8, type: "spring" }}
            >
                <div className="w-full h-8 bg-green-500 rounded flex items-center px-4">
                    <div className="w-12 h-3 bg-white/40 rounded" />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 h-32 rounded flex items-end p-2 gap-2 border border-[var(--card-border)] relative overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/deepfake_img.png')", opacity: 'var(--image-opacity)', mixBlendMode: 'var(--image-blend)' }} />
                        <div className="w-1/2 h-[60%] rounded-t z-10" style={{ backgroundColor: 'var(--purple)' }} />
                        <div className="w-1/2 h-[40%] rounded-t z-10" style={{ backgroundColor: 'var(--green)' }} />
                    </div>
                    <div className="w-24 h-32 rounded flex items-center justify-center border border-[var(--card-border)]" style={{ backgroundColor: 'var(--bg)' }}>
                        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[25px] border-b-cyan-400" />
                    </div>
                </div>

                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex-1 aspect-square border border-[var(--card-border)] rounded-sm bg-cover bg-center relative" style={{ backgroundImage: "url('/images/Deepfake_Detector.jpg')", backgroundPosition: `${i * 20}% center` }}>
                            <div className="absolute inset-0" style={{ backgroundColor: 'var(--bg)', opacity: 0.8 }} />
                        </div>
                    ))}
                </div>

                <div className="mt-auto w-full flex justify-center">
                    <motion.button
                        className="px-6 py-2 bg-pink-500 text-white rounded-full text-xs font-bold"
                        animate={inView && !prefersReducedMotion ? { boxShadow: ['0 0 0px rgba(236,72,153,0)', '0 0 20px rgba(236,72,153,0.8)', '0 0 0px rgba(236,72,153,0)'] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Download PDF
                    </motion.button>
                </div>

                <div className="absolute top-0 right-0 border-solid border-l-[var(--bg)] border-b-[var(--bg)] border-t-transparent border-r-transparent border-l-[30px] border-b-[30px] border-t-[30px] border-r-[30px]" />
            </motion.div>
        </div>
    )
}

const StepPanel = ({ step, index, isMobile }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { amount: 0.5 });

    const colorHexMap = {
        'cyan': '#22d3ee',
        'purple': '#a855f7',
        'orange': '#fbbf24',
        'pink': '#ec4899'
    };

    return (
        <div ref={ref} className={`w-full md:w-screen ${isMobile ? 'min-h-[80vh] py-16 flex-col' : 'min-h-screen snap-center flex-row overflow-hidden'} flex relative shrink-0 pt-20 md:pt-0 border-b border-[var(--card-border)] md:border-b-0`}>

            <div className={`absolute top-1/2 ${isMobile ? 'left-1/2 -translate-x-1/2' : 'left-1/4 -translate-y-1/2'} -translate-y-1/2 text-[12rem] md:text-[20rem] font-black opacity-[0.03] pointer-events-none select-none z-0 tracking-tighter mix-blend-screen text-white`}>
                0{index + 1}
            </div>

            <div className={`w-full ${isMobile ? 'px-8 py-8' : 'md:w-[40%] flex flex-col justify-center px-8 lg:pl-32 py-12'} z-10`}>
                <div className="flex items-center gap-4 mb-6">
                    <motion.div
                        className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-black text-xl"
                        style={{
                            borderColor: step.id === 3 ? 'transparent' : colorHexMap[step.color],
                            color: step.id === 3 ? 'white' : colorHexMap[step.color],
                            background: step.id === 3 ? 'linear-gradient(to right, #22d3ee, #a855f7, #4ade80)' : 'transparent'
                        }}
                    >
                        {step.badge}
                    </motion.div>
                </div>

                <div className="overflow-hidden">
                    <motion.h2
                        className={`text-3xl md:text-5xl font-black mb-6 ${step.titleColor || 'text-white'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {step.title}
                    </motion.h2>
                    <motion.div
                        className="h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 origin-left w-1/4"
                        initial={{ scaleX: 0 }}
                        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.8 }}
                    />
                </div>

                <p className="text-lg leading-relaxed text-[var(--text-muted)] mb-8">
                    {step.desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                    {step.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 text-xs font-mono font-bold bg-white/5 border border-white/10 rounded-full text-white/70">
                            {tag}
                        </span>
                    ))}
                </div>

                {step.code && (
                    <div className="p-4 rounded-lg bg-black/50 border border-[var(--card-border)] font-mono text-xs md:text-sm text-cyan-200 whitespace-pre shadow-xl overflow-x-auto">
                        {step.code}
                    </div>
                )}
                {step.detailBlock}
            </div>

            <div className={`w-full ${isMobile ? 'p-6 mt-8' : 'md:w-[60%] p-8 md:p-16 flex items-center justify-center'} z-10 relative`}>
                {step.visual(inView)}
            </div>
        </div>
    );
}

const StatCounter = ({ endValue, label, isTime }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (!inView || isTime) return;
        let start = 0;
        const end = parseInt(endValue.replace(/,/g, ''));
        const duration = 2000;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [inView, endValue, isTime]);

    return (
        <div ref={ref} className="flex flex-col items-center mt-8 md:mt-0">
            <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                {isTime ? endValue : count.toLocaleString()}
            </span>
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</span>
            <motion.div
                className="h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mt-4 origin-left rounded-full w-12"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
            />
        </div>
    );
};

export default function HowItWorksPage() {
    const prefersReducedMotion = useReducedMotion();

    const steps = [
        {
            id: 1, color: 'cyan', badge: '01', title: 'Upload Video',
            desc: 'Drop any MP4, AVI, MOV, or WebM file. DeepGuard securely streams it to the Flask backend using a multipart FormData POST — no cloud storage, no third parties.',
            tags: ['MP4 · AVI · MOV · WebM · max 500MB'],
            code: `POST /api/detect\nContent-Type: multipart/form-data\nBody: { video: File }\n→ Response: SSE Stream`,
            visual: (inView) => <Step1Visual inView={inView} />
        },
        {
            id: 2, color: 'purple', badge: '02', title: 'MTCNN Face Extraction',
            desc: '15 frames are sampled at uniform intervals. MTCNN\'s 3-stage cascade (P-Net → R-Net → O-Net) detects and aligns the face region. Falls back to center-crop if no face is found. post_process=False preserves raw pixel data for model inference.',
            tags: ['15 frames · 224×224px · P-Net → R-Net → O-Net · auto-fallback'],
            detailBlock: (
                <div className="mt-4 p-4 rounded-lg border border-[var(--card-border)] text-sm space-y-2" style={{ backgroundColor: 'var(--bg)' }}>
                    <div><span className="text-cyan-500 font-mono">P-Net</span> <span style={{ color: 'var(--text-muted)' }}>→ Fast sliding window proposal</span></div>
                    <div><span className="text-purple-500 font-mono">R-Net</span> <span style={{ color: 'var(--text-muted)' }}>→ Refines bounding boxes</span></div>
                    <div><span className="text-green-500 font-mono">O-Net</span> <span style={{ color: 'var(--text-muted)' }}>→ Final alignment + landmarks</span></div>
                </div>
            ),
            visual: (inView) => <Step2Visual inView={inView} />
        },
        {
            id: 3, color: 'cyan', titleColor: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400',
            badge: '03', title: '3-Model Parallel Inference',
            desc: 'All three models run simultaneously in a Python ThreadPoolExecutor. Each applies 4-view Test-Time Augmentation — original, horizontal flip, brightness boost, contrast boost — producing 4 predictions per model, averaged for robustness. Total: 124 inferences per video.',
            tags: ['ThreadPoolExecutor · 4-view TTA · 124 inferences · ~4 min'],
            visual: (inView) => <Step3Visual inView={inView} />
        },
        {
            id: 4, color: 'orange', badge: '04', title: 'Majority Voting',
            desc: 'Each model independently casts a REAL or FAKE vote by comparing its Fake Confidence against the 0.50 threshold. The final verdict requires ≥2 out of 3 models to agree. A borderline confidence tier is assigned when models agree but fake probability is between 50–60%.',
            tags: ['Threshold 0.50 · ≥2/3 decides · HIGH / MODERATE / BORDERLINE'],
            detailBlock: (
                <div className="mt-4 p-4 rounded-lg border border-[var(--card-border)] text-sm space-y-2 font-mono" style={{ backgroundColor: 'var(--bg)' }}>
                    <div style={{ color: 'var(--text-muted)' }}>ConvNeXt → <span className="text-green-500 bg-green-900/40 px-2 py-0.5 rounded">REAL</span> (33.7% fake)</div>
                    <div style={{ color: 'var(--text-muted)' }}>XceptionNet → <span className="text-green-500 bg-green-900/40 px-2 py-0.5 rounded">REAL</span> (49.6% fake)</div>
                    <div style={{ color: 'var(--text-muted)' }}>ResNeXt → <span className="text-red-500 bg-red-900/40 px-2 py-0.5 rounded">FAKE</span> (61.6% fake)</div>
                    <div className="text-green-500 mt-2 font-black pt-2 border-t border-[var(--card-border)]">→ VERDICT: REAL (2/3 votes)</div>
                </div>
            ),
            visual: (inView) => <Step4Visual inView={inView} />
        },
        {
            id: 5, color: 'pink', badge: '05', title: 'PDF Report',
            desc: 'jsPDF and html2canvas paint the entire React results DOM — verdict card, radar chart, face frames, confidence gauge, and formula explanation — onto an A4 canvas and export it as a downloadable PDF. CORS is handled with useCORS: true to prevent canvas tainting from Base64 SVGs.',
            tags: ['jsPDF · html2canvas · useCORS: true · A4 format · instant download'],
            visual: (inView) => <Step5Visual inView={inView} />
        }
    ];

    return (
        <div className="relative w-full min-h-screen font-sans overflow-x-hidden" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-color)' }}>

            {/* 1. Cinematic Hero */}
            <section className="relative md:sticky md:top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden z-0">
                <motion.div
                    className="absolute inset-0 z-[-1]"
                    animate={prefersReducedMotion ? {} : { backgroundColor: ["rgba(0,212,255,0.05)", "rgba(139,92,246,0.05)", "rgba(0,212,255,0.05)"] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="absolute inset-0 z-[-1] pointer-events-none" style={{
                    backgroundImage: `repeating-linear-gradient(to right, rgba(0, 212, 255, 0.03) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(to bottom, rgba(0, 212, 255, 0.03) 0px, transparent 1px, transparent 60px)`
                }} />

                <HeroParticles />

                <div className="flex flex-col items-center z-10 text-center px-4 w-full">
                    <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-8 backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-[pulse_1s_step-end_infinite]" />
                        <span className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase">The Pipeline</span>
                    </div>

                    <motion.div
                        className="flex flex-wrap justify-center overflow-hidden"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.08 }
                            }
                        }}
                    >
                        {"How It Works".split('').map((char, index) => (
                            <motion.span
                                key={index}
                                variants={{
                                    hidden: { y: 50, opacity: 0 },
                                    visible: { y: 0, opacity: 1 }
                                }}
                                className="text-5xl md:text-8xl font-black bg-gradient-to-r from-cyan-500 via-gray-400 to-purple-500 bg-clip-text text-transparent pb-4"
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                        ))}
                    </motion.div>

                    <motion.p
                        className="text-lg md:text-2xl font-medium mt-4 max-w-2xl"
                        style={{ color: 'var(--text-muted)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        From raw video to AI verdict in seconds
                    </motion.p>
                </div>

                <div className="absolute bottom-12 flex flex-col items-center gap-4">
                    <span className="text-xs font-mono text-cyan-500/60 uppercase tracking-widest">Scroll to Begin</span>
                    <div className="w-[2px] h-[60px] bg-cyan-900 overflow-hidden relative">
                        <motion.div
                            className="absolute top-0 left-0 w-full bg-cyan-400 origin-top"
                            animate={prefersReducedMotion ? {} : { scaleY: [0, 1, 0], y: ['0%', '0%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            style={{ height: '100%' }}
                        />
                    </div>
                </div>
            </section>

            {/* 2. Scroll-Driven Pipeline */}
            <div className="relative z-10 md:bg-transparent min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
                <div className="flex flex-col gap-0 w-full" style={{ backgroundColor: 'var(--bg)' }}>
                    {steps.map((step, i) => (
                        <div key={step.id} className="w-full flex shrink-0">
                            <div className="w-full md:w-screen min-h-[80vh] py-16 flex flex-col md:flex-row relative pt-20 border-b border-[var(--card-border)] overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 md:left-1/4 -translate-x-1/2 md:-translate-x-0 -translate-y-1/2 text-[12rem] md:text-[20rem] font-black pointer-events-none select-none z-0 tracking-tighter" style={{ color: 'var(--text-color)', opacity: 'var(--big-num-opacity)' }}>
                                    0{i + 1}
                                </div>
                                <div className="w-full md:w-[40%] flex flex-col justify-center px-8 lg:pl-32 py-12 z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <motion.div
                                            className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-black text-xl"
                                            style={{
                                                borderColor: step.id === 3 ? 'transparent' : (step.color === 'cyan' ? '#22d3ee' : step.color === 'purple' ? '#a855f7' : step.color === 'orange' ? '#fbbf24' : '#ec4899'),
                                                color: step.id === 3 ? 'white' : (step.color === 'cyan' ? '#22d3ee' : step.color === 'purple' ? '#a855f7' : step.color === 'orange' ? '#fbbf24' : '#ec4899'),
                                                background: step.id === 3 ? 'linear-gradient(to right, #22d3ee, #a855f7, #4ade80)' : 'transparent'
                                            }}
                                        >
                                            {step.badge}
                                        </motion.div>
                                    </div>
                                    <div className="overflow-hidden">
                                        <motion.h2
                                            className="text-3xl md:text-5xl font-black mb-6"
                                            style={{ color: step.titleColor || 'var(--text-color)' }}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.5 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {step.title}
                                        </motion.h2>
                                        <motion.div
                                            className="h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mb-6 origin-left w-1/4"
                                            initial={{ scaleX: 0 }}
                                            whileInView={{ scaleX: 1 }}
                                            viewport={{ once: true, amount: 0.5 }}
                                            transition={{ duration: 0.8 }}
                                        />
                                    </div>
                                    <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-color)' }}>
                                        {step.desc}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {step.tags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1 text-xs font-mono font-bold border rounded-full" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-color)' }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    {step.code && (
                                        <div className="p-4 rounded-lg border border-[var(--card-border)] font-mono text-xs md:text-sm text-cyan-500 whitespace-pre shadow-xl overflow-x-auto" style={{ backgroundColor: 'var(--card-bg)' }}>
                                            {step.code}
                                        </div>
                                    )}
                                    {step.detailBlock}
                                </div>
                                <div className="w-full md:w-[60%] p-6 md:p-16 mt-8 md:mt-0 flex items-center justify-center z-10 relative">
                                    {step.visual(true)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Performance Stats Bar */}
            <section className="relative w-full border-t border-b border-[var(--card-border)] py-20 px-8 z-20" style={{ background: 'var(--card-bg)' }}>
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <StatCounter endValue="3,990" label="Videos Processed" />
                    <StatCounter endValue="79,800" label="Frames Analyzed" />
                    <StatCounter endValue="124" label="Inferences / Video" />
                    <StatCounter endValue="~4 min" label="Avg Process Time" isTime={true} />
                </div>
            </section>

            {/* 4. Closing CTA */}
            <section className="relative w-full py-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden z-20" style={{ backgroundColor: 'var(--bg)' }}>
                <div className="absolute inset-0 z-[-1] pointer-events-none" style={{
                    backgroundImage: `repeating-linear-gradient(to right, rgba(168, 85, 247, 0.05) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(to bottom, rgba(168, 85, 247, 0.05) 0px, transparent 1px, transparent 60px)`
                }} />
                <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
                    Ready to Test Your Video?
                </h2>
                <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mb-12">
                    Drop a video and watch all three models analyze it live — with real-time terminal logs and a downloadable PDF report.
                </p>
                <Link to="/detect">
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0,212,255,0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-cyan-500 text-black font-black text-xl rounded-full transition-shadow duration-300"
                    >
                        → Try DeepGuard Now
                    </motion.button>
                </Link>
            </section>
        </div>
    );
}
