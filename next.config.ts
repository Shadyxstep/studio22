import type { NextConfig } from "next";
import { LEGACY_REDIRECTS } from "./src/lib/redirects";

const nextConfig: NextConfig = {
  async redirects() {
    return LEGACY_REDIRECTS.map((r) => ({ ...r, permanent: true }));
  },
};

export default nextConfig;
