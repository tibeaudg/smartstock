import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const VERCEL_PATH = path.join(ROOT, 'vercel.json');

function normalizePath(p) {
  if (!p || typeof p !== 'string') return '';
  return p.trim().toLowerCase();
}

function isParameterized(source) {
  return /[:*()]/.test(source);
}

function readRedirects() {
  const raw = fs.readFileSync(VERCEL_PATH, 'utf8');
  const json = JSON.parse(raw);
  return Array.isArray(json.redirects) ? json.redirects : [];
}

function buildGraph(redirects) {
  const graph = new Map();
  for (const item of redirects) {
    const source = normalizePath(item?.source);
    const destination = normalizePath(item?.destination);
    if (!source || !destination) continue;
    if (isParameterized(source) || isParameterized(destination)) continue;
    graph.set(source, destination);
  }
  return graph;
}

function detectCycles(graph) {
  const cycles = [];
  const visited = new Set();

  for (const start of graph.keys()) {
    if (visited.has(start)) continue;
    let node = start;
    const pathStack = [];
    const pathSet = new Set();

    while (node && graph.has(node)) {
      if (pathSet.has(node)) {
        const idx = pathStack.indexOf(node);
        cycles.push(pathStack.slice(idx).concat(node));
        break;
      }
      if (visited.has(node)) break;
      pathStack.push(node);
      pathSet.add(node);
      visited.add(node);
      node = graph.get(node);
    }
  }
  return cycles;
}

function detectChains(graph) {
  const chains = [];
  for (const [source, destination] of graph.entries()) {
    if (graph.has(destination)) {
      chains.push([source, destination, graph.get(destination)]);
    }
  }
  return chains;
}

function main() {
  const redirects = readRedirects();
  const issues = [];
  const sourceCount = new Map();

  redirects.forEach((item, idx) => {
    const source = normalizePath(item?.source);
    const destination = normalizePath(item?.destination);

    if (!source || !destination) {
      issues.push(`redirect[${idx}] has empty source or destination`);
      return;
    }

    sourceCount.set(source, (sourceCount.get(source) ?? 0) + 1);

    if (source === destination) {
      issues.push(`self-redirect: ${source} -> ${destination}`);
    }
    if (!source.startsWith('/')) {
      issues.push(`source does not start with "/": ${source}`);
    }
    if (!destination.startsWith('/') && !destination.startsWith('http')) {
      issues.push(`destination should be absolute URL or root-relative: ${source} -> ${destination}`);
    }
  });

  for (const [source, count] of sourceCount.entries()) {
    if (count > 1) issues.push(`duplicate redirect source "${source}" (${count} rules)`);
  }

  const graph = buildGraph(redirects);
  const chains = detectChains(graph);
  const cycles = detectCycles(graph);

  chains.forEach(([a, b, c]) => {
    issues.push(`redirect chain: ${a} -> ${b} -> ${c}`);
  });
  cycles.forEach((cycle) => {
    issues.push(`redirect loop: ${cycle.join(' -> ')}`);
  });

  if (issues.length) {
    console.error(`Redirect check failed with ${issues.length} issue(s):`);
    issues.forEach((msg) => console.error(`- ${msg}`));
    process.exit(1);
  }

  console.log(`Redirect check passed (${redirects.length} redirect rules).`);
}

main();
