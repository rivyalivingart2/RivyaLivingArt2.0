import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const skills = [
  { slug: 'jakubantalik/transitions-polish', name: 'transitions-polish' },
  { slug: 'emilkowalski/mobile-native', name: 'mobile-native' },
  { slug: 's0xdk/refactoring-ui', name: 'refactoring-ui' },
  { slug: 'elithrar/web-perf', name: 'web-perf' },
];

for (const skill of skills) {
  console.log(`Fetching skill: ${skill.slug}...`);
  const content = execSync(`npx ui-skills get ${skill.slug}`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  const targetDir = join(process.cwd(), '.agents', 'skills', skill.name);
  mkdirSync(targetDir, { recursive: true });
  const targetFile = join(targetDir, 'SKILL.md');
  writeFileSync(targetFile, content, 'utf8');
  console.log(`Saved to ${targetFile} (${content.length} bytes)`);
}
console.log('All skills successfully installed!');
