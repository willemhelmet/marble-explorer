import { Joystick, VirtualButton } from "bvhecctrl";

export const MobileControls = () => {
  return (
    <>
      <Joystick />
      <VirtualButton
        id="create-portal"
        buttonWrapperStyle={{ right: "100px", bottom: "40px" }}
      />
    </>
  );
};
