import { motion } from 'framer-motion'

function ModelCard({ name, data, index }) {
    const isFake = data?.label === 'FAKE'
    const probFake = data?.prob ?? 0.5
    const probReal = data?.prob_real ?? (1 - probFake)
    const color = isFake ? '#ff003c' : '#00ff88'
    const label = data?.label ?? 'N/A'

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="glass-card p-5 flex flex-col gap-4"
            style={{
                borderColor: `${color}30`,
                boxShadow: `0 0 20px ${color}15`
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                        {index === 0 ? 'Frame CNN' : index === 1 ? 'Frame CNN' : 'Temporal'}
                    </div>
                    <h3 className="text-lg font-bold text-white">{name}</h3>
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                    className="text-sm font-bold px-3 py-1.5 rounded-lg"
                    style={{
                        background: `${color}18`,
                        border: `1px solid ${color}50`,
                        color
                    }}
                >
                    {label}
                </motion.div>
            </div>

            {/* Prob bars */}
            <div className="flex flex-col gap-3">
                {/* Fake bar */}
                <div>
                    <div className="flex justify-between text-xs mb-1.5">
                        <span style={{ color: '#ff003c' }}>FAKE probability</span>
                        <span className="font-mono font-bold" style={{ color: '#ff003c' }}>
                            {(probFake * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div className="relative h-2.5 rounded-full" style={{ background: 'rgba(255,0,60,0.1)' }}>
                        <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${probFake * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
                            style={{
                                background: 'linear-gradient(90deg, #ff003c, #ff6b6b)',
                                boxShadow: '0 0 8px rgba(255,0,60,0.5)'
                            }}
                        />
                        {/* Threshold marker at 50% */}
                        <div
                            className="absolute top-0 bottom-0 w-0.5"
                            style={{ left: '50%', background: 'var(--text-muted)' }}
                        />
                    </div>
                </div>

                {/* Real bar */}
                <div>
                    <div className="flex justify-between text-xs mb-1.5">
                        <span style={{ color: '#00ff88' }}>REAL probability</span>
                        <span className="font-mono font-bold" style={{ color: '#00ff88' }}>
                            {(probReal * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div className="relative h-2.5 rounded-full" style={{ background: 'rgba(0,255,136,0.08)' }}>
                        <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${probReal * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.5, ease: 'easeOut' }}
                            style={{
                                background: 'linear-gradient(90deg, #00ff88, #00ffaa)',
                                boxShadow: '0 0 8px rgba(0,255,136,0.4)'
                            }}
                        />
                        <div
                            className="absolute top-0 bottom-0 w-0.5"
                            style={{ left: '50%', background: 'var(--text-muted)' }}
                        />
                    </div>
                </div>
            </div>

            {/* Decision explanation */}
            <p className="text-xs rounded-lg p-2.5"
                style={{ background: 'var(--card-bg)', color: 'var(--text-muted)' }}
            >
                Threshold: 0.50 · Fake prob {probFake > 0.5 ? '>' : '≤'} 0.50 → <strong style={{ color }}>{label}</strong>
            </p>
        </motion.div>
    )
}

export default function ModelCards({ convnext, xception, resnext }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ModelCard name="ConvNeXt V2" data={convnext} index={0} />
            <ModelCard name="XceptionNet" data={xception} index={1} />
            <ModelCard name="ResNeXt-BiLSTM" data={resnext} index={2} />
        </div>
    )
}
