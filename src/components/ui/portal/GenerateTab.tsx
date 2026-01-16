import { useState } from "react";
import { generateWorld } from "../../../services/apiService";
import { useMyStore } from "../../../store/store";

interface GenerateTabProps {
  onEngaged: (operationId: string) => void;
  onCancel: () => void;
}

export const GenerateTab = ({ onEngaged, onCancel }: GenerateTabProps) => {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const apiKey = useMyStore((state) => state.apiKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("Initiating generation...");

    try {
      const op = await generateWorld(
        {
          prompt,
          image: image || undefined,
        },
        apiKey,
      );

      console.log("Generate World Operation started:", op.operation_id);
      onEngaged(op.operation_id);
    } catch (error: unknown) {
      console.error("Error generating world:", error);
      setIsLoading(false);
      setStatus(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
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

      {status && (
        <div className="font-mono text-xs uppercase text-neutral-400">
          {status}
        </div>
      )}

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
          disabled={isLoading}
          className="flex-1 border border-white bg-white px-6 py-3 font-mono text-sm font-bold uppercase text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-600 disabled:border-neutral-600"
        >
          {isLoading ? "Engaging..." : "Engage"}
        </button>
      </div>
    </form>
  );
};
