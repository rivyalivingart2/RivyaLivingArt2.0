import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { Script } from "node:vm";

const imports = [
  ["react", ["createElement"]],
  ["react-dom/client", ["createRoot"]],
  ["three", ["Scene", "WebGLRenderer"]],
  ["@react-three/fiber", ["Canvas"]],
  ["@react-three/drei", ["Float"]],
  ["@shadergradient/react", ["ShaderGradient", "ShaderGradientCanvas"]],
  ["@paper-design/shaders-react", ["LiquidMetal"]],
  ["motion/react", ["motion", "useReducedMotion"]],
  ["html2canvas", ["default"]],
];

for (const [name, exports] of imports) {
  const module = await import(name);
  for (const exported of exports) assert.ok(module[exported], `${name}: missing ${exported}`);
  console.log(`${name}: expected exports available`);
}

// Parse vendor scripts without executing their DOM or WebGL operations.
for (const file of ["container.js", "button.js"]) {
  new Script(await readFile(new URL(`./vendor/liquid-glass/${file}`, import.meta.url), "utf8"));
}
console.log("Liquid Glass scripts: syntax checked; browser rendering not exercised.");
