# Optional local design-effects toolkit

Installed at the owner's request on 6 October 2026. This is an independent, private npm package under `experiments`, which the main application already excludes from TypeScript and ESLint. No production page imports it and the root application dependency manifest is unchanged.

## Available resources

| Resource | Installed form |
| --- | --- |
| ShaderGradient | `@shadergradient/react` 2.4.20 with Fiber 9, Three.js, three-stdlib and camera-controls |
| React Three Fiber | `@react-three/fiber` 9.8.1, Three.js 0.186.1 and Drei 10.7.9; React/React DOM 19.3.0 |
| Liquid Logo engine | `@paper-design/shaders-react` 0.0.81, including LiquidMetal |
| Liquid Glass JS | Selected unmodified upstream scripts/styles under `vendor/liquid-glass`, with html2canvas 1.4.1 |
| Motion | `motion` 14.0.0; import React primitives from `motion/react` |

Use Node 22.16 or newer in the 22.x line. From this directory, `npm ci --ignore-scripts` reproduces the package installation; `npm run verify` checks the documented module exports and parses the vendor scripts. No peer-dependency override is needed.

The verification command does not render WebGL, create a browser, submit data or change the website. Graphics rendering and real-device performance are unverified until a specific effect is integrated and previewed. This toolkit is not a running demo or an approved new hero design.

## Integration boundary

Choose a particular section and effect before transferring selected dependencies/source to the main application. Keep the established brand, products and editorial images. Load a graphics effect only in a client boundary, with a useful static fallback, reduced-motion handling, visibility-based pausing and bounded pixel density. Test the resulting section's loading and readability on the relevant devices.

Liquid Glass is vanilla DOM code with global classes and styles; it samples the page with html2canvas. Use it only in an isolated experiment until lifecycle, cleanup, contrast and fallback behavior are addressed. Do not import its global CSS or page capture into Studio.

## Sources and licensing

- https://github.com/ruucm/shadergradient — MIT; current README requires more peers than the pasted article lists.
- https://github.com/pmndrs/react-three-fiber — MIT. Fiber 9 matches this React 19 toolkit.
- https://github.com/pmndrs/drei — MIT.
- https://github.com/paper-design/liquid-logo — the full demo is a separate application with storage/analytics dependencies and a PolyForm Shield license. It was not cloned or run. The reusable Paper shader package installed here declares Apache-2.0; retain its package notices when distributing it.
- https://github.com/dashersw/liquid-glass-js — MIT. Exact vendored commit and file list are in `vendor/liquid-glass/SOURCE.json`, with the original license.
- https://motion.dev/docs/react — Motion's npm package declares MIT.

Package versions and registry integrity are pinned in `package-lock.json`. Licenses supplied by npm remain with their packages. No paid product, account upgrade, tracking service or hosting integration was added.
