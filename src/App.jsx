import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import PrivateRoute from './components/routing/PrivateRoute';
import { Toaster } from 'react-hot-toast';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Freelancers from './pages/Freelancers';
import FreelancerProfile from './pages/FreelancerProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfileCompletion from './pages/ProfileCompletion';
import Messaging from './pages/Messaging';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Routes that show the sidebar
const SIDEBAR_PATHS = ['/dashboard', '/messages', '/settings'];

const ProfileRedirect = () => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500" /></div>;
    if (!user) return <Navigate to="/login" />;
    return <Navigate to={`/freelancers/${user.id || user._id}`} />;
};

// Layout wrapper that injects sidebar on dashboard routes
const AppLayout = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const showSidebar = user && SIDEBAR_PATHS.some(p => location.pathname.startsWith(p));

    return (
        <div className="flex flex-col min-h-screen" style={{ background: 'var(--gradient-main)' }}>
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                {showSidebar && (
                    <div className="hidden md:flex flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
                        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
                    </div>
                )}
                <main className="flex-1 overflow-auto">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:id" element={<ProjectDetails />} />
                        <Route path="/freelancers" element={<Freelancers />} />
                        <Route path="/freelancers/:id" element={<FreelancerProfile />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/complete-profile" element={
                            <PrivateRoute requireComplete={false}><ProfileCompletion /></PrivateRoute>
                        } />
                        <Route path="/profile" element={
                            <PrivateRoute><ProfileRedirect /></PrivateRoute>
                        } />
                        <Route path="/dashboard" element={
                            <PrivateRoute><Dashboard /></PrivateRoute>
                        } />
                        <Route path="/messages" element={
                            <PrivateRoute><Messaging /></PrivateRoute>
                        } />
                        <Route path="/messages/:userId" element={
                            <PrivateRoute><Messaging /></PrivateRoute>
                        } />
                        <Route path="/settings" element={
                            <PrivateRoute><Settings /></PrivateRoute>
                        } />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <DarkModeProvider>
            <AuthProvider>
                <Router>
                    <AppLayout />
                    <Toaster position="top-right" toastOptions={{
                        style: { background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }
                    }} />
                </Router>
            </AuthProvider>
        </DarkModeProvider>
    );
}

export default App;
