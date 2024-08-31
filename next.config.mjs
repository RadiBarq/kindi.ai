/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "unsplash.com" },
    ],
  },
  // webpack: (config) => {
  //   config.externals = [...config.externals, "bcrypt"];
  //   return config;
  // },
};

export default nextConfig;
