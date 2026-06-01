import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // typedRoutes intentionally disabled: it conflicts with dynamic href unions
  // (e.g. the Sidebar nav array) and is not required by any acceptance criterion.
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  images: { remotePatterns: [] },
};

export default nextConfig;
