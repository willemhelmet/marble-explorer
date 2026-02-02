import { useState } from "react";

interface ConnectTabProps {
  onCancel: () => void;
  onSubmit: (url: string) => void;
  initialUrl?: string;
}

export const ConnectTab = ({
  onCancel,
  onSubmit,
  initialUrl = "",
}: ConnectTabProps) => {
  const [urlInput, setUrlInput] = useState(initialUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onSubmit(urlInput);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="marble-url"
          className="font-mono text-sm font-bold uppercase text-neutral-400"
        >
          Marble URL
        </label>
        <input
          id="marble-url"
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://marble.worldlabs.ai/world/..."
          className="w-full border border-neutral-700 bg-neutral-900 px-4 py-3 font-mono text-white placeholder-neutral-600 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
        />
      </div>

      <div className="mt-4 flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-neutral-600 bg-black px-6 py-3 font-mono text-sm font-bold uppercase text-white transition-colors hover:bg-neutral-900"
        >
          Abort
        </button>
        <button
          type="submit"
          className="flex-1 border border-white bg-white px-6 py-3 font-mono text-sm font-bold uppercase text-black transition-colors hover:bg-neutral-200 disabled:opacity-50"
          disabled={!urlInput.trim()}
        >
          Engage
        </button>
      </div>
    </form>
  );
};
