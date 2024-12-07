/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
      console.log("Setting up rewrites...");
      return [
        {
          source: "/:path*",
          destination: (() => {
            const dest = process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/:path*"
              : "/api/";
            console.log(`Rewrite: /:path* to ${dest}`);
            return dest;
          })(),
        },
        {
          source: "/docs",
          destination: (() => {
            const dest = process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/docs"
              : "/api/docs";
            console.log(`Rewrite: /docs to ${dest}`);
            return dest;
          })(),
        },
        {
          source: "/openapi.json",
          destination: (() => {
            const dest = process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/openapi.json"
              : "/api/openapi.json";
            console.log(`Rewrite: /openapi.json to ${dest}`);
            return dest;
          })(),
        },
      ];
    },
  }
  
  
module.exports = nextConfig; 