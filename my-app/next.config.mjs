/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
      return [
        {
          source: "/:path*",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/:path*"
              : "/api/",
        },
        {
          source: "/docs",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/docs"
              : "/api/py/docs",
        },
        {
          source: "/openapi.json",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/openapi.json"
              : "/api/py/openapi.json",
        },
      ];
    },
  };
  
  module.exports = nextConfig;