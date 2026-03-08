import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import HowItWorksPage from './HowItWorksPage';
import DetectPage from './DetectPage';
import ResultsPage from './ResultsPage';

export default function App() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    // Apply theme to body
    useEffect(() => {
        if (!isDarkMode) {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
    }, [isDarkMode]);

    return (
        <BrowserRouter>
            <div className="min-h-screen app-container flex flex-col">
                <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage isDarkMode={isDarkMode} />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/how-it-works" element={<HowItWorksPage />} />
                        <Route path="/detect" element={<DetectPage />} />
                        <Route path="/results" element={<ResultsPage />} />
                    </Routes>
                </main>

                {/* Footer */}
                <footer
                    className="text-center py-10 px-6 mt-auto"
                    style={{ borderTop: '1px solid var(--card-border)' }}
                >
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Powered by{' '}
                        <span style={{ color: '#00f5ff' }}>ConvNeXt V2</span>{' '}
                        +{' '}
                        <span style={{ color: '#bf00ff' }}>XceptionNet v3</span>{' '}
                        +{' '}
                        <span style={{ color: '#00ff88' }}>ResNeXt50-BiLSTM</span>
                    </p>
                    <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                        Threshold: 0.50 · TTA: 4 views · Frames: 15 · Majority voting
                    </p>
                </footer>
            </div>
        </BrowserRouter>
    );
}
