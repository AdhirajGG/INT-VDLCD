// module.exports = {
//   allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
// }

const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "media.istockphoto.com",
      'plus.unsplash.com',
      "images.unsplash.com",
      "media.gettyimages.com",
    ], // Add the hostname here
  },
};

export default nextConfig;
