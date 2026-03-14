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
        <>
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

                {/* Mobile Menu Button - Hamburger only, X will be inside sidebar */}
                <button
                    className={`md:hidden p-2 text-current transition-opacity duration-200 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                    onClick={() => setIsOpen(true)}
                    aria-label="Open Menu"
                >
                    <Menu size={28} />
                </button>
            </nav>

            {/* Mobile Sidebar Overlay */}
            <div 
                className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[60] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Mobile Sidebar Container */}
            <div 
                className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] z-[70] transition-transform duration-300 ease-in-out md:hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ 
                    backgroundColor: isDarkMode ? '#0a0a0f' : '#e0f2fe',
                    color: isDarkMode ? '#ffffff' : '#0f172a',
                    opacity: 1
                }}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-6 border-b border-current/5">
                    <span className="font-bold text-lg opacity-50 uppercase tracking-widest text-xs">Menu</span>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-current/10 rounded-full transition-colors"
                        aria-label="Close Menu"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Links Container */}
                <div className="flex flex-col gap-6 p-8 overflow-y-auto">
                    {navLinks.map(([href, label]) => (
                        <NavLink
                            key={href}
                            to={href}
                            className={({ isActive }) =>
                                `text-2xl font-bold transition-all ${isActive ? 'text-cyan-500 pl-4 border-l-4 border-cyan-500' : 'opacity-70 hover:opacity-100'}`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                    
                    <div className="h-px bg-current/10 my-4" />

                    <div className="flex items-center justify-between p-2">
                        <span className="font-medium opacity-70 text-lg">Theme</span>
                        <button
                            onClick={toggleTheme}
                            className="p-4 rounded-2xl bg-current/5 border border-current/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                            {isDarkMode ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-blue-600" />}
                        </button>
                    </div>

                    <Link
                        to="/detect"
                        className="btn-neon text-center py-4 px-6 mt-6 text-lg shadow-xl"
                        onClick={() => setIsOpen(false)}
                    >
                        Try Now
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-auto p-8 text-center opacity-30 text-[10px] border-t border-current/5">
                    DEEPGUARD AI © 2026 • SECURE DETECTION
                </div>
            </div>
        </>
    );
}
