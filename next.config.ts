import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    localPatterns: [{pathname:'/editorial/**',search:''},{pathname:'/media/**',search:''},{pathname:'/brand/**',search:''}],
    deviceSizes: [360,640,828,1080,1440,1920],
    imageSizes: [32,64,96,160,256],
    qualities: [75],
    formats: ['image/avif', 'image/webp'],
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
    ] }, ...['/shop/:path*','/blog/:path*','/product/:path*','/custom-order','/large-resin-art','/whatsapp-order','/workshops'].map(source=>({source,headers:[
      // next.config headers take precedence over Route Handler headers.
      // Old links can carry private tokens; never send their URL as a referrer.
      {key:'Referrer-Policy',value:'no-referrer'},
    ]})), {source: '/studio/:path*', headers: [
      {key: 'Cache-Control', value: 'private, no-store'},
      {key: 'X-Frame-Options', value: 'DENY'},
      {key: 'Content-Security-Policy', value: "frame-ancestors 'none'; form-action 'self'"},
    ]}, {source:'/studio/preview/frame',headers:[
      {key:'X-Frame-Options',value:'SAMEORIGIN'},
      {key:'Content-Security-Policy',value:"frame-ancestors 'self'; form-action 'self'"},
    ]}, ...['/api/:path*','/studio/:path*','/inquiry/:path*','/pieces/:slug/customize','/commission/customize','/preview/:path*'].map(source=>({source,headers:[{key:'X-Robots-Tag',value:'noindex, nofollow, noarchive'}]}))];
  },
};
export default nextConfig;
