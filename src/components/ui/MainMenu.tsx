import { useState, useMemo } from "react";
import { useMyStore } from "../../store/store.ts";
import { Instructions } from "./Instructions.tsx";
import { ApiInput } from "./ApiInput.tsx";

export const MainMenu = () => {
  const isMobile = useMyStore((state) => state.isMobile);
  const start = useMyStore((state) => state.start);
  const apiKey = useMyStore((state) => state.apiKey);
  const setApiKey = useMyStore((state) => state.setApiKey);

  const [inputKey, setInputKey] = useState(apiKey || "");

  // Basic validation regex (32 alphanumeric chars)
  const isValid = useMemo(() => {
    // Matches 32-character alphanumeric string (e.g., DxHrSJ8xtUINzENSe3Ab1F1cjIyWjtSJ)
    const keyRegex = /^[A-Za-z0-9]{32}$/;
    return keyRegex.test(inputKey.trim());
  }, [inputKey]);

  const handleStart = () => {
    if (isValid) {
      setApiKey(inputKey.trim());
      start();
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-black/80 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Marble Explorer</h1>

      <div className="w-full max-w-md flex flex-col gap-4 bg-neutral-900/50 p-6 rounded-xl border border-neutral-700">
        
        <ApiInput 
          value={inputKey} 
          onChange={setInputKey} 
          isValid={isValid} 
        />

        <button
          id="playButton"
          disabled={!isValid}
          className={`px-8 py-4 text-xl font-bold text-white rounded-lg transition-all focus:outline-none ${
            isValid 
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
              : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
          }`}
          onClick={handleStart}
        >
          {apiKey ? "Confirm & Start" : "Enter Key to Start"}
        </button>
      </div>

      <Instructions isMobile={isMobile} />
    </div>
  );
};
