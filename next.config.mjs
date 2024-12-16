/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/v1/:path*",
        destination:
          process.env.NEXT_PUBLIC_API_URL === "development"
            ? "http://127.0.0.1:8000/api/v1/:path*"
            : "/api/v1",
      },
      {
        source: "/docs",
        destination:
          process.env.NEXT_PUBLIC_API_URL === "development"
            ? "http://127.0.0.1:8000/api/v1/docs"
            : "/api/v1/docs",
      },
      {
        source: "/openapi.json",
        destination:
          process.env.NEXT_PUBLIC_API_URL === "development"
            ? "http://127.0.0.1:8000/api/v1/openapi.json"
            : "/api/v1/openapi.json",
      },
      
    ];
  },
};

export default nextConfig;