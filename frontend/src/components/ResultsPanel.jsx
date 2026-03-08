import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import ConfidenceGauge from './ConfidenceGauge'
import ModelCards from './ModelCards'
import RadarChartComponent from './RadarChart'
import FrameGrid from './FrameGrid'
import PDFExport from './PDFExport'

/**
 * Displays the primary verdict (REAL/FAKE) and confidence tier in an animated banner.
 * @param {Object} props
 * @param {string} props.verdict - "REAL" or "FAKE"
 * @param {string} props.confidence_tier - "HIGH", "MODERATE", or "BORDERLINE"
 * @param {number} props.votes_fake - Number of models that voted FAKE
 * @param {number} props.avg_confidence - Average fake probability across models
 */
function VerdictBanner({ verdict, confidence_tier, votes_fake, avg_confidence }) {
    const bannerRef = useRef()

    useEffect(() => {
        if (verdict === 'FAKE' && bannerRef.current) {
            gsap.fromTo(bannerRef.current,
                { x: -8 },
                { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)', repeat: 5, yoyo: true }
            )
        }
    }, [verdict])

    const isFake = verdict === 'FAKE'
    const color = isFake ? '#ff003c' : '#00ff88'
    const fakePctNum = avg_confidence
    const realPctNum = 1 - avg_confidence
    const max_conf = Math.max(fakePctNum, realPctNum)

    const displayTier = max_conf >= 0.8 ? 'HIGH' : max_conf >= 0.6 ? 'MODERATE' : 'BORDERLINE'

    const tierColor = displayTier === 'HIGH' ? '#00f5ff'
        : displayTier === 'MODERATE' ? '#f59e0b'
            : '#f97316'

    const fakePct = (fakePctNum * 100).toFixed(1)
    const realPct = (realPctNum * 100).toFixed(1)

    return (
        <motion.div
            ref={bannerRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="relative p-8 rounded-2xl text-center overflow-hidden"
            style={{
                background: `radial-gradient(ellipse at center, ${color}15 0%, transparent 70%)`,
                border: `2px solid ${color}50`,
                boxShadow: `0 0 60px ${color}25, inset 0 0 60px ${color}08`
            }}
        >
            {/* Animated background glow particles */}
            <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full"
                        style={{
                            background: color,
                            left: `${10 + i * 8}%`,
                            top: `${20 + (i % 4) * 20}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.4, 1, 0.4],
                            scale: [0.5, 1.2, 0.5],
                        }}
                        transition={{
                            duration: 2 + i * 0.2,
                            repeat: Infinity,
                            delay: i * 0.15,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                {/* Icon */}
                <motion.div
                    className="text-6xl mb-4"
                    animate={{ rotate: isFake ? [0, -5, 5, -5, 0] : [0, 5, -5, 5, 0] }}
                    transition={{ duration: 0.5, repeat: 2 }}
                >
                    {isFake ? '⚠️' : '✅'}
                </motion.div>

                {/* Verdict text */}
                <h2
                    className="text-6xl font-black tracking-wider mb-3"
                    style={{ color, textShadow: `0 0 40px ${color}` }}
                >
                    {verdict}
                </h2>

                {/* Confidence tier */}
                <div className="flex items-center justify-center gap-3 mt-4">
                    <span
                        className="text-sm font-bold px-4 py-1.5 rounded-full"
                        style={{
                            background: `${tierColor}18`,
                            border: `1px solid ${tierColor}50`,
                            color: tierColor
                        }}
                    >
                        {displayTier === 'HIGH' && '✓ '}
                        {displayTier === 'BORDERLINE' && '⚠ '}
                        {displayTier} CONFIDENCE
                    </span>
                    <span
                        className="text-sm px-4 py-1.5 rounded-full"
                        style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            color: 'var(--text-muted)'
                        }}
                    >
                        Ensemble determined <strong style={{ color }}>{verdict}</strong> with <span style={{ color: '#ff003c', fontWeight: 'bold' }}>{fakePct}% Fake</span> and <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{realPct}% Real</span> probability. <span style={{ color: '#ff003c', fontWeight: 'bold' }}>{votes_fake}/3 Fake</span> and <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{3 - votes_fake}/3 Real</span> votes.
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

/**
 * Summarizes the voting decisions for each model compactly.
 * @param {Object} props
 * @param {Object} props.convnext - Details for ConvNeXt model decision
 * @param {Object} props.xception - Details for XceptionNet model decision
 * @param {Object} props.resnext  - Details for ResNeXt model decision
 * @param {number} props.votes_fake - Total FAKE votes cast out of 3
 */
function VoteSummary({ convnext, xception, resnext, votes_fake }) {
    const models = [
        { name: 'ConvNeXt V2', data: convnext, icon: '🔷' },
        { name: 'XceptionNet', data: xception, icon: '🔮' },
        { name: 'ResNeXt-BiLSTM', data: resnext, icon: '⚡' },
    ]

    return (
        <div className="glass-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>
                Vote Summary
            </h3>
            <div className="flex items-center justify-center gap-6">
                {models.map(({ name, data, icon }, i) => {
                    const isFake = data?.label === 'FAKE'
                    const color = isFake ? '#ff003c' : '#00ff88'
                    return (
                        <motion.div
                            key={name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div
                                className="w-16 h-16 flex items-center justify-center rounded-full text-2xl"
                                style={{
                                    background: `${color}18`,
                                    border: `2px solid ${color}50`,
                                    boxShadow: `0 0 20px ${color}40`
                                }}
                            >
                                {icon}
                            </div>
                            <div className="text-xs font-semibold text-center" style={{ color: 'var(--text-muted)' }}>
                                {name}
                            </div>
                            <div
                                className="text-xs font-bold px-2 py-0.5 rounded-full"
                                style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}
                            >
                                {data?.label ?? 'N/A'}
                            </div>
                        </motion.div>
                    )
                })}
            </div>
            <p
                className="text-center mt-5 text-sm font-semibold"
                style={{ color: 'var(--text-muted)' }}
            >
                {votes_fake}/3 models voted <span style={{ color: '#ff003c' }}>FAKE</span>
                {' · '}
                {3 - votes_fake}/3 models voted <span style={{ color: '#00ff88' }}>REAL</span>
            </p>
        </div>
    )
}

/**
 * ResultsPanel aggregates all analytical output data once processing completes.
 * Incorporates models' sub-verdicts, confidence gauges, extracted frames,
 * and the final aggregated verdict.
 * @param {Object} props
 * @param {Object} props.results - The results payload from the backend API.
 */
export default function ResultsPanel({ results }) {
    if (!results) return null

    const { verdict, confidence_tier, avg_confidence, votes_fake, convnext, xception, resnext, frames } = results

    return (
        <section id="results" className="py-24 px-6 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#00f5ff' }}>
                    Analysis Complete
                </span>
                <h2 className="section-heading mt-3">Detection Results</h2>
            </motion.div>

            <div id="results-section" className="flex flex-col gap-8">
                {/* Verdict banner */}
                <div id="verdict-banner-container">
                    <VerdictBanner verdict={verdict} confidence_tier={confidence_tier} votes_fake={votes_fake} avg_confidence={avg_confidence} />
                </div>

                {/* Explanatory Block */}
                <div id="explanation-container" className="glass-card p-6 rounded-2xl" style={{ border: '1px solid var(--card-border)' }}>
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-color)' }}>Understanding Dual Confidence Scores</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Each model outputs two complementary scores: <strong style={{ color: '#00ff88' }}>Real Confidence</strong> (probability the video is authentic) and <strong style={{ color: '#ff003c' }}>Fake Confidence</strong> (probability it's manipulated). These always sum to 100%. A model votes <strong style={{ color: '#ff003c' }}>FAKE</strong> when its Fake Confidence exceeds the <strong>50% threshold</strong>. The final verdict uses <strong>majority voting</strong> — at least 2 of 3 models must agree. Below you'll see each model's individual breakdown.
                    </p>
                </div>

                {/* Gauge + Radar side-by-side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    <div id="gauge-container" className="h-full">
                        <ConfidenceGauge value={avg_confidence} />
                    </div>
                    <div id="radar-container" className="h-full">
                        <RadarChartComponent convnext={convnext} xception={xception} resnext={resnext} />
                    </div>
                </div>

                {/* Vote summary standalone */}
                <div id="vote-summary-container">
                    <VoteSummary convnext={convnext} xception={xception} resnext={resnext} votes_fake={votes_fake} />
                </div>

                {/* Model cards */}
                <div id="model-cards-container">
                    <h3 className="text-sm font-semibold uppercase tracking-widest mb-4 mt-4 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                        <span className="text-xl">📦</span> Individual Model Votes
                    </h3>
                    <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
                        Each model independently produces a <span style={{ color: '#00ff88' }}>Real confidence</span> and a <span style={{ color: '#ff003c' }}>Fake confidence</span> score (summing to 100%). If Fake confidence exceeds 50%, the model votes FAKE.
                    </p>
                    <ModelCards convnext={convnext} xception={xception} resnext={resnext} />
                </div>

                {/* Frame grid */}
                {frames && frames.length > 0 && <FrameGrid frames={frames} />}

                {/* PDF export */}
                <div className="pt-4">
                    <PDFExport results={results} />
                </div>
            </div>
        </section>
    )
}
