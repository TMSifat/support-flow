process.argv[2] = 'final';
process.argv.push('--review');
await import('./evaluate-system.mjs');
await import('./render-evaluation.mjs');
