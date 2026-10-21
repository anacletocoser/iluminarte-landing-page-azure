import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  access,
  copyFile,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { join, sep } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = await realpath(fileURLToPath(new URL("../", import.meta.url)));
const cacheRoot = join(projectRoot, ".cache");

async function createFixture(t) {
  await mkdir(cacheRoot, { recursive: true });
  const fixture = await mkdtemp(join(cacheRoot, "package-test-"));
  t.after(async () => {
    if (!fixture.startsWith(cacheRoot + sep)) throw new Error("Pasta de teste fora do cache.");
    await rm(fixture, { recursive: true, force: true });
  });
  await mkdir(join(fixture, "scripts"));
  await copyFile(
    join(projectRoot, "scripts/package-site.mjs"),
    join(fixture, "scripts/package-site.mjs"),
  );
  for (const file of ["index.html", "styles.css", "script.js", "staticwebapp.config.json"]) {
    await copyFile(join(projectRoot, file), join(fixture, file));
  }
  await cp(join(projectRoot, "assets"), join(fixture, "assets"), { recursive: true });
  return fixture;
}

function runPackage(fixture) {
  return execFileSync(process.execPath, [join(fixture, "scripts/package-site.mjs")], {
    cwd: fixture,
    encoding: "utf8",
    stdio: "pipe",
  });
}

test("publica a página sem copiar arquivos privados ou manter saídas antigas", async (t) => {
  const fixture = await createFixture(t);
  await writeFile(join(fixture, ".env"), "SEGREDO_DE_TESTE=nao-publicar");
  await writeFile(join(fixture, "README.md"), "Documentação de desenvolvimento");
  await mkdir(join(fixture, "dist"));
  await writeFile(join(fixture, "dist/arquivo-antigo.txt"), "Saída que deve desaparecer");

  runPackage(fixture);

  for (const excluded of [".env", "README.md", "scripts", "arquivo-antigo.txt"]) {
    await assert.rejects(access(join(fixture, "dist", excluded)), { code: "ENOENT" });
  }
  assert.deepEqual(
    await readFile(join(fixture, "dist/assets/iluminarte.png")),
    await readFile(join(fixture, "assets/iluminarte.png")),
  );
  assert.equal(
    await readFile(join(fixture, "dist/index.html"), "utf8"),
    await readFile(join(fixture, "index.html"), "utf8"),
  );
});

test("preserva a saída anterior quando falta um arquivo necessário", async (t) => {
  const fixture = await createFixture(t);
  await mkdir(join(fixture, "dist"));
  await writeFile(join(fixture, "dist/preservar.txt"), "Versão anterior");
  await rm(join(fixture, "index.html"));

  assert.throws(() => runPackage(fixture));
  assert.equal(await readFile(join(fixture, "dist/preservar.txt"), "utf8"), "Versão anterior");
});

test("recusa uma pasta dist que seja um link para outro destino", async (t) => {
  const fixture = await createFixture(t);
  const destination = join(fixture, "outro-destino");
  await mkdir(destination);
  await writeFile(join(destination, "preservar.txt"), "Conteúdo fora da saída permitida");
  await symlink(
    destination,
    join(fixture, "dist"),
    process.platform === "win32" ? "junction" : "dir",
  );

  assert.throws(() => runPackage(fixture));
  assert.equal(
    await readFile(join(destination, "preservar.txt"), "utf8"),
    "Conteúdo fora da saída permitida",
  );
});
