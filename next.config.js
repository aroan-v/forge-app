/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Tells Next.js to optimize imports from this package
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
