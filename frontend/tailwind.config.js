/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-cyan': '#00f5ff',
                'neon-purple': '#bf00ff',
                'neon-red': '#ff003c',
                'neon-green': '#00ff88',
                'bg-dark': '#0a0a0f',
            },
            fontFamily: {
                'space': ['"Space Grotesk"', 'sans-serif'],
            },
            animation: {
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
                'glitch': 'glitch 0.3s ease-in-out infinite',
            },
            keyframes: {
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(0, 245, 255, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(0, 245, 255, 0.8)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
            backdropBlur: {
                md: '12px',
            },
        },
    },
    plugins: [],
}
