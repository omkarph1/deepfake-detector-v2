import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FrameGrid({ frames = [] }) {
    const [selected, setSelected] = useState(null)

    if (!frames.length) return null

    return (
        <div className="glass-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(232,232,240,0.5)' }}>
                Extracted Face Frames ({frames.length})
            </h3>

            <div className="flex flex-row justify-between items-center gap-3">
                {frames.map((b64, i) => (
                    <motion.div
                        key={i}
                        className="frame-thumb relative rounded-xl overflow-hidden aspect-square flex-1"
                        style={{ border: '1px solid var(--card-border)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08, type: 'spring' }}
                        onClick={() => setSelected(i)}
                    >
                        <img
                            src={`data:image/jpeg;base64,${b64}`}
                            alt={`Frame ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            loading="lazy"
                        />
                        <div
                            className="absolute inset-0 flex items-end p-2 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                            style={{ background: 'linear-gradient(to top, rgba(0,245,255,0.6), transparent)' }}
                        >
                            <span className="text-xs text-white font-mono font-bold">FRAME {i + 1}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selected !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center p-6"
                        style={{ zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="relative max-w-lg w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <img
                                src={`data:image/jpeg;base64,${frames[selected]}`}
                                alt={`Frame ${selected + 1}`}
                                className="w-full rounded-xl"
                                style={{ border: '2px solid rgba(0,245,255,0.3)' }}
                            />
                            <div className="absolute top-3 right-3 flex gap-2">
                                <button
                                    onClick={() => setSelected(i => Math.max(0, i - 1))}
                                    className="text-white px-3 py-1 rounded-lg text-sm"
                                    style={{ background: 'rgba(0,0,0,0.6)' }}
                                    disabled={selected === 0}
                                >
                                    ‹
                                </button>
                                <span className="text-white text-sm px-3 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.6)' }}>
                                    {selected + 1}/{frames.length}
                                </span>
                                <button
                                    onClick={() => setSelected(i => Math.min(frames.length - 1, i + 1))}
                                    className="text-white px-3 py-1 rounded-lg text-sm"
                                    style={{ background: 'rgba(0,0,0,0.6)' }}
                                    disabled={selected === frames.length - 1}
                                >
                                    ›
                                </button>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="text-white px-3 py-1 rounded-lg text-sm"
                                    style={{ background: 'rgba(255,0,60,0.4)' }}
                                >
                                    ✕
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
