import { useCallback, useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'

const STAGES = [
    { id: 0, label: 'Uploading' },
    { id: 1, label: 'Extracting Faces' },
    { id: 2, label: 'Running Models' },
    { id: 3, label: 'Model Labels' },
    { id: 4, label: 'Aggregating' },
    { id: 5, label: 'Complete' },
]

/**
 * UploadZone Component.
 * Handles drag-and-drop video uploads and manages the Server-Sent Events (SSE)
 * connection to the backend during model inference, displaying real-time
 * progress, logs, and stage updates.
 *
 * @param {Object} props
 * @param {Function} props.onResult - Callback triggered with analysis data when detection finishes.
 * @param {Function} props.onClear - Callback triggered when the current video is removed.
 */
export default function UploadZone({ onResult, onClear }) {
    const [file, setFile] = useState(null)
    const [videoUrl, setVideoUrl] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [currentStage, setCurrentStage] = useState(-1)
    const [progress, setProgress] = useState(0)
    const [logs, setLogs] = useState([])
    const [elapsed, setElapsed] = useState(0)
    const [modelLabels, setModelLabels] = useState(null)
    const logsRef = useRef(null)
    const timerRef = useRef(null)
    const startTimeRef = useRef(null)

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
            if (videoUrl) URL.revokeObjectURL(videoUrl)
        }
    }, [videoUrl])

    // Auto-scroll logs
    useEffect(() => {
        if (logsRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight
        }
    }, [logs])

    const addLog = (msg) => {
        const ts = new Date().toLocaleTimeString('en-US', { hour12: false })
        setLogs(prev => [...prev, { ts, msg }])
    }

    const onDrop = useCallback((accepted) => {
        if (accepted.length === 0) return
        const f = accepted[0]
        setFile(f)
        if (videoUrl) URL.revokeObjectURL(videoUrl)
        setVideoUrl(URL.createObjectURL(f))
        setLogs([])
        setCurrentStage(-1)
        setProgress(0)
        setElapsed(0)
        setModelLabels(null)
        onClear?.()
    }, [videoUrl, onClear])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'video/*': ['.mp4', '.avi', '.mov', '.webm', '.mkv'] },
        maxFiles: 1,
        disabled: isAnalyzing,
    })

    const clearFile = () => {
        setFile(null)
        if (videoUrl) URL.revokeObjectURL(videoUrl)
        setVideoUrl(null)
        setLogs([])
        setCurrentStage(-1)
        setProgress(0)
        setElapsed(0)
        setModelLabels(null)
        onClear?.()
    }

    /**
     * Main analysis function. Initiates the SSE connection via fetch
     * and streams incoming chunks to update the UI progressively.
     */
    const analyze = async () => {
        if (!file || isAnalyzing) return
        setIsAnalyzing(true)
        setLogs([])
        setCurrentStage(0)
        setProgress(0)
        setModelLabels(null)
        onClear?.()

        startTimeRef.current = Date.now()
        timerRef.current = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
        }, 1000)

        addLog('📤 Uploading video to server...')

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/detect', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`)
            }

            // Standard approach to read HTTP streams chunk-by-chunk in the browser
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                buffer += decoder.decode(value, { stream: true })
                const parts = buffer.split('\n\n')
                buffer = parts.pop()

                for (const part of parts) {
                    const lines = part.split('\n')
                    let eventType = 'message'
                    let data = ''
                    for (const line of lines) {
                        if (line.startsWith('event: ')) eventType = line.slice(7).trim()
                        if (line.startsWith('data: ')) data = line.slice(6).trim()
                    }
                    if (!data) continue

                    const parsed = JSON.parse(data)

                    // 'stage' events give partial update info (stage number, log message)
                    if (eventType === 'stage') {
                        setCurrentStage(parsed.stage)
                        setProgress(parsed.progress || 0)
                        addLog(`[Stage ${parsed.stage}] ${parsed.message}`)
                        if (parsed.model_labels) {
                            setModelLabels(parsed.model_labels)
                        }
                        // 'result' event delivers the final payload dict from the backend
                    } else if (eventType === 'result') {
                        clearInterval(timerRef.current)
                        setCurrentStage(5)
                        setProgress(100)
                        addLog('✅ Analysis complete!')
                        setIsAnalyzing(false)
                        onResult?.(parsed)
                    } else if (eventType === 'error') {
                        throw new Error(parsed.message)
                    }
                }
            }
        } catch (err) {
            clearInterval(timerRef.current)
            addLog(`❌ Error: ${err.message}`)
            setIsAnalyzing(false)
        }
    }

    const stageStatus = (id) => {
        if (currentStage > id) return 'done'
        if (currentStage === id) return 'active'
        return 'pending'
    }

    return (
        <section id="upload" className="py-24 px-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#00f5ff' }}>
                    Detection
                </span>
                <h2 className="section-heading mt-3">Upload &amp; Detect</h2>
                <p className="mt-4 text-lg" style={{ color: 'var(--text-muted)' }}>
                    Drop a video and let three neural networks analyze it for deepfake artifacts.
                </p>
            </motion.div>

            {/* Dropzone */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-6"
            >
                <div
                    {...getRootProps()}
                    className={`relative flex flex-col items-center justify-center p-12 rounded-2xl cursor-pointer transition-all duration-300 ${isDragActive ? 'dropzone-active' : 'neon-border-pulse'}`}
                    style={{
                        background: isDragActive ? 'rgba(0,245,255,0.05)' : 'var(--card-bg)',
                        border: '2px dashed rgba(0,245,255,0.3)',
                        minHeight: '200px'
                    }}
                >
                    <input {...getInputProps()} />
                    <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-4 text-center"
                            >
                                <motion.div
                                    animate={isDragActive ? { scale: 1.2 } : { scale: [1, 1.05, 1] }}
                                    transition={{ repeat: isDragActive ? 0 : Infinity, duration: 2 }}
                                    className="text-6xl"
                                >
                                    🎬
                                </motion.div>
                                <div>
                                    <p className="text-xl font-semibold text-white mb-2">
                                        {isDragActive ? 'Drop to analyze!' : 'Drop your video here or click to browse'}
                                    </p>
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                        Supports MP4, AVI, MOV, WebM — Max recommended: 100MB
                                    </p>
                                </div>
                                <div className="flex gap-3 mt-2">
                                    {['MP4', 'AVI', 'MOV', 'WebM'].map(ext => (
                                        <span
                                            key={ext}
                                            className="text-xs px-2 py-1 rounded-full font-mono"
                                            style={{ background: 'rgba(0,245,255,0.08)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.2)' }}
                                        >
                                            .{ext.toLowerCase()}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="file"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full flex flex-col items-center gap-4"
                            >
                                {videoUrl && (
                                    <video
                                        src={videoUrl}
                                        className="rounded-xl max-h-48 max-w-full"
                                        style={{ border: '1px solid rgba(0,245,255,0.2)' }}
                                        muted
                                        playsInline
                                        preload="metadata"
                                    />
                                )}
                                <div className="text-center">
                                    <p className="font-semibold text-white">{file.name}</p>
                                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                                        {(file.size / 1024 / 1024).toFixed(2)} MB · Click to change file
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Buttons */}
            <div className="flex gap-4 items-center justify-center mb-8">
                <button
                    className="btn-neon text-lg px-10 py-4"
                    onClick={analyze}
                    disabled={!file || isAnalyzing}
                >
                    {isAnalyzing ? (
                        <span className="flex items-center gap-2">
                            <span className="inline-block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                            Analyzing... {elapsed}s
                        </span>
                    ) : '🔍 Analyze Video'}
                </button>
                {file && !isAnalyzing && (
                    <button
                        onClick={clearFile}
                        className="text-sm px-4 py-2 rounded-lg"
                        style={{ background: 'rgba(255,0,60,0.1)', border: '1px solid rgba(255,0,60,0.3)', color: '#ff003c' }}
                    >
                        ✕ Clear
                    </button>
                )}
            </div>

            {/* Stage pills */}
            {isAnalyzing && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    {/* Progress bar */}
                    <div
                        className="w-full h-1 rounded-full mb-4"
                        style={{ background: 'var(--card-border)' }}
                    >
                        <div
                            className="progress-bar h-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {STAGES.map((s) => (
                            <span key={s.id} className={`stage-pill ${stageStatus(s.id)}`}>
                                {stageStatus(s.id) === 'done' && '✓'}
                                {stageStatus(s.id) === 'active' && (
                                    <span className="inline-block w-2 h-2 rounded-full bg-current animate-pulse" />
                                )}
                                {s.label}
                            </span>
                        ))}
                    </div>

                    {/* Model labels */}
                    {modelLabels && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-wrap gap-3 justify-center mt-2"
                        >
                            {Object.entries(modelLabels).map(([key, label]) => (
                                <span
                                    key={key}
                                    className="text-sm font-semibold px-3 py-1 rounded-lg"
                                    style={{
                                        background: label === 'FAKE' ? 'rgba(255,0,60,0.15)' : 'rgba(0,255,136,0.12)',
                                        border: `1px solid ${label === 'FAKE' ? 'rgba(255,0,60,0.4)' : 'rgba(0,255,136,0.3)'}`,
                                        color: label === 'FAKE' ? '#ff003c' : '#00ff88'
                                    }}
                                >
                                    {key === 'convnext' ? 'ConvNeXt' : key === 'xception' ? 'XceptionNet' : 'ResNeXt'}: {label}
                                </span>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Terminal log */}
            {logs.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="terminal p-4 max-h-44 overflow-y-auto"
                    ref={logsRef}
                >
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-2 mb-1">
                            <span style={{ color: 'rgba(0,245,255,0.4)', userSelect: 'none' }}>[{log.ts}]</span>
                            <span>{log.msg}</span>
                        </div>
                    ))}
                    {isAnalyzing && (
                        <div className="flex gap-1 mt-1">
                            <span style={{ color: 'rgba(0,245,255,0.4)' }}>›</span>
                            <span className="animate-pulse">_</span>
                        </div>
                    )}
                </motion.div>
            )}
        </section>
    )
}
