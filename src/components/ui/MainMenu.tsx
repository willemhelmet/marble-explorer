import { useMyStore } from "../../store/store.ts";
import { Instructions } from "./Instructions.tsx";

export const MainMenu = () => {
  const isMobile = useMyStore((state) => state.isMobile);
  const start = useMyStore((state) => state.start);

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-black/80 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">Splat Project</h1>
      <button
        id="playButton"
        className="px-8 py-4 text-xl font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none cursor-pointer"
        onClick={start}
      >
        Start
      </button>
      <Instructions isMobile={isMobile} />
    </div>
  );
};
