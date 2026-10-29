import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUpForm() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set(k) { return (e) => setForm({ ...form, [k]: e.target.value }); }

  async function submit(e) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      await register(form);
      nav("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create account</h1>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input placeholder="Username (e.g. @you)" value={form.username}
        onChange={set("username")} required className="w-full border p-2 rounded" />
      <input placeholder="Display name" value={form.name}
        onChange={set("name")} className="w-full border p-2 rounded" />
      <input type="email" placeholder="Email" value={form.email}
        onChange={set("email")} required className="w-full border p-2 rounded" />
      <input type="password" placeholder="Password" value={form.password}
        onChange={set("password")} required className="w-full border p-2 rounded" />
      <button disabled={busy} className="w-full bg-black text-white p-2 rounded">
        {busy ? "Creating..." : "Create account"}
      </button>
      <p className="text-sm text-center">
        Have an account? <Link to="/signin" className="underline">Sign in</Link>
      </p>
    </form>
  );
}