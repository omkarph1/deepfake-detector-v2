import { useRef, useEffect } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MODELS = [
    {
        name: 'ConvNeXt V2',
        accuracy: 90.39,
        auc: 1.0,
        params: '88.22M',
        type: 'Frame-level CNN',
        desc: 'A modern convolutional architecture processing each frame independently. Uses advanced depthwise convolutions and global response normalization to capture subtle spatial artifacts from deepfake generation.',
        color: 'var(--cyan)',
        icon: '🧠',
        strengths: 'Detects spatial manipulation artifacts.'
    },
    {
        name: 'XceptionNet v3',
        accuracy: 87.96,
        auc: 0.98,
        params: '21.86M',
        type: 'Frame-level CNN',
        desc: 'An efficient depthwise separable convolution network. Excels at extracting fine-grained features with significantly fewer parameters — lightweight yet powerful.',
        color: 'var(--purple)',
        icon: '⚡',
        strengths: 'Strong at detecting compression.'
    },
    {
        name: 'ResNeXt50-BiLSTM',
        accuracy: 89.98,
        auc: 0.96,
        params: '49.22M',
        type: 'Temporal Sequence Model',
        desc: 'A hybrid architecture combining ResNeXt50 CNN with Bidirectional LSTM. Processes all 15 frames as a temporal sequence, capturing both spatial features and temporal inconsistencies.',
        color: 'var(--green)',
        icon: '🔗',
        strengths: 'Detects temporal flickering, inter-frame inconsistencies.'
    },
]

function AnimatedNumber({ target, decimals = 2, suffix = '%' }) {
    const ref = useRef()
    const isInView = useInView(ref, { once: true })
    const motionVal = useMotionValue(0)
    const spring = useSpring(motionVal, { duration: 1500, bounce: 0 })

    useEffect(() => {
        if (isInView) motionVal.set(target)
    }, [isInView, motionVal, target])

    useEffect(() => {
        return spring.on('change', (v) => {
            if (ref.current) {
                ref.current.textContent = v.toFixed(decimals) + suffix
            }
        })
    }, [spring, decimals, suffix])

    return <span ref={ref} className="count-up">0{suffix}</span>
}

function ModelCard({ model, index }) {
    const ref = useRef()
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            className="glass-card p-6 relative overflow-hidden flex flex-col gap-4"
        >
            {/* Color accent bar */}
            <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg, ${model.color}, transparent)` }}
            />

            <div className="flex items-start gap-3">
                <span className="text-3xl">{model.icon}</span>
                <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-color)' }}>{model.name}</h3>
                    <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                            background: `${model.color}18`,
                            color: model.color,
                            border: `1px solid ${model.color}40`
                        }}
                    >
                        {model.type}
                    </span>
                </div>
            </div>

            <p className="text-sm flex-1" style={{ color: 'var(--text-muted)' }}>{model.desc}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                    { label: 'Accuracy', val: model.accuracy, suffix: '%', dec: 2 },
                    { label: 'AUC', val: model.auc, suffix: '', dec: 2 },
                    { label: 'Params', val: null, raw: model.params },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="text-center p-3 rounded-xl"
                        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                    >
                        <div className="text-lg font-bold" style={{ color: model.color }}>
                            {stat.val !== null
                                ? <AnimatedNumber target={stat.val} decimals={stat.dec} suffix={stat.suffix} />
                                : stat.raw
                            }
                        </div>
                        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Strengths */}
            <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span style={{ color: model.color }}>Strengths:</span> {model.strengths}
            </div>
        </motion.div>
    )
}

export default function About() {
    return (
        <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--cyan)' }}>
                    The Technology
                </span>
                <h2 className="section-heading mt-3 mb-6" style={{ fontSize: '3rem' }}>3 Neural Networks. <span style={{ color: 'var(--text-color)' }}>1 Verdict.</span></h2>
                <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Our ensemble combines three state-of-the-art architectures with complementary strategies — spatial, efficient, and temporal — for robust multi-angle deepfake detection.
                </p>

                {/* Why an Ensemble? Block */}
                <div className="mt-10 mx-auto max-w-4xl text-left glass-card p-8 flex flex-col gap-2">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-xl">🔬</span>
                        <h4 className="text-lg font-bold" style={{ color: 'var(--text-color)' }}>Why an Ensemble?</h4>
                    </div>
                    <p className="text-sm leading-loose" style={{ color: 'var(--text-muted)' }}>
                        No single model catches every manipulation type. Deepfakes create artifacts at different levels — <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>spatial</span> (texture, boundary), <span style={{ color: 'var(--purple)', fontWeight: 600 }}>frequency</span> (compression), and <span style={{ color: 'var(--green)', fontWeight: 600 }}>temporal</span> (flickering, motion). By combining three specialized architectures, each independently producing <strong>dual confidence scores</strong>, our system achieves significantly higher reliability through <strong>majority voting</strong>.
                    </p>
                </div>
            </motion.div>

            {/* Model cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 items-stretch">
                {MODELS.map((m, i) => <ModelCard key={m.name} model={m} index={i} />)}
            </div>

            {/* Dataset stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-8 flex flex-col md:flex-row gap-8 items-center"
            >
                <div className="w-full md:w-1/3 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,245,255,0.2)' }}>
                    <img src="/images/Deepfake_Detector.jpg" alt="Deepfake Dataset Overview" className="w-full h-full object-cover opacity-90" />
                </div>

                <div className="w-full md:w-2/3 flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-color)' }}>Training Dataset</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            FF++ C23 + Celeb-DF v2 combined benchmark
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-8">
                        {[
                            { val: '3,990', label: 'Videos' },
                            { val: '79,800', label: 'Frames' },
                            { val: 'MTCNN', label: 'Face Extraction' },
                            { val: '124', label: 'Evaluations / Video' },
                        ].map(({ val, label }) => (
                            <div key={label} className="text-center">
                                <div className="text-2xl font-bold" style={{ color: 'var(--cyan)' }}>{val}</div>
                                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Tech Stack Logos */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20 text-center"
            >
                <span className="text-xs font-semibold tracking-widest uppercase mb-8 block" style={{ color: 'var(--text-muted)' }}>
                    Powered By Industry-Standard Tools
                </span>
                <div className="flex flex-wrap items-center justify-center gap-10 opacity-70">
                    <div className="flex flex-col items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/10/PyTorch_logo_icon.svg" alt="PyTorch" className="h-10 w-10 grayscale hover:grayscale-0 transition-all duration-300" />
                        <span className="text-xs font-mono">PyTorch</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Flask_logo.svg" alt="Flask" className="h-10 grayscale opacity-80 transition-all duration-300 logo-invert" />
                        <span className="text-xs font-mono">Flask API</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" className="h-10 w-10 grayscale hover:grayscale-0 transition-all duration-300" />
                        <span className="text-xs font-mono">React 18</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg" alt="Vite" className="h-10 w-10 grayscale hover:grayscale-0 transition-all duration-300" />
                        <span className="text-xs font-mono">Vite</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="Tailwind CSS" className="h-10 w-10 grayscale hover:grayscale-0 transition-all duration-300" />
                        <span className="text-xs font-mono">Tailwind</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/32/OpenCV_Logo_with_text_svg_version.svg" alt="OpenCV" className="h-10 grayscale hover:grayscale-0 transition-all duration-300" />
                        <span className="text-xs font-mono">OpenCV</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/NumPy_logo_2020.svg" alt="NumPy" className="h-10 grayscale hover:grayscale-0 transition-all duration-300" />
                        <span className="text-xs font-mono">NumPy</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/FFmpeg_Logo_new.svg" alt="FFmpeg" className="h-10 grayscale hover:grayscale-0 transition-all duration-300" />
                        <span className="text-xs font-mono">FFmpeg</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-10 w-10 flex items-center justify-center text-3xl opacity-50 hover:opacity-100 transition-all duration-300">🤓</div>
                        <span className="text-xs font-mono">MTCNN</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Kaggle_logo.png" alt="Kaggle" className="h-10 grayscale hover:grayscale-0 transition-all duration-300" style={{ objectFit: 'contain' }} />
                        <span className="text-xs font-mono">Kaggle</span>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
