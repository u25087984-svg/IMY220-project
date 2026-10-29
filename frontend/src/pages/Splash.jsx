import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Splash() {
  const { user } = useAuth();

  return (
    // 1. Relative container
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* 2. glitch_sky.jpg background (z-0) */}
      <div className="absolute inset-0 z-0 bg-[url('/glitch_sky.jpg')] bg-cover bg-center"></div>
      
      {/* 3. glitch_gif.gif overlay (z-10) - change opacity-30 to make it more/less transparent */}
      <div className="absolute inset-0 z-10 bg-[url('/glitch_gif.gif')] bg-cover bg-center opacity-30 pointer-events-none mix-blend-screen"></div>
      
      {/* 4. UI Components (z-20) so they sit on top */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full">
        <h1 className="font-logo text-5xl md:text-7xl font-black tracking-widest uppercase mb-12">
          Momentum
        </h1>

        <div className="mb-12 w-32 h-32 flex items-center justify-center text-4xl">
                  <img src="/save-icon.png" alt="Save Icon" className="mb-12 w-32 h-32 object-contain" />
        </div>

        <div className="flex flex-col gap-4 w-full max-w-[280px]">
          {user ? (
            <Link to="/home" className="btn text-2xl py-2">go to feed</Link>
          ) : (
            <>
              <Link to="/signup" className="btn text-2xl py-2">sign up</Link>
              <Link to="/signin" className="btn text-2xl py-2">log in</Link>
            </>
          )}
        </div>
      </div>

    </div>
  );
}