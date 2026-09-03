import React, { useState } from 'react';
import SignInForm from '../components/SignInForm.jsx';
import SignUpForm from '../components/SignUpForm.jsx';

function Splash() {
    const [view, setView] = useState('buttons'); // 'buttons' | 'signin' | 'signup'

    return (
        <div className="splash">
            <h1>MOMENTUM</h1>

            {view === 'buttons' && (
                <div className="splash-buttons">
                    <button onClick={() => setView('signup')}>Sign Up</button>
                    <button onClick={() => setView('signin')}>Log In</button>
                </div>
            )}

            {view === 'signup' && <SignUpForm />}
            {view === 'signin' && <SignInForm />}
        </div>
    );
}

export default Splash;