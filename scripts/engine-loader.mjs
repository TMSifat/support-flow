import fs from 'node:fs/promises';
import ts from 'typescript';

// Loads the actual engine in a Node test process, without a running dev server.
export async function loadEngine(file = 'lib/support-engine.ts') {
  const encode = (text) =>
    'data:text/javascript;base64,' + Buffer.from(text).toString('base64');
  const transpile = (source) =>
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
  const contract = encode(
    transpile(await fs.readFile('lib/support-contract.ts', 'utf8')),
  );
  const knowledge = await fs.readFile('data/knowledge-base.json', 'utf8');
  const source = (await fs.readFile(file, 'utf8'))
    .replace(
      "import knowledgeBase from '@/data/knowledge-base.json';",
      `const knowledgeBase = ${knowledge};`,
    )
    .replace("'@/lib/support-contract'", JSON.stringify(contract));
  return import(encode(transpile(source)));
}
