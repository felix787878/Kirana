/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/cv-percobaan", destination: "/cv", permanent: true }];
  },
  transpilePackages: ["@react-pdf/renderer"],
  /** Windows / OneDrive: polling mengurangi masalah watcher lambat atau chunk 404 setelah sync. */
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 600,
        ignored: ["**/node_modules/**", "**/.git/**"],
      };
    }
    return config;
  },
};

export default nextConfig;
