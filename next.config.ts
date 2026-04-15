import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Expose Web3Forms key to the client for browser POST (free tier). Prefer NEXT_PUBLIC_*; else reuse WEB3FORMS_ACCESS_KEY so one variable works. */
  env: {
    NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY:
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
      process.env.WEB3FORMS_ACCESS_KEY ||
      '',
  },
};

export default nextConfig;
