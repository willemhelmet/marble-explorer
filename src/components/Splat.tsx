import { useMemo } from "react";
import { SplatMesh } from "@sparkjsdev/spark";

export const Splat = () => {
  const splat = useMemo(() => {
    // Assets are resolved relative to the base URL
    const baseUrl = import.meta.env.BASE_URL;
    const splatUrl = baseUrl + "PUT_FILENAME_HERE";

    const splatMesh = new SplatMesh({
      url: splatUrl,
    });
    return splatMesh;
  }, []);

  return (
    <>
      <primitive object={splat} />
    </>
  );
};
