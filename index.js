#!/usr/bin/env node
const chokidar = require('chokidar');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const micromatch = require('micromatch');

// 1️⃣ Load package.json config
const pkgPath = path.resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const config = pkg['auto-watch-run'];

if (!config || !config.patterns || Object.keys(config.patterns).length === 0) {
  console.log('[auto-watch-run] ERROR: No auto-watch-run config found in package.json');
  process.exit(1);
}

// 2️⃣ Global options
let globalOptions = config.options || {};
let GLOBAL_PARALLEL = globalOptions.parallel ?? false;
let DEBOUNCE_MS = globalOptions.debounce ?? 300;
let DRY_RUN = globalOptions.dry ?? false;

// 3️⃣ CLI flags override
const args = process.argv.slice(2);
args.forEach((arg, index) => {
  switch (arg) {
    case '--dry':
      DRY_RUN = true;
      break;
    case '--parallel':
      GLOBAL_PARALLEL = true;
      break;
    case '--debounce':
      const val = parseInt(args[index + 1], 10);
      if (!isNaN(val)) DEBOUNCE_MS = val;
      break;
  }
});

// 4️⃣ Patterns
const patterns = config.patterns;
const watcher = chokidar.watch(Object.keys(patterns), { ignoreInitial: true });

// 5️⃣ Debounce map
const debounceMap = {};

// 6️⃣ Run a single command
function runCommand(cmd) {
  if (DRY_RUN) {
    console.log(`[dry-run] Would run: ${cmd}`);
    return Promise.resolve();
  }

  console.log(`[auto-watch-run] Running: ${cmd}`);

  return new Promise(resolve => {
    const parts = cmd.split(' ');
    const child = spawn(parts[0], parts.slice(1), { stdio: 'inherit', shell: true });

    child.on('exit', code => {
      if (code === 0) console.log(`[auto-watch-run] Finished: ${cmd}`);
      else console.log(`[auto-watch-run] Failed (${code}): ${cmd}`);
      resolve();
    });
  });
}

// 7️⃣ Execute commands for a pattern
function executeCommands(commands, parallel = false) {
  if (parallel) return Promise.all(commands.map(runCommand));
  return commands.reduce((prev, cmd) => prev.then(() => runCommand(cmd)), Promise.resolve());
}

// 8️⃣ Handle file changes
watcher.on('all', (event, filePath) => {
  for (const pattern of Object.keys(patterns)) {
    if (micromatch.isMatch(filePath, pattern)) {
      const patternConfig = patterns[pattern];
      const commands = patternConfig.commands || [];
      const isParallel = patternConfig.parallel ?? GLOBAL_PARALLEL;

      commands.forEach(cmd => {
        // Debounce per command
        if (debounceMap[cmd]) clearTimeout(debounceMap[cmd]);
        debounceMap[cmd] = setTimeout(() => executeCommands([cmd], isParallel), DEBOUNCE_MS);
      });
    }
  }
});

console.log('[auto-watch-run] Watching for file changes...');
console.log(`[auto-watch-run] Options: parallel=${GLOBAL_PARALLEL}, debounce=${DEBOUNCE_MS}ms, dry=${DRY_RUN}`);