// module.exports = {
//   allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
// }

// const nextConfig: import('next').NextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: [
//       "media.istockphoto.com",
//       'plus.unsplash.com',
//       "images.unsplash.com",
//       "media.gettyimages.com",
//       "res.cloudinary.com",
//     ], // Add the hostname here
//   },
// };

// export default nextConfig;

const nextConfig = {
  reactStrictMode: true,
  images: {
    // Remove the `domains` array and use `remotePatterns` instead:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // `pathname: '/cloud_name/**'` would be more restrictive,
        // but using `'/—/**'` lets any path under that host go through:
        pathname: '/**',
      },
      // If you still host images on Unsplash, Getty, iStock, etc.,
      // you can add them here as well. For example:
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.gettyimages.com',
        pathname: '/**',
      },
    ],
  },
  eslint: {
  ignoreDuringBuilds: true,
},
api: {
    bodyParser: {
      sizeLimit: '10mb' // Adjust as needed
    }
  },
}

module.exports = nextConfig
