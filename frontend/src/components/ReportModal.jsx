import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function ReportModal({ postId, onClose }) {
  const [reasons, setReasons] = useState([]);
  const [reasonId, setReasonId] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.get("/reports/reasons").then(setReasons).catch((e) => setError(e.message));
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post(`/reports/post/${postId}`, { reasonId: Number(reasonId) });
      setDone(true);
      setTimeout(onClose, 800);
    } catch (err) { setError(err.message); }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={submit} className="bg-white p-4 rounded max-w-sm w-full space-y-3">
        <h3 className="text-lg font-bold">Report post</h3>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {done ? <p>Reported. Thanks!</p> : (
          <>
            <select value={reasonId} onChange={(e) => setReasonId(e.target.value)} required
              className="w-full border p-2 rounded">
              <option value="">Select reason...</option>
              {reasons.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
              <button className="px-3 py-1 bg-black text-white rounded">Submit</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}