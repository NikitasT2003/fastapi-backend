/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination:
          process.env.NEXT_PUBLIC_API_URL  === 'development'
            ? 'http://127.0.0.1:3000/api/:path*'
            : '/api/',
      },
    ]
  },
}

export default nextConfig