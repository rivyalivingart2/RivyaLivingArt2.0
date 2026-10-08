# Design tooling extension — 6 October 2026

The owner supplied four articles and requested useful ChatGPT/Codex-compatible installations. Example commands and starter briefs in those articles are references; they do not request replacing the website with the sample palettes or adding every effect to production.

## Installed or configured

- New user-level Codex skill: `design-reference-workflow`. It routes relevant work to the supplied reference sources, records observed evidence, selects individual components and preserves the existing design direction. Both the staged and installed skill passed Codex's official validator. This is a local Codex skill, not an account-level ChatGPT plugin.
- Aceternity's public registry is configured in `components.json` as `@aceternity`. The `aurora-background` registry endpoint was successfully read to validate the source. No arbitrary Aurora component or preset was added to a public page.
- Optional effects are installed in the independent `experiments/design-effects-toolkit` package. It includes ShaderGradient, React Three Fiber/Three/Drei, Paper's LiquidMetal engine, Motion and vendored Liquid Glass scripts with html2canvas. See its README for versions and integration boundaries.
- The previous Poppins/Lucide/shadcn/IRA/pattern.css setup and four design skills remain installed; no duplicate copies or upgrades were needed.

## References that do not need installation

The new skill includes designprompts.dev for direction; Supahero for heroes; pricingpages.design for comparisons; navbar.gallery for navigation; cta.gallery for calls to action; footer.design for footers; and 21st.dev/Aceternity for selected component source.

21st.dev is a catalog rather than one runtime package. Its homepage currently documents two free component copies per day. Exact component selection, author licensing and account access must be checked when a component is used. No membership, AI API add-on or paid template was purchased.

## Mobbin — account connected; tool search pending

The official documentation provides a ChatGPT app and says the Codex desktop app shares that connection. MCP requires a Mobbin Pro, Team or Enterprise plan. The available plugin search returned no Mobbin entry, so the documented app page was provided directly:

https://chatgpt.com/apps/mobbin/asdk_app_69fdb9081018819193707354f21b366e

After the owner reported connecting the account on 6 October 2026, the rendered ChatGPT plugin page was inspected at `https://chatgpt.com/plugins/plugin_asdk_app_69fdb9081018819193707354f21b366e`. Mobbin appears under Installed and its account status explicitly says Connected. This verifies the account connection independently of the owner's message.

Mobbin tools remain absent from this Codex session's available tools, and a fresh plugin search returns no matching entry. A real Mobbin search therefore remains unverified. The existing ChatGPT composer already has Mobbin selected; its unsent prompt was left untouched. No Mobbin URL was added to a separate CLI configuration, and no key or password was requested in chat.

## Verification and release

All nine package-import checks passed, both Liquid Glass scripts parsed, and npm's direct dependency tree is valid without peer overrides. The Node-only check reports an upstream CommonJS Three.js deprecation warning; browser rendering has not been exercised. The Aceternity registry URL and existing local aliases were checked. Root application dependencies and page source are unchanged, so a fresh application-wide build or database test was not needed for this tooling-only change.

These checks do not close the outstanding mobile-performance, real-device or human-review acceptance items. All source changes remain local; no PR, push, deployment or production-data mutation is authorized by this installation request. Mobbin tools were not present in the current tool inventory at the final check; no search was claimed.

## Primary references

- https://designprompts.dev/
- https://21st.dev/
- https://ui.aceternity.com/components/aurora-background
- https://docs.mobbin.com/mcp/introduction
- https://docs.mobbin.com/mcp/clients/chatgpt
- https://docs.mobbin.com/mcp/clients/codex-app
- https://github.com/ruucm/shadergradient
- https://github.com/paper-design/liquid-logo
- https://github.com/dashersw/liquid-glass-js
- https://github.com/pmndrs/react-three-fiber
