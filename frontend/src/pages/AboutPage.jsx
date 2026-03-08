import React from 'react';
import { motion } from 'framer-motion';
import About from '../components/About';

export default function AboutPage() {
    return (
        <div className="pt-24 pb-12 min-h-screen">
            <About />

            <div className="max-w-7xl mx-auto px-6 mt-16 flex flex-col gap-24">
                {/* SECTION A: The Problem */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-8">
                        <span className="text-sm font-semibold tracking-widest uppercase text-cyan-400">
                            The Challenge
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            The Arms Race Between Creation and Detection
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        <div className="p-8 rounded-xl border border-[var(--card-border)]" style={{ background: 'var(--card-bg)' }}>
                            <ul className="space-y-6">
                                <li>
                                    <strong className="text-cyan-400">1. Spatial Artifacts</strong>
                                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                                        Blending boundaries at face edges, inconsistent skin texture, jawline ghosting from face-swap alignment.
                                    </p>
                                </li>
                                <li>
                                    <strong className="text-purple-400">2. Frequency Artifacts</strong>
                                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                                        GAN/Diffusion fingerprints invisible to humans but detectable in DCT frequency space; distinct compression noise patterns.
                                    </p>
                                </li>
                                <li>
                                    <strong className="text-green-400">3. Temporal Artifacts</strong>
                                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                                        Unnatural eye blink rates, inconsistent lighting flicker between frames, motion blur mismatches across time.
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div className="p-8 rounded-xl border border-[var(--card-border)] flex flex-col justify-center gap-6" style={{ background: 'var(--card-bg)' }}>
                            <div className="p-4 rounded-lg border border-[var(--card-border)]" style={{ background: 'rgba(0,0,0,0.1)' }}>
                                <span className="text-3xl font-black" style={{ color: 'var(--text-color)' }}>84%</span>
                                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>of deepfake detectors fail on cross-dataset videos</p>
                            </div>
                            <div className="p-4 rounded-lg border border-[var(--card-border)]" style={{ background: 'rgba(0,0,0,0.1)' }}>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                    A single CNN misses <strong style={{ color: 'var(--text-color)' }}>temporal artifacts</strong> entirely
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-lg leading-relaxed max-w-4xl mx-auto" style={{ color: 'var(--text-muted)' }}>
                        No single architecture solves all three. This is why DeepGuard uses three specialized neural networks in parallel — each targeting a different artifact class — and only reaches a FAKE verdict when at least two agree.
                    </p>
                </motion.section>

                {/* SECTION B: Deep Dive */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-8">
                        <span className="text-sm font-semibold tracking-widest uppercase text-purple-400">
                            Architecture Deep Dive
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            How Each Model Thinks
                        </h2>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* ConvNeXt V2 */}
                        <div className="p-8 rounded-xl border border-[var(--card-border)] border-l-4 border-l-cyan-400" style={{ background: 'var(--card-bg)' }}>
                            <div className="flex flex-wrap items-center gap-3 justify-between mb-4">
                                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>ConvNeXt V2</h3>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)', color: 'var(--cyan)', borderColor: 'rgba(34, 211, 238, 0.3)' }}>Frame-level CNN</span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)', color: 'var(--cyan)', borderColor: 'rgba(34, 211, 238, 0.3)' }}>Spatial Analysis</span>
                                </div>
                            </div>
                            <ul className="space-y-3 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                                <li><strong style={{ color: 'var(--text-color)' }}>Architecture:</strong> Built on the ConvNeXt V2 base model (Meta AI, 2023). Uses depthwise convolutions with global response normalization (GRN) to capture spatial hierarchies.</li>
                                <li><strong style={{ color: 'var(--text-color)' }}>Training Strategy:</strong> 2-phase training — Phase 1: freeze backbone, train classification head for 5 epochs. Phase 2: unfreeze all layers, fine-tune with cosine LR decay (1e-5) for 20 epochs.</li>
                                <li><strong style={{ color: 'var(--text-color)' }}>Augmentation Pipeline:</strong> MixUp (α=0.4), CutMix (α=1.0), RandomHorizontalFlip, ColorJitter, GaussianBlur</li>
                                <li><strong style={{ color: 'var(--text-color)' }}>TTA:</strong> 4-view — original + horizontal flip + slight brightness (+15%) + slight contrast (+10%)</li>
                                <li><strong style={{ color: 'var(--cyan)' }}>Why it works:</strong> GRN layers suppress irrelevant feature activations, forcing the model to focus on boundary inconsistencies and texture anomalies typical of face-swap deepfakes</li>
                                <li><strong style={{ color: 'var(--red)' }}>Weakness:</strong> Struggles on temporally smooth deepfakes with no spatial artifacts (e.g., pure reenactment attacks)</li>
                            </ul>
                            <div className="flex flex-wrap gap-4 text-xs font-mono font-bold pt-4 border-t border-[var(--card-border)]" style={{ color: 'var(--text-muted)' }}>
                                <span>90.39% Accuracy</span> • <span>AUC 1.00</span> • <span>88.22M Parameters</span> • <span>Input: 224×224</span>
                            </div>
                        </div>

                        {/* XceptionNet v3 */}
                        <div className="p-8 rounded-xl border border-[var(--card-border)] border-l-4 border-l-purple-500" style={{ background: 'var(--card-bg)' }}>
                            <div className="flex flex-wrap items-center gap-3 justify-between mb-4">
                                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>XceptionNet v3</h3>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'rgba(191, 0, 255, 0.1)', color: 'var(--purple)', borderColor: 'rgba(191, 0, 255, 0.3)' }}>Frame-level CNN</span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'rgba(191, 0, 255, 0.1)', color: 'var(--purple)', borderColor: 'rgba(191, 0, 255, 0.3)' }}>Frequency Analysis</span>
                                </div>
                            </div>
                            <ul className="space-y-3 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                                <li><strong style={{ color: 'var(--text-color)' }}>Architecture:</strong> Modified Xception with depthwise separable convolutions replacing all standard convolutions. Significantly fewer parameters make it faster and less prone to overfitting on compression artifacts.</li>
                                <li><strong style={{ color: 'var(--text-color)' }}>Training Strategy:</strong> Same 2-phase approach with ReduceLROnPlateau scheduler (patience=3, factor=0.5). Uses label smoothing (ε=0.1) to prevent overconfident predictions on ambiguous compressed frames.</li>
                                <li><strong style={{ color: 'var(--text-color)' }}>Augmentation Pipeline:</strong> MixUp, CutMix, JPEG compression simulation (quality 60-95) to learn through compression noise</li>
                                <li><strong style={{ color: 'var(--text-color)' }}>TTA:</strong> Same 4-view augmentation set</li>
                                <li><strong style={{ color: 'var(--purple)' }}>Why it works:</strong> Depthwise separable convolutions are uniquely suited to detecting frequency-domain irregularities — the invisible noise patterns GAN generators leave in DCT coefficients</li>
                                <li><strong style={{ color: 'var(--red)' }}>Weakness:</strong> Less effective on high-quality, uncompressed deepfakes where GAN fingerprints are minimal</li>
                            </ul>
                            <div className="flex flex-wrap gap-4 text-xs font-mono font-bold pt-4 border-t border-[var(--card-border)]" style={{ color: 'var(--text-muted)' }}>
                                <span>87.96% Accuracy</span> • <span>AUC 0.98</span> • <span>21.86M Parameters</span> • <span>Input: 224×224</span>
                            </div>
                        </div>

                        {/* ResNeXt50-BiLSTM */}
                        <div className="p-8 rounded-xl border border-[var(--card-border)] border-l-4 border-l-green-400" style={{ background: 'var(--card-bg)' }}>
                            <div className="flex flex-wrap items-center gap-3 justify-between mb-4">
                                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>ResNeXt50-BiLSTM</h3>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'rgba(0, 255, 136, 0.1)', color: 'var(--green)', borderColor: 'rgba(0, 255, 136, 0.3)' }}>Temporal Sequence Model</span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'rgba(0, 255, 136, 0.1)', color: 'var(--green)', borderColor: 'rgba(0, 255, 136, 0.3)' }}>Motion Analysis</span>
                                </div>
                            </div>
                            <ul className="space-y-3 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                                <li><strong style={{ color: 'var(--text-color)' }}>Architecture:</strong> Hybrid model. ResNeXt50 CNN acts as a per-frame spatial feature extractor (outputs 2048-dim feature vectors). These vectors for all 15 frames are fed as a time series into a 2-layer Bidirectional LSTM (hidden=512, dropout=0.3). Final classification head: FC(1024 → 512 → 2).</li>
                                <li><strong style={{ color: 'var(--text-color)' }}>Why Bidirectional:</strong> A standard LSTM only processes frames forward in time. BiLSTM reads both forward AND backward, allowing it to detect anomalies that are only visible in context — e.g., a flicker in frame 8 that is inconsistent with frames 6 and 10.</li>
                                <li><strong style={{ color: 'var(--text-color)' }}>Training Strategy:</strong> 2-phase (freeze ResNeXt backbone first, then unfreeze), gradient clipping (max_norm=1.0) to prevent LSTM exploding gradients</li>
                                <li><strong style={{ color: 'var(--text-color)' }}>Input:</strong> Ordered sequence of 15 frames extracted at uniform video intervals by MTCNN</li>
                                <li><strong style={{ color: 'var(--green)' }}>Why it works:</strong> The only model that processes time. Catches temporal inconsistencies that are completely invisible when looking at individual frames in isolation</li>
                                <li><strong style={{ color: 'var(--red)' }}>Weakness:</strong> Requires at least 15 extractable frames; very short videos (&lt;2s) may reduce accuracy</li>
                            </ul>
                            <div className="flex flex-wrap gap-4 text-xs font-mono font-bold pt-4 border-t border-[var(--card-border)]" style={{ color: 'var(--text-muted)' }}>
                                <span>89.98% Accuracy</span> • <span>AUC 0.96</span> • <span>49.22M Parameters</span> • <span>Input: 15×224×224 sequence</span>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* SECTION C: Training & Benchmark */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-8">
                        <span className="text-sm font-semibold tracking-widest uppercase text-green-400">
                            Training Data
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            Built on the Industry's Hardest Benchmarks
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-xl border border-[var(--card-border)]" style={{ background: 'var(--card-bg)' }}>
                            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-color)' }}>FaceForensics++ C23</h3>
                            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                The gold standard deepfake benchmark. 1,000 original videos manipulated using 4 methods: DeepFakes, Face2Face, FaceSwap, NeuralTextures. C23 refers to the medium-compression encoding level — the hardest split.
                            </p>
                            <div className="flex flex-col gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                                <span>✓ 1,000 real + 4,000 fake videos</span>
                                <span>✓ H.264 C23 compression</span>
                                <span>✓ 4 manipulation methods</span>
                            </div>
                        </div>
                        <div className="p-8 rounded-xl border border-[var(--card-border)]" style={{ background: 'var(--card-bg)' }}>
                            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-color)' }}>Celeb-DF v2</h3>
                            <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                A high-quality celebrity deepfake dataset specifically designed to defeat existing detectors. Celeb-DF v2 deepfakes are visually indistinguishable from real videos, making it the ultimate stress test.
                            </p>
                            <div className="flex flex-col gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                                <span>✓ 590 real + 5,639 fake videos</span>
                                <span>✓ High visual quality</span>
                                <span>✓ Designed to fool detectors</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-6 rounded-xl border text-center" style={{ backgroundColor: 'rgba(0, 245, 255, 0.05)', borderColor: 'rgba(0, 245, 255, 0.2)' }}>
                        <p className="text-md sm:text-lg font-medium" style={{ color: 'var(--text-color)' }}>
                            DeepGuard was trained on 3,990 videos → 79,800 MTCNN-extracted frames (20 frames/video). The combined FF++ C23 + Celeb-DF v2 benchmark ensures it is robust to both compression artifacts AND high-quality visual manipulation.
                        </p>
                    </div>
                </motion.section>

                {/* SECTION D: Voting Logic */}
                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-8">
                        <span className="text-sm font-semibold tracking-widest uppercase text-orange-400">
                            The Verdict System
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            Why Majority Voting Beats Single Models
                        </h2>
                    </div>

                    <div className="p-8 rounded-xl border border-[var(--card-border)] mb-8 overflow-x-auto" style={{ background: 'var(--card-bg)' }}>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 min-w-[max-content] mx-auto">
                            <div className="px-6 py-4 rounded-lg border text-center" style={{ background: 'rgba(0,0,0,0.1)', borderColor: 'rgba(0, 245, 255, 0.3)' }}>
                                <p className="font-bold" style={{ color: 'var(--text-color)' }}>ConvNeXt V2</p>
                                <p className="font-mono text-sm mt-1" style={{ color: 'var(--green)' }}>REAL <span style={{ color: 'var(--text-muted)' }}>(33.7% fake)</span></p>
                            </div>
                            <div className="text-2xl animate-pulse hidden md:block" style={{ color: 'var(--text-muted)' }}>→</div>
                            <div className="text-2xl animate-pulse md:hidden" style={{ color: 'var(--text-muted)' }}>↓</div>
                            <div className="px-6 py-4 rounded-lg border text-center" style={{ background: 'rgba(0,0,0,0.1)', borderColor: 'rgba(191, 0, 255, 0.3)' }}>
                                <p className="font-bold" style={{ color: 'var(--text-color)' }}>XceptionNet</p>
                                <p className="font-mono text-sm mt-1" style={{ color: 'var(--green)' }}>REAL <span style={{ color: 'var(--text-muted)' }}>(49.6% fake)</span></p>
                            </div>
                            <div className="text-2xl animate-pulse hidden md:block" style={{ color: 'var(--text-muted)' }}>→</div>
                            <div className="text-2xl animate-pulse md:hidden" style={{ color: 'var(--text-muted)' }}>↓</div>
                            <div className="px-6 py-4 rounded-lg border text-center" style={{ background: 'rgba(0,0,0,0.1)', borderColor: 'rgba(255, 0, 60, 0.3)' }}>
                                <p className="font-bold" style={{ color: 'var(--text-color)' }}>ResNeXt-BiLSTM</p>
                                <p className="font-mono text-sm mt-1" style={{ color: 'var(--red)' }}>FAKE <span style={{ color: 'var(--text-muted)' }}>(61.6% fake)</span></p>
                            </div>
                            <div className="text-2xl animate-pulse hidden md:block" style={{ color: 'var(--text-muted)' }}>→</div>
                            <div className="text-2xl animate-pulse md:hidden" style={{ color: 'var(--text-muted)' }}>↓</div>
                            <div className="px-8 py-5 rounded-lg border text-center scale-110 ml-0 md:ml-4" style={{ backgroundColor: 'rgba(0, 255, 136, 0.1)', borderColor: 'var(--green)', boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)' }}>
                                <p className="font-black text-xl tracking-wider" style={{ color: 'var(--green)' }}>VERDICT: REAL</p>
                                <p className="text-sm mt-1 font-semibold" style={{ color: 'var(--text-color)' }}>2/3 voted REAL</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--card-border)] text-sm uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                    <th className="pb-4 pl-4 font-semibold">Tier</th>
                                    <th className="pb-4 px-4 font-semibold">Condition</th>
                                    <th className="pb-4 pr-4 font-semibold">Example</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="border-b border-[var(--card-border)]">
                                    <td className="py-4 pl-4 font-bold" style={{ color: 'var(--cyan)' }}>HIGH CONFIDENCE</td>
                                    <td className="py-4 px-4" style={{ color: 'var(--text-color)' }}>All 3 models agree</td>
                                    <td className="py-4 pr-4 font-mono" style={{ color: 'var(--text-muted)' }}>3/3 FAKE or 3/3 REAL</td>
                                </tr>
                                <tr className="border-b border-[var(--card-border)]">
                                    <td className="py-4 pl-4 font-bold text-amber-500">MODERATE CONFIDENCE</td>
                                    <td className="py-4 px-4" style={{ color: 'var(--text-color)' }}>2 models agree strongly</td>
                                    <td className="py-4 pr-4 font-mono" style={{ color: 'var(--text-muted)' }}>2/3 agree, fake prob &gt;65%</td>
                                </tr>
                                <tr>
                                    <td className="py-4 pl-4 font-bold text-orange-500">BORDERLINE</td>
                                    <td className="py-4 px-4" style={{ color: 'var(--text-color)' }}>2 models agree narrowly</td>
                                    <td className="py-4 pr-4 font-mono" style={{ color: 'var(--text-muted)' }}>2/3 agree, fake prob 50-60%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-8 text-center text-[15px] leading-relaxed max-w-4xl mx-auto" style={{ color: 'var(--text-muted)' }}>
                        This majority system prevents a single overconfident model from dominating the result. A borderline verdict is an honest signal — it means the video sits at the boundary of the model's training distribution and should be treated with caution.
                    </p>
                </motion.section>


            </div>
        </div>
    );
}
