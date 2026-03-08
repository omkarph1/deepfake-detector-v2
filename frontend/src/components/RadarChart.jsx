import {
    RadarChart as RechartsRadar,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    ResponsiveContainer,
    Tooltip
} from 'recharts'

export default function RadarChartComponent({ convnext, xception, resnext }) {
    const data = [
        {
            model: 'ConvNeXt V2',
            fakeProb: parseFloat(((convnext?.prob ?? 0.5) * 100).toFixed(1)),
            realProb: parseFloat(((1 - (convnext?.prob ?? 0.5)) * 100).toFixed(1))
        },
        {
            model: 'XceptionNet',
            fakeProb: parseFloat(((xception?.prob ?? 0.5) * 100).toFixed(1)),
            realProb: parseFloat(((1 - (xception?.prob ?? 0.5)) * 100).toFixed(1))
        },
        {
            model: 'ResNeXt-BiLSTM',
            fakeProb: parseFloat(((resnext?.prob ?? 0.5) * 100).toFixed(1)),
            realProb: parseFloat(((1 - (resnext?.prob ?? 0.5)) * 100).toFixed(1))
        },
    ]

    return (
        <div className="glass-card p-6 flex-1 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">📊</span>
                <h3 className="text-lg font-bold text-white">Dual Confidence Radar</h3>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                Overlaid radar showing each model's Real (green) and Fake (red) confidence. The larger the area, the more confident the model.
            </p>
            <ResponsiveContainer width="100%" height={340}>
                <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="80%">
                    <PolarGrid stroke="var(--text-muted)" />
                    <PolarAngleAxis
                        dataKey="model"
                        tick={{ fill: 'var(--text-color)', fontSize: 12, fontFamily: 'Space Grotesk' }}
                    />
                    <Radar
                        name="Real Confidence"
                        dataKey="realProb"
                        stroke="#00ff88"
                        fill="#00ff88"
                        fillOpacity={0.15}
                        strokeWidth={2}
                        dot={{ fill: '#00ff88', r: 4, strokeWidth: 2, stroke: '#00ff88' }}
                    />
                    <Radar
                        name="Fake Confidence"
                        dataKey="fakeProb"
                        stroke="#ff003c"
                        fill="#ff003c"
                        fillOpacity={0.15}
                        strokeWidth={2}
                        dot={{ fill: '#ff003c', r: 4, strokeWidth: 2, stroke: '#ff003c' }}
                    />
                    <Tooltip
                        contentStyle={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '0.5rem',
                            color: 'var(--text-color)',
                            fontFamily: 'Space Grotesk',
                            fontSize: '0.85rem'
                        }}
                        formatter={(value, name) => [`${value}%`, name]}
                    />
                </RechartsRadar>
            </ResponsiveContainer>

            <div className="flex justify-center gap-6 mt-2 text-xs font-bold">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: '#00ff88' }} />
                    <span style={{ color: '#00ff88' }}>Real Confidence</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: '#ff003c' }} />
                    <span style={{ color: '#ff003c' }}>Fake Confidence</span>
                </div>
            </div>
        </div>
    )
}
