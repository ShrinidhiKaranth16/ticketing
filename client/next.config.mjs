/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
      styledComponents: true, // ✅ Enables proper SSR + hydration for styled-components
    },
  
    webpack: (config) => {
      return {
        ...config,
        watchOptions: {
          ...config.watchOptions,
          poll: 300, // your existing watch setting
        },
      };
    },
  
    allowedDevOrigins: ["ticketing.dev"], // keep your existing config
  };
  
  export default nextConfig;
  