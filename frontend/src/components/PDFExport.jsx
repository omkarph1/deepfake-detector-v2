import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { motion } from 'framer-motion'

async function captureElement(elementId) {
    const el = document.getElementById(elementId)
    if (!el) return null
    try {
        const canvas = await html2canvas(el, {
            backgroundColor: '#0a0a0f',
            scale: 1.5,
            useCORS: true,
            logging: false
        })
        return {
            url: canvas.toDataURL('image/png'),
            w: canvas.width,
            h: canvas.height
        }
    } catch (err) {
        console.warn('html2canvas screenshot failed, proceeding without it:', err)
        return null
    }
}

export default function PDFExport({ results }) {
    const handleExport = async () => {
        if (!results) return

        const btn = document.getElementById('pdf-export-btn')
        if (btn) {
            btn.textContent = '⏳ Generating PDF...'
            btn.disabled = true
        }

        try {
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
            const pageW = 210
            const pageH = 297
            const margin = 15
            let yPos = margin

            // ── Helper draw functions ──────────────────────────────────────────────
            const addText = (txt, x, y, opts = {}) => {
                pdf.setTextColor(opts.color || '#e8e8f0')
                pdf.setFontSize(opts.size || 11)
                pdf.setFont('helvetica', opts.bold ? 'bold' : 'normal')
                pdf.text(txt, x, y)
            }

            const drawRect = (x, y, w, h, color) => {
                pdf.setFillColor(...hexToRgb(color))
                pdf.rect(x, y, w, h, 'F')
            }

            const hexToRgb = (hex) => {
                const r = parseInt(hex.slice(1, 3), 16)
                const g = parseInt(hex.slice(3, 5), 16)
                const b = parseInt(hex.slice(5, 7), 16)
                return [r, g, b]
            }

            // ── Cover page ─────────────────────────────────────────────────────────
            drawRect(0, 0, pageW, pageH, '#0a0a0f')

            // Title bar
            drawRect(0, 0, pageW, 40, '#0d1117')
            pdf.setTextColor(0, 245, 255)
            pdf.setFontSize(22)
            pdf.setFont('helvetica', 'bold')
            pdf.text('DEEPGUARD', margin, 25)
            pdf.setFontSize(11)
            pdf.setTextColor(150, 150, 170)
            pdf.text('AI Deepfake Detection Report', margin, 34)

            // Date / time
            const now = new Date()
            pdf.setFontSize(9)
            pdf.setTextColor(100, 100, 120)
            pdf.text(`Generated: ${now.toLocaleString()}`, pageW - margin, 25, { align: 'right' })

            yPos = 55

            // Generic sequential snapshot engine to perfectly mimic the web UI's layout sequence
            const addCapturedSection = async (id, currentY) => {
                const img = await captureElement(id)
                if (!img) return currentY

                const maxW = pageW - 2 * margin
                let finalH = (img.h / img.w) * maxW
                let finalW = maxW

                // If a single image is taller than the page, scale it down proportionally
                if (finalH > (pageH - 2 * margin)) {
                    const scaleDown = (pageH - 2 * margin) / finalH
                    finalH = finalH * scaleDown
                    finalW = maxW * scaleDown
                }

                if (currentY + finalH > pageH - margin) {
                    pdf.addPage()
                    drawRect(0, 0, pageW, pageH, '#0a0a0f')
                    currentY = margin
                }

                const xOffset = margin + (maxW - finalW) / 2
                pdf.addImage(img.url, 'PNG', xOffset, currentY, finalW, finalH)
                return currentY + finalH + 10
            }

            // Capture all core components in exact UI sequence:
            yPos = await addCapturedSection('verdict-banner-container', yPos)
            yPos = await addCapturedSection('explanation-container', yPos)
            yPos = await addCapturedSection('gauge-container', yPos)
            yPos = await addCapturedSection('radar-container', yPos)
            yPos = await addCapturedSection('vote-summary-container', yPos)
            yPos = await addCapturedSection('model-cards-container', yPos)

            // Pipeline & Formula appendix (Printed as native text for clarity)
            if (yPos + 80 > pageH - margin) {
                pdf.addPage()
                drawRect(0, 0, pageW, pageH, '#0a0a0f')
                yPos = margin
            }

            // Pipeline stages
            pdf.setFontSize(12)
            pdf.setFont('helvetica', 'bold')
            pdf.setTextColor(0, 245, 255)
            pdf.text('Processing Pipeline', margin, yPos)
            yPos += 7
            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(9)
            pdf.setTextColor(150, 150, 170)
            const stages = results.processing_stages || []
            stages.forEach((s, i) => {
                pdf.text(`${i + 1}. ${s}`, margin + 3, yPos)
                yPos += 6
            })

            // Formula explanation
            yPos += 5
            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'bold')
            pdf.setTextColor(0, 245, 255)
            pdf.text('Aggregation Formula', margin, yPos)
            yPos += 6
            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(9)
            pdf.setTextColor(150, 150, 170)
            pdf.text('verdict = "FAKE" if votes_fake ≥ 2 else "REAL"', margin + 3, yPos)
            yPos += 5
            pdf.text('avg_fake_prob = (prob_cn + prob_xc + prob_rn) / 3', margin + 3, yPos)
            yPos += 5
            pdf.text('avg_real_prob = 1 - avg_fake_prob', margin + 3, yPos)
            yPos += 5
            pdf.text('HIGH: all agree + avg_fake > 0.80 | MODERATE: 2/3 agree + 0.55–0.80 | BORDERLINE: avg_fake < 0.55', margin + 3, yPos)

            // Frames page
            if (results.frames && results.frames.length > 0) {
                pdf.addPage()
                drawRect(0, 0, pageW, pageH, '#0a0a0f')
                pdf.setTextColor(0, 245, 255)
                pdf.setFontSize(14)
                pdf.setFont('helvetica', 'bold')
                pdf.text('Extracted Face Frames', margin, 20)

                let fx = margin
                let fy = 30
                const fSize = (pageW - 2 * margin - 15) / 4
                let col = 0

                for (const b64 of results.frames.slice(0, 12)) {
                    try {
                        pdf.addImage(`data:image/jpeg;base64,${b64}`, 'JPEG', fx, fy, fSize, fSize)
                    } catch (_) { }
                    fx += fSize + 5
                    col++
                    if (col === 4) {
                        col = 0
                        fx = margin
                        fy += fSize + 5
                    }
                }
            }

            // Footer on every page
            const totalPages = pdf.getNumberOfPages()
            for (let p = 1; p <= totalPages; p++) {
                pdf.setPage(p)
                pdf.setTextColor(60, 60, 80)
                pdf.setFontSize(7)
                pdf.text(
                    'Powered by ConvNeXt V2 + XceptionNet v3 + ResNeXt50-BiLSTM  |  Threshold: 0.50  |  TTA: 4 views  |  Frames: 15',
                    pageW / 2,
                    pageH - 6,
                    { align: 'center' }
                )
                pdf.text(`Page ${p} / ${totalPages}`, pageW - margin, pageH - 6, { align: 'right' })
            }

            pdf.save(`deepguard-report-${Date.now()}.pdf`)
        } catch (err) {
            console.error('PDF export failed:', err)
            alert('PDF Export Encountered an Error: ' + err.message)
        } finally {
            if (btn) {
                // Restore button state
                btn.textContent = '📄 Download PDF Report'
                btn.disabled = false
            }
        }
    }

    return (
        <motion.button
            id="pdf-export-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExport}
            className="btn-purple flex items-center gap-2 mx-auto"
            style={{
                boxShadow: '0 0 20px rgba(191,0,255,0.4)',
                fontSize: '1rem',
                padding: '0.85rem 2.5rem'
            }}
        >
            📄 Download PDF Report
        </motion.button>
    )
}
