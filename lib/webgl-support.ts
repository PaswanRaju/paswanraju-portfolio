import { useSyncExternalStore } from "react";

// Shared WebGL gate for every 3D feature (homepage background, Resume Explorer).
// WebGL only on desktop-class devices: wide screen, precise pointer, and no low-memory, low-core, or data-saver hints.
const capableScreen = "(min-width: 701px) and (pointer: fine)";

type DeviceHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

function canRenderWebGL() {
  if (!window.matchMedia(capableScreen).matches) return false;
  const hints = navigator as DeviceHints;
  if (hints.connection?.saveData) return false;
  if ((hints.deviceMemory ?? 8) < 4) return false;
  return (navigator.hardwareConcurrency ?? 8) >= 4;
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(capableScreen);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

// False on the server and during hydration, so markup never depends on the device.
export function useWebGLCapable() {
  return useSyncExternalStore(subscribe, canRenderWebGL, () => false);
}
