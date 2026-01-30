import { useMyStore } from "../../store/store.ts";
import { Instructions } from "./Instructions.tsx";

export const MainMenu = () => {
  const isMobile = useMyStore((state) => state.isMobile);
  const start = useMyStore((state) => state.start);

  const handleStart = () => {
    start();
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-black/80 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Marble Explorer</h1>

      <div className="w-full max-w-md flex flex-col gap-4 bg-neutral-900/50 p-6 rounded-xl border border-neutral-700">
        
        <button
          id="playButton"
          className="px-8 py-4 text-xl font-bold text-white rounded-lg transition-all focus:outline-none bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          onClick={handleStart}
        >
          Start Exploring
        </button>
      </div>

      <Instructions isMobile={isMobile} />
    </div>
  );
};
