import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {source: '/preview/studio/modules/:path*', destination: '/studio/:path*', permanent: false},
      {source: '/preview/studio/:path*', destination: '/studio/:path*', permanent: false},
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
    ] }, {source: '/studio/:path*', headers: [
      {key: 'Cache-Control', value: 'private, no-store'},
      {key: 'X-Frame-Options', value: 'DENY'},
      {key: 'Content-Security-Policy', value: "frame-ancestors 'none'; form-action 'self'"},
    ]}];
  },
};
export default nextConfig;
