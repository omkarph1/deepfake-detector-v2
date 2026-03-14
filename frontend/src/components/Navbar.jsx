import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar({ isDarkMode, toggleTheme }) {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Close sidebar when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    // Prevent scrolling when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const navLinks = [
        ['/', 'Home'],
        ['/about', 'About'],
        ['/how-it-works', 'How It Works'],
        ['/detect', 'Detect'],
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 nav-header">
            <Link to="/" className="flex items-center gap-2 transition-transform hover:opacity-80">
                <span className="text-xl md:text-2xl font-black" style={{ color: 'var(--cyan)' }}>Deep</span>
                <span className="text-xl md:text-2xl font-black" style={{ color: 'var(--text-color)' }}>Guard</span>
                <span className="ml-2 text-[10px] md:text-xs px-2 py-0.5 rounded-full font-semibold tag-badge">
                    AI
                </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
                {navLinks.map(([href, label]) => (
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

            {/* Mobile Menu Button */}
            <button
                className="md:hidden p-2 text-current z-[60]"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Sidebar Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Mobile Sidebar */}
            <div 
                className={`fixed top-0 right-0 bottom-0 w-3/4 max-w-sm z-[58] transition-transform duration-300 ease-in-out md:hidden shadow-2xl flex flex-col p-8 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ 
                    background: isDarkMode ? 'var(--bg)' : '#e0f2fe', // lightblue (sky-100)
                    borderLeft: `1px solid ${isDarkMode ? 'var(--card-border)' : 'rgba(0,0,0,0.1)'}`
                }}
            >
                <div className="flex flex-col gap-8 mt-16">
                    {navLinks.map(([href, label]) => (
                        <NavLink
                            key={href}
                            to={href}
                            className={({ isActive }) =>
                                `text-lg font-bold transition-all ${isActive ? 'text-cyan-500 pl-2 border-l-4 border-cyan-500' : 'text-current opacity-70 hover:opacity-100'}`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                    
                    <hr className="opacity-10" />

                    <div className="flex items-center justify-between">
                        <span className="font-medium opacity-70">Theme</span>
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-full nav-theme-toggle flex items-center justify-center"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    <Link
                        to="/detect"
                        className="btn-neon text-center py-3 px-6 mt-4"
                    >
                        Try Now
                    </Link>
                </div>

                <div className="mt-auto text-center opacity-30 text-xs">
                    DeepGuard AI © 2026
                </div>
            </div>
        </nav>
    );
}
