import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  async function handleLogout() {
    await logout();
    nav("/signin");
  }

  return (
    <header className="border-b-4 border-white bg-black sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center justify-between">
        
        {/* Left Icons */}
        <div className="flex items-center gap-6 text-xl">
          <Link to={user ? "/home" : "/"} className="hover:text-gray-400">[Home]</Link>
          <Link to="/search" className="hover:text-gray-400">[Search]</Link>
        </div>

        {/* Center Logo */}
        <Link to={user ? "/home" : "/"} className="font-logo text-3xl font-black tracking-widest uppercase">
          Momentum
        </Link>

        {/* Right Icons */}
        <div className="flex items-center gap-6 text-xl">
          {user ? (
            <>
              <Link to={`/profile/${encodeURIComponent(user.username)}`} className="hover:text-gray-400">
                [Profile]
              </Link>
              <button onClick={handleLogout} className="hover:text-gray-400">
                [Logout]
              </button>
            </>
          ) : (
            <Link to="/signin" className="btn text-lg py-1 px-4">log in</Link>
          )}
        </div>
      </div>
    </header>
  );
}