process.argv[2] = 'baseline';
process.argv.push('--review');
await import('./evaluate-system.mjs');
await import('./render-evaluation.mjs');
