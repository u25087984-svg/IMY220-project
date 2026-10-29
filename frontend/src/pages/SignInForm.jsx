import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignInForm() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      await login(email, password);
      nav("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)}
        required className="w-full border p-2 rounded"
      />
      <input
        type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)}
        required className="w-full border p-2 rounded"
      />
      <button disabled={busy} className="w-full bg-black text-white p-2 rounded">
        {busy ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-sm text-center">
        No account? <Link to="/signup" className="underline">Sign up</Link>
      </p>
    </form>
  );
}