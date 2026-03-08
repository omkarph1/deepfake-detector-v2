import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function ConfidenceGauge({ value = 0 }) {
    // SVG semicircle gauge
    const radius = 120
    const circumference = Math.PI * radius // half circle
    const offset = circumference * (1 - value)

    const pct = Math.round(value * 100)
    const color = value > 0.75 ? '#ff003c' : value > 0.55 ? '#f59e0b' : '#00ff88'

    const fakePct = (value * 100).toFixed(1)
    const realPct = ((1 - value) * 100).toFixed(1)

    return (
        <div className="glass-card p-6 flex flex-col items-center flex-1 h-full">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-xl">📊</span>
                <h3 className="text-lg font-bold text-white">Confidence Overview</h3>
            </div>

            <div className="relative mb-8 mt-4" style={{ width: 280, height: 160 }}>
                <svg
                    width="280"
                    height="160"
                    viewBox="0 0 280 160"
                >
                    {/* Background track */}
                    <path
                        d="M 20 140 A 120 120 0 0 1 260 140"
                        fill="none"
                        stroke="var(--card-border)"
                        strokeWidth="18"
                        strokeLinecap="round"
                    />
                    {/* Animated fill */}
                    <motion.path
                        d="M 20 140 A 120 120 0 0 1 260 140"
                        fill="none"
                        stroke={color}
                        strokeWidth="18"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                        style={{
                            filter: `drop-shadow(0 0 8px ${color})`
                        }}
                    />
                </svg>

                {/* Center value */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                    <motion.div
                        className="flex items-center gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black" style={{ color: '#ff003c' }}>{fakePct}%</span>
                            <span className="text-[10px] tracking-widest font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Fake</span>
                        </div>
                        <div className="h-8 w-px" style={{ background: 'var(--card-border)' }}></div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-black" style={{ color: '#00ff88' }}>{realPct}%</span>
                            <span className="text-[10px] tracking-widest font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Real</span>
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className="text-sm mb-10 font-bold tracking-wide" style={{ color: 'var(--text-color)' }}>Ensemble Confidence Split</div>

            {/* Real vs Fake explicit progress bars */}
            <div className="w-full flex justify-between text-sm font-bold mb-2">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: '#00ff88' }} />
                    <span style={{ color: 'var(--text-color)' }}>Real Confidence</span>
                </div>
                <span style={{ color: '#00ff88' }}>{realPct}%</span>
            </div>
            <div className="w-full h-2 rounded-full mb-6 overflow-hidden" style={{ background: 'var(--card-border)' }}>
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: '#00ff88' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${realPct}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                />
            </div>

            <div className="w-full flex justify-between text-sm font-bold mb-2">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: '#ff003c' }} />
                    <span style={{ color: 'var(--text-color)' }}>Fake Confidence</span>
                </div>
                <span style={{ color: '#ff003c' }}>{fakePct}%</span>
            </div>
            <div className="w-full h-2 rounded-full mb-6 overflow-hidden" style={{ background: 'var(--card-border)' }}>
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: '#ff003c' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${fakePct}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                />
            </div>

            <p className="text-xs text-center mt-2 px-4" style={{ color: 'var(--text-muted)' }}>
                Avg = (ConvNeXt + XceptionNet + ResNeXt) ÷ 3. Computed independently for each class.
            </p>
        </div>
    )
}
