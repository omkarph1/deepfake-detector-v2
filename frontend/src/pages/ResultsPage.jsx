import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import ResultsPanel from '../components/ResultsPanel';

export default function ResultsPage() {
    const { state } = useLocation();
    const results = state?.results;

    if (!results) {
        return (
            <div className="pt-32 pb-12 min-h-screen flex flex-col items-center justify-center">
                <div
                    className="p-8 rounded-2xl text-center max-w-md w-full"
                    style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <div className="text-4xl mb-4">🔍</div>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
                        No Results Found
                    </h2>
                    <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
                        Please upload and analyze a video first to see detection results.
                    </p>
                    <Link
                        to="/detect"
                        className="btn-cyan text-sm py-3 px-6 rounded-full inline-block transition-transform hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, var(--cyan), #00aaff)',
                            color: '#fff',
                            fontWeight: 600,
                            boxShadow: '0 4px 15px rgba(0, 245, 255, 0.3)'
                        }}
                    >
                        Go to Detect
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 min-h-screen">
            <ResultsPanel results={results} />
        </div>
    );
}
