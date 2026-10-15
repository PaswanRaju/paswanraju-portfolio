import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

// `next dev` blocks dev resources requested from any hostname other than localhost. Opening the dev server
// from a phone via this machine's LAN address (the "Network:" URL) then never hydrates: plain links work, but
// every React-driven control (menu, palette, Recruiter Mode, Resume Explorer, ...) does nothing.
// Allow exactly this machine's own network addresses. Development only; production builds ignore this option.
const lanAddresses = Object.values(networkInterfaces())
  .flat()
  .filter((net) => net && net.family === "IPv4" && !net.internal)
  .map((net) => net!.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: lanAddresses,
  // Hide the on-screen dev indicator; compile and runtime errors still show in the dev overlay.
  devIndicators: false,
};

export default nextConfig;
