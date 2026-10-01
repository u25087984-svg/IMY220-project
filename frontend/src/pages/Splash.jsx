import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import SignInForm from '../components/SignInForm.jsx';
import SignUpForm from '../components/SignUpForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function Splash() {
    const [view, setView] = useState('buttons'); // 'buttons' | 'signin' | 'signup'
    const { user } = useAuth();

    if (user) return <Navigate to="/home" replace />;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-6 text-center">
            <h1 className="text-4xl font-bold uppercase tracking-[0.4em]">Momentum</h1>

            {view === 'buttons' && (
                <div className="flex w-52 flex-col gap-4">
                    <button className="btn" onClick={() => setView('signup')}>Sign Up</button>
                    <button className="btn" onClick={() => setView('signin')}>Log In</button>
                </div>
            )}

            {view === 'signup' && <SignUpForm />}
            {view === 'signin' && <SignInForm />}

            {view !== 'buttons' && (
                <button className="text-sm underline hover:text-accent" onClick={() => setView('buttons')}>
                    Back
                </button>
            )}
        </div>
    );
}

export default Splash;