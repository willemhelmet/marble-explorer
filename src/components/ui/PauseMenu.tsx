import { useMyStore } from "../../store/store.ts";
import { Instructions } from "./Instructions.tsx";

export const PauseMenu = () => {
  const isMobile = useMyStore((state) => state.isMobile);
  const resume = useMyStore((state) => state.resume);
  const setApiKey = useMyStore((state) => state.setApiKey);
  const setStatus = useMyStore.getState().setApiKey ? (status: any) => useMyStore.setState({ status }) : () => {}; 
  // Actually I should use the proper store setters
  
  const handleResetKey = () => {
    setApiKey(null);
    // Directly setting state for navigation
    useMyStore.setState({ status: "intro" });
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-black/80 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Paused</h1>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          id="playButton"
          className="w-full px-8 py-4 text-xl font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none cursor-pointer"
          onClick={resume}
        >
          Resume
        </button>

        <button
          className="w-full px-8 py-3 text-sm font-bold text-neutral-400 bg-neutral-900 border border-neutral-700 rounded-lg hover:bg-neutral-800 hover:text-white transition-all cursor-pointer"
          onClick={handleResetKey}
        >
          Change API Key
        </button>
      </div>

      <Instructions isMobile={isMobile} />
    </div>
  );
};
