import { useRef, useState } from "react";

export default function ImageDropzone({ value, onChange, label = "Image" }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || `Upload failed (${res.status})`);
      onChange(body.url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <span className="text-sm text-muted block mb-1">{label}</span>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
          dragging ? "border-accent bg-accent/10" : "border-border bg-surface"
        }`}
      >
        {value ? (
          <img src={value} alt="preview" className="max-h-48 mx-auto rounded" />
        ) : (
          <p className="text-sm text-muted">
            {uploading ? "Uploading…" : "Drag an image here, or click to choose a file"}
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {uploading && <p className="text-xs text-muted mt-1">Uploading…</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      <input
        className="mt-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image URL (e.g. /images/robot.jpg)"
      />
    </div>
  );
}