import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Splash from './pages/Splash.jsx';
import Home from './pages/Home.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PostPage from './pages/PostPage.jsx';

function RequireAuth({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/" replace />;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Splash />} />
                    <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
                    <Route path="/profile/:username" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                    <Route path="/post/:id" element={<RequireAuth><PostPage /></RequireAuth>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;