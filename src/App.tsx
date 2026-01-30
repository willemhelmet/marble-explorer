import { Canvas, type CameraProps } from "@react-three/fiber";
import {
  CameraControls,
  KeyboardControls,
  Loader,
  PointerLockControls,
  // Stats,
} from "@react-three/drei";
import { Scene } from "./Scene.tsx";
import { MainMenu } from "./components/ui/MainMenu.tsx";
import { PauseMenu } from "./components/ui/PauseMenu.tsx";
import { PortalUI } from "./components/ui/portal/PortalUI.tsx";
import { useMyStore } from "./store/store.ts";
import { MobileControls } from "./components/ui/MobileControls.tsx";
import { ControlsManager } from "./components/ControlsManager.tsx";
import { useMemo, useEffect } from "react";
import { socketManager } from "./services/socketManager";
import { CSSProperties } from "react";

const loaderStyles: { [key: string]: CSSProperties } = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 300ms ease",
    zIndex: 1000,
  },
  inner: {
    width: 300,
    height: 3,
    background: "#222",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  bar: {
    height: 3,
    width: "100%",
    background: "white",
    transition: "transform 200ms",
    transformOrigin: "left center",
  },
  data: {
    display: "inline-block",
    position: "relative",
    fontVariantNumeric: "tabular-nums",
    marginTop: "1em",
    color: "#fff",
    fontSize: "1.2rem",
    fontFamily: "Karrik",
    whiteSpace: "nowrap",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
};

function App() {
  const isMobile = useMyStore((state) => state.isMobile);
  const status = useMyStore((state) => state.status);
  const currentWorldId = useMyStore((state) => state.currentWorldId);
  const pause = useMyStore((state) => state.pause);
  const resume = useMyStore((state) => state.resume);
  const editingPortal = useMyStore((state) => state.editingPortal);
  const displayName = useMyStore((state) => state.displayName);

  useEffect(() => {
    socketManager.connect();

    return () => {
      socketManager.disconnect();
    };
  }, []);

  useEffect(() => {
    socketManager.joinRoom(currentWorldId);
  }, [currentWorldId]);

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

  const glConfig = useMemo(() => ({ antialias: false }), []);
  const cameraConfig: CameraProps = useMemo(
    () => ({
      position: [0, 1.5, 5],
      rotation: [0, 0, 0],
    }),
    [],
  );

  const keyboardMap = useMemo(
    () => [
      { name: "forward", keys: ["ArrowUp", "KeyW"] },
      { name: "backward", keys: ["ArrowDown", "KeyS"] },
      { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
      { name: "rightward", keys: ["ArrowRight", "KeyD"] },
      { name: "pause", keys: ["Escape"] },
      { name: "create_portal", keys: ["p"] },
      { name: "run", keys: ["Shift"] },
    ],
    [],
  );

  return (
    <>
      {status === "intro" && <MainMenu />}
      {status === "paused" && <PauseMenu />}
      {status === "portal_open" && <PortalUI key={editingPortal?.portalId} />}

      <div className="flex h-screen w-screen">
        <KeyboardControls map={keyboardMap}>
          {isMobile && status === "playing" && <MobileControls />}
          <Canvas gl={glConfig} dpr={1} camera={cameraConfig}>
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
        <Loader
          containerStyles={loaderStyles.container}
          innerStyles={loaderStyles.inner}
          barStyles={loaderStyles.bar}
          dataStyles={loaderStyles.data}
          dataInterpolation={(p) => `${p.toFixed(0)}%`}
        />
        {/* <Stats /> */}
      </div>
    </>
  );
}
export default App;
