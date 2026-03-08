import { NavLink, Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

export default function Navbar({ isDarkMode, toggleTheme }) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 nav-header">
            <Link to="/" className="flex items-center gap-2 transition-transform hover:opacity-80">
                <span className="text-2xl font-black" style={{ color: 'var(--cyan)' }}>Deep</span>
                <span className="text-2xl font-black" style={{ color: 'var(--text-color)' }}>Guard</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold tag-badge">
                    AI
                </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
                {[
                    ['/', 'Home'],
                    ['/about', 'About'],
                    ['/how-it-works', 'How It Works'],
                    ['/detect', 'Detect'],
                ].map(([href, label]) => (
                    <NavLink
                        key={href}
                        to={href}
                        className={({ isActive }) =>
                            `text-sm font-medium transition-colors duration-200 nav-link ${isActive ? 'text-cyan-400 font-bold' : ''}`
                        }
                    >
                        {label}
                    </NavLink>
                ))}

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full transition-colors nav-theme-toggle flex items-center justify-center"
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <Link
                    to="/detect"
                    className="btn-neon text-sm py-2 px-4"
                >
                    Try Now
                </Link>
            </div>
        </nav>
    );
}
