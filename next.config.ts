import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    localPatterns: [{pathname:'/media/**',search:''},{pathname:'/brand/**',search:''}],
    deviceSizes: [360,640,828,1080,1440,1920],
    imageSizes: [32,64,96,160,256],
    qualities: [75],
    formats: ['image/webp'],
  },
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
      ...((process.env.SITE_INDEXABLE==='true'&&(process.env.VERCEL_ENV?process.env.VERCEL_ENV==='production':process.env.RIVYA_ENV==='production'))?[]:[{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }]),
    ] }, {source: '/studio/:path*', headers: [
      {key: 'Cache-Control', value: 'private, no-store'},
      {key: 'X-Frame-Options', value: 'DENY'},
      {key: 'Content-Security-Policy', value: "frame-ancestors 'none'; form-action 'self'"},
    ]}, ...['/api/:path*','/studio/:path*','/inquiry/:path*','/pieces/:slug/customize','/commission/customize','/preview/:path*'].map(source=>({source,headers:[{key:'X-Robots-Tag',value:'noindex, nofollow, noarchive'}]}))];
  },
};
export default nextConfig;
