import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Code2, Home, Briefcase, Users, LayoutDashboard, LogOut, LogIn, UserPlus, Sun, Moon, Info, Mail } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import NotificationBell from '../common/NotificationBell';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { dark, toggle } = useDarkMode();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => { logout(); navigate('/'); setIsOpen(false); };
    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon: Icon, label }) => (
        <Link to={to} onClick={() => setIsOpen(false)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive(to) ? 'bg-white/20 text-white' : 'text-sky-100 hover:text-white hover:bg-white/10'
            }`}>
            <Icon className="h-4 w-4" />{label}
        </Link>
    );

    const MobileLink = ({ to, icon: Icon, label }) => (
        <Link to={to} onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(to) ? 'bg-white/20 text-white' : 'text-sky-100 hover:text-white hover:bg-white/10'
            }`}>
            <Icon className="h-5 w-5" />{label}
        </Link>
    );

    return (
        <nav className="nav-gradient shadow-lg sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl flex-shrink-0">
                        <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Code2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="hidden sm:block">FreelanceHub</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/" icon={Home} label="Home" />
                        <NavLink to="/about" icon={Info} label="About" />
                        <NavLink to="/contact" icon={Mail} label="Contact" />
                        {(user?.role === 'client' || !user) && <NavLink to="/freelancers" icon={Users} label="Hire Talent" />}
                        {(user?.role === 'freelancer' || !user) && <NavLink to="/projects" icon={Briefcase} label="Find Work" />}
                        {user && <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />}
                    </div>

                    {/* Desktop Right */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Dark mode toggle */}
                        <button onClick={toggle} aria-label="Toggle dark mode"
                            className="p-2 rounded-lg text-sky-100 hover:text-white hover:bg-white/10 transition-colors">
                            {dark ? <Sun className="h-4.5 w-4.5" style={{width:'1.125rem',height:'1.125rem'}} /> : <Moon className="h-4.5 w-4.5" style={{width:'1.125rem',height:'1.125rem'}} />}
                        </button>

                        {user ? (
                            <>
                                <NotificationBell />
                                <span className="text-xs text-sky-100 bg-white/15 px-2.5 py-1 rounded-full capitalize border border-white/20">
                                    {user.role}
                                </span>
                                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <button onClick={handleLogout}
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 bg-white hover:bg-sky-50 px-3 py-1.5 rounded-lg shadow-sm transition-colors">
                                    <LogOut className="h-4 w-4" />Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login"
                                    className="inline-flex items-center gap-1.5 text-sky-100 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10">
                                    <LogIn className="h-4 w-4" />Log in
                                </Link>
                                <Link to="/register"
                                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 bg-white hover:bg-sky-50 px-4 py-2 rounded-lg shadow-sm transition-colors">
                                    <UserPlus className="h-4 w-4" />Sign up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile right */}
                    <div className="md:hidden flex items-center gap-2">
                        <button onClick={toggle} className="p-2 rounded-lg text-sky-100 hover:bg-white/10">
                            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        {user && <NotificationBell />}
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg text-sky-100 hover:text-white hover:bg-white/10 transition-colors">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-white/10" style={{ background: 'linear-gradient(180deg,#0369a1 0%,#0284c7 100%)' }}>
                    <div className="px-4 py-3 space-y-1">
                        <MobileLink to="/" icon={Home} label="Home" />
                        <MobileLink to="/about" icon={Info} label="About" />
                        <MobileLink to="/contact" icon={Mail} label="Contact" />
                        {(user?.role === 'client' || !user) && <MobileLink to="/freelancers" icon={Users} label="Hire Talent" />}
                        {(user?.role === 'freelancer' || !user) && <MobileLink to="/projects" icon={Briefcase} label="Find Work" />}
                        {user && <MobileLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />}
                    </div>
                    <div className="px-4 py-3 border-t border-white/10 space-y-2">
                        {user ? (
                            <button onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-sky-100 hover:text-white hover:bg-white/10 transition-all">
                                <LogOut className="h-5 w-5" />Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white bg-white/15 hover:bg-white/20 transition-all">
                                    <LogIn className="h-5 w-5" />Log in
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-sky-700 bg-white hover:bg-sky-50 transition-all">
                                    <UserPlus className="h-5 w-5" />Sign up free
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
