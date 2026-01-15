import { useState } from "react";

interface ManageTabProps {
  onDelete: () => void;
}

export const ManageTab = ({ onDelete }: ManageTabProps) => {
  const [isConfirming, setIsConfirming] = useState(false);

  if (isConfirming) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="font-mono text-white text-lg">Are you sure?</p>
        <div className="flex gap-4">
          <button
            onClick={() => setIsConfirming(false)}
            className="flex-1 border border-neutral-600 bg-black px-6 py-3 font-mono text-sm font-bold uppercase text-white transition-colors hover:bg-neutral-900"
          >
            No
          </button>
          <button
            onClick={onDelete}
            className="flex-1 border border-red-500 bg-red-900/20 px-6 py-3 font-mono text-sm font-bold uppercase text-red-500 transition-colors hover:bg-red-900/40"
          >
            Yes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => setIsConfirming(true)}
        className="w-full border border-red-500 bg-black px-6 py-3 font-mono text-sm font-bold uppercase text-red-500 transition-colors hover:bg-red-900/20"
      >
        Delete Portal
      </button>
    </div>
  );
};
