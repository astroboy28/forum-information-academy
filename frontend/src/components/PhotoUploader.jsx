import { useRef, useState } from "react";
import { uploadStudentPhoto } from "../api/students";

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function PhotoUploader({ studentId, photoUrl, fallbackLabel, onUploaded, size = 64 }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) return setError("Please choose a JPEG, PNG, or WebP image.");
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return setError(`Image must be under ${MAX_SIZE_MB}MB.`);

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const { data } = await uploadStudentPhoto(studentId, file);
      onUploaded?.(data);
    } catch {
      setError("Couldn't upload this photo. Please try again.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  const displayUrl = preview || photoUrl;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative rounded-full overflow-hidden"
        style={{ height: size, width: size }}
      >
        {displayUrl ? (
          <img src={displayUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-[var(--color-indigo-500)] text-white font-semibold" style={{ fontSize: size / 2.6 }}>
            {fallbackLabel}
          </div>
        )}
        {uploading && (
          <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
          </span>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={handleChange} />
      {error && <p className="text-xs text-[var(--color-danger-500)] max-w-[160px] text-center">{error}</p>}
    </div>
  );
}