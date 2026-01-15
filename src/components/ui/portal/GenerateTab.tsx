import { useState } from "react";

interface GenerateTabProps {
  onGenerate: (prompt: string, image: File | null) => void;
}

export const GenerateTab = ({ onGenerate }: GenerateTabProps) => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt, image);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm font-bold uppercase text-neutral-400">
          Text Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your world..."
          rows={3}
          className="w-full border border-neutral-700 bg-neutral-900 px-4 py-3 font-mono text-white placeholder-neutral-600 focus:border-white focus:outline-none focus:ring-1 focus:ring-white resize-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-mono text-sm font-bold uppercase text-neutral-400">
          Upload Reference Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImage(e.target.files[0]);
            }
          }}
          className="w-full border border-neutral-700 bg-neutral-900 px-4 py-3 font-mono text-white text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700"
        />
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="w-full border border-white bg-white px-6 py-3 font-mono text-sm font-bold uppercase text-black transition-colors hover:bg-neutral-200"
        >
          Engage
        </button>
      </div>
    </form>
  );
};
