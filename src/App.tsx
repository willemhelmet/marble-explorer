import { Canvas } from "@react-three/fiber";
import {
  CameraControls,
  KeyboardControls,
  Loader,
  PointerLockControls,
  Stats,
} from "@react-three/drei";
import { Scene } from "./Scene.tsx";
import { MainMenu } from "./components/ui/MainMenu.tsx";
import { PauseMenu } from "./components/ui/PauseMenu.tsx";
import { PortalUI } from "./components/ui/PortalUI.tsx";
import { useMyStore } from "./store/store.ts";
import { MobileControls } from "./components/MobileControls.tsx";
import { ControlsManager } from "./components/ControlsManager.tsx";

function App() {
  const isMobile = useMyStore((state) => state.isMobile);
  const status = useMyStore((state) => state.status);
  const pause = useMyStore((state) => state.pause);
  const resume = useMyStore((state) => state.resume);

  const handleUnlock = () => {
    if (status === "playing") {
      pause();
    }
  };

  const handleLock = () => {
    if (status === "paused") {
      resume();
    }
  };

  return (
    <>
      {status === "intro" && <MainMenu />}
      {status === "paused" && <PauseMenu />}
      {status === "portal_open" && <PortalUI />}

      <div className="flex h-screen w-screen">
        <KeyboardControls
          map={[
            { name: "forward", keys: ["ArrowUp", "KeyW"] },
            { name: "backward", keys: ["ArrowDown", "KeyS"] },
            { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
            { name: "rightward", keys: ["ArrowRight", "KeyD"] },
            { name: "pause", keys: ["Escape"] },
            { name: "create_portal", keys: ["p"] },
          ]}
        >
          {isMobile && status === "playing" && <MobileControls />}
          <Canvas
            gl={{ antialias: false }}
            dpr={1}
            camera={{
              position: [0, 1.5, 5],
              rotation: [0, 0, 0],
            }}
          >
            <Scene />
            <ControlsManager />
            {!isMobile && (
              <PointerLockControls
                selector="#playButton"
                onUnlock={handleUnlock}
                onLock={handleLock}
                makeDefault
              />
            )}
            {isMobile && <CameraControls smoothTime={0} />}
          </Canvas>
        </KeyboardControls>
        <Loader />
        <Stats />
      </div>
    </>
  );
}
export default App;
