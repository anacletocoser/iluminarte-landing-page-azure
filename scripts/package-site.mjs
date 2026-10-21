import { lstat, mkdir, readFile, realpath, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

// Somente estes arquivos podem ser publicados. Novos recursos entram por revisão.
const publicFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "staticwebapp.config.json",
  "assets/iluminarte.png",
  "assets/favicon.svg",
  "assets/kit-artesanal.svg",
  "assets/vela.svg",
  "assets/sabonetes.svg",
  "assets/caixa-mdf.svg",
];

const projectRoot = await realpath(fileURLToPath(new URL("../", import.meta.url)));
const outputDirectory = resolve(projectRoot, "dist");

// Confere todos os arquivos antes de substituir uma saída anterior.
const entries = await Promise.all(
  publicFiles.map(async (relativePath) => {
    const source = join(projectRoot, relativePath);
    const metadata = await lstat(source);
    if (!metadata.isFile() || metadata.isSymbolicLink()) {
      throw new Error(`O arquivo público precisa ser um arquivo regular: ${relativePath}`);
    }
    const resolvedSource = await realpath(source);
    if (!resolvedSource.startsWith(projectRoot + sep)) {
      throw new Error(`Arquivo fora da pasta do projeto: ${relativePath}`);
    }
    return { relativePath, content: await readFile(resolvedSource) };
  }),
);

JSON.parse(entries.find((entry) => entry.relativePath === "staticwebapp.config.json").content);

// A remoção fica restrita a dist/, dentro deste projeto, sem seguir um link externo.
if (dirname(outputDirectory) !== projectRoot) {
  throw new Error("A saída precisa estar diretamente dentro da pasta do projeto.");
}
try {
  const outputMetadata = await lstat(outputDirectory);
  if (!outputMetadata.isDirectory() || outputMetadata.isSymbolicLink()) {
    throw new Error("dist precisa ser uma pasta regular, não um arquivo ou link.");
  }
  if ((await realpath(outputDirectory)) !== outputDirectory) {
    throw new Error("O caminho real de dist difere do caminho permitido.");
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
for (const { relativePath, content } of entries) {
  const destination = join(outputDirectory, relativePath);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, content);
}

console.log(`Pacote público gerado em dist/: ${entries.length} arquivos.`);
