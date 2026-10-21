# Guia de aprendizado — IluminArte

Este documento acompanha o desenvolvimento da landing page e será atualizado a cada etapa autorizada. Ele registra decisões e verificações, sem apresentar etapas planejadas como se já estivessem concluídas.

## Acordo de trabalho

- Explicar o objetivo, a alteração proposta e como verificar seu resultado.
- Pedir autorização antes de modificar o computador, instalar ferramentas ou criar recursos externos.
- Obter autorização específica antes de fazer commit e antes de enviar conteúdo ao GitHub.
- Explicar e aprovar os gatilhos antes de habilitar qualquer deploy automático.
- Manter o fluxo inicial dentro das opções gratuitas, verificando as condições antes da criação de recursos.
- Não registrar tokens, senhas ou credenciais neste guia.

Na etapa de adaptação ao recurso Azure criado pelo portal, o responsável autorizou as modificações necessárias localmente e no repositório. Essa autorização abrange a preparação e integração da configuração. A primeira publicação foi escolhida como manual; a publicação automática será habilitada em etapa posterior.

## 1. Primeira versão local — concluída

### Objetivo

Criar uma página demonstrativa da IluminArte com suas duas frentes: velas e sabonetes artesanais; caixas, lembrancinhas e outras peças em MDF com corte a laser.

### Escolha das tecnologias

Usamos HTML, CSS e JavaScript, sem framework. Uma landing page estática permite aprender a função de cada camada e pode ser hospedada sem servidor de aplicação ou banco de dados.

- `index.html`: define o conteúdo e sua estrutura.
- `styles.css`: define a apresentação, as cores e o comportamento em diferentes telas.
- `script.js`: acrescenta o menu compacto para dispositivos menores.
- `assets/`: guarda os recursos visuais utilizados pela página.

O navegador consegue abrir esta versão diretamente pelo `index.html`. Não há etapa de compilação, instalação de dependências nem comando `npm run` nesta fase.

### Identidade e conteúdo

A marca IluminArte e a logo foram fornecidas pelo responsável pelo projeto. O arquivo da logo foi copiado para `assets/iluminarte.png`, sem modificar o original. O enquadramento visual no cabeçalho e no rodapé é feito por CSS.

A página usa bege, marrom e verde inspirados na logo. As imagens dos produtos são ilustrações SVG identificadas como exemplos. Contatos reais, fotografias, preços e condições comerciais ainda precisam ser fornecidos e revisados antes de uma publicação destinada a clientes.

### Verificações

Foram conferidos sintaxe do JavaScript, referências locais, IDs e SVGs. No Chrome, foram verificadas larguras de 320, 390, 768, 1024 e 1440 pixels, carregamento das imagens, menu, Escape, links internos, perguntas frequentes e navegação sem JavaScript.

Não houve transbordamento horizontal nas larguras verificadas nem erros de execução do JavaScript durante essas verificações. Isso não cobre todos os navegadores, leitores de tela ou situações possíveis.

O ambiente bloqueou a navegação de teste por HTTP local. A validação foi feita abrindo o arquivo diretamente no Chrome. Não foram instaladas ferramentas para essa verificação; foram utilizados recursos já disponíveis no Codex.

## 2. Preparação do Git e documentação — configuração local

### O que é Git, e o que é GitHub?

Git é o controle de versão executado localmente: ele registra versões dos arquivos e permite comparar ou recuperar alterações. GitHub é o serviço onde podemos hospedar e colaborar sobre um repositório Git.

Uma pasta pode ter Git sem estar conectada ao GitHub. Também pode ter um endereço remoto configurado sem ter enviado qualquer arquivo.

### Situação encontrada

- A pasta do projeto ainda não tinha um diretório `.git`.
- Git não estava disponível no PATH consultado inicialmente, mas foi localizado no runtime fornecido pelo Codex.
- Nenhum nome ou e-mail de autor foi encontrado pela consulta à configuração efetiva do Git antes da inicialização.
- O responsável informou este repositório: `https://github.com/anacletocoser/iluminarte-landing-page-azure`.
- O acesso remoto e o conteúdo do repositório precisavam ser conferidos antes do primeiro envio; a consulta e o envio estão registrados na etapa 4. A visibilidade e as condições de uso de Actions serão conferidas antes de ativar a CI remota.

### Como executar Git neste computador

Nos exemplos abaixo, `git` representa o executável do Git. No ambiente atual do Codex, o caminho disponível é:

```text
C:\Users\anacl\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe
```

Por exemplo, no PowerShell, uma consulta de versão pode ser executada assim:

```powershell
& 'C:\Users\anacl\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe' --version
```

O `&` permite executar o programa cujo caminho está entre aspas. Esse caminho pertence ao runtime atual do Codex e pode mudar com atualizações; não é uma dependência do site nem precisa ser usado por outros colaboradores.

### Arquivos criados e seu propósito

| Arquivo                    | Por que existe                                                                                                                     |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `.gitignore`               | Evita adicionar arquivos temporários, dependências e alguns arquivos locais de configuração e segredos.                            |
| `.gitattributes`           | Padroniza arquivos de texto em LF e preserva imagens binárias, evitando diferenças desnecessárias entre Windows e outros sistemas. |
| `README.md`                | Apresenta o projeto a quem abrir o repositório e explica como visualizar a página.                                                 |
| `LICENSE`                  | Aplica a MIT ao código, documentação e SVGs originais, excluindo a logo e a identidade da marca.                                   |
| `docs/guia-aprendizado.md` | Mantém o histórico didático do processo e distingue o que já foi feito do que ainda está planejado.                                |

O aviso de autoria usa `anacletocoser`, o identificador GitHub informado. A identidade dos commits foi escolhida separadamente pelo responsável, conforme a etapa 3.

### Comandos de configuração local

Executados na pasta do projeto, com o executável do Git disponível:

```bash
git init -b main
git remote add origin https://github.com/anacletocoser/iluminarte-landing-page-azure.git
```

- `init`: inicializa o repositório e cria os metadados locais em `.git`.
- `-b main`: escolhe `main` como o nome da branch inicial. Antes do primeiro commit, essa branch ainda não tem uma versão registrada.
- `remote add`: registra um destino remoto na configuração local.
- `origin`: é o nome convencional desse destino, não uma palavra obrigatória.
- A URL aponta para o repositório escolhido. Registrar o endereço não verifica autenticação, não baixa arquivos e não faz upload.

### Conferências locais

```bash
git status --short --branch
git remote -v
git symbolic-ref --short HEAD
git check-ignore --no-index .env node_modules/exemplo.js dist/index.html
git check-attr text eol -- index.html styles.css script.js assets/iluminarte.png
```

Esses comandos permitem conferir o estado da pasta, os endereços remotos, o nome da branch e as regras de exclusão e tratamento de arquivos.

Antes do primeiro commit, os arquivos novos aparecem como `untracked`, ou `??` na saída curta. Isso significa que ainda não foram adicionados ao histórico. É esperado nesta etapa.

O `.gitignore` não remove segredos de arquivos já rastreados e não substitui a revisão do conteúdo. A pasta `.git` é administrada pelo próprio Git e não precisa entrar no `.gitignore`.

### Limites desta autorização

Esta etapa autoriza a criação dos cinco arquivos descritos e a configuração local do repositório com `main` e `origin`. Não autoriza staging (`git add`), commit, push, instalação, criação de recursos na Azure ou ativação de automações.

## 3. Identidade e primeiro commit — concluída

O responsável escolheu o nome e o e-mail de autoria e autorizou a configuração local, o staging e o primeiro commit. Os dados foram configurados apenas neste repositório:

```bash
git config --local user.name "Anacleto Coser"
git config --local user.email "anacleto.coser@gmail.com"
```

`--local` evita modificar as preferências dos outros projetos. Nome e e-mail fazem parte do registro do commit e ficam acessíveis a quem puder consultar o histórico.

O processo tem três estados:

1. **Pasta de trabalho:** os arquivos que estamos editando.
2. **Staging:** a seleção do conteúdo que entrará na próxima versão, preparada com `git add`.
3. **Commit:** uma versão registrada no histórico local, criada com `git commit`.

Após conferir os 14 arquivos esperados, problemas de espaços e alguns padrões de credenciais, executamos:

```bash
git add -- .gitattributes .gitignore README.md LICENSE docs/guia-aprendizado.md index.html styles.css script.js assets/
git diff --cached --check
git diff --cached --stat
git commit -m "feat: cria landing page inicial da IluminArte"
```

Resultado: commit `c8a7191ee6e9a600e42775e53b8ee8492f94a981`, na branch `main`, com 14 arquivos. O prefixo `feat:` identifica a entrega de uma funcionalidade; é uma convenção de mensagem, não uma exigência do Git. A pasta de trabalho ficou limpa.

Um commit é um registro local. Ele não publica a página e não envia código ao GitHub.

## 4. Primeiro envio ao GitHub — concluída

O primeiro push recebeu autorização separada. A consulta remota confirmou que o repositório estava vazio. Como não havia autenticação disponível para escrita, foi usado o Git Credential Manager já instalado, com login pelo navegador e armazenamento da credencial no gerenciador do Windows. Nenhuma senha ou token foi colocado no código ou neste guia.

```bash
git push -u origin main
```

- `push`: envia os commits para o repositório remoto.
- `origin`: o destino configurado na etapa 2.
- `main`: a branch enviada.
- `-u`: associa a branch local a `origin/main`, permitindo acompanhar a sincronização.

A consulta remota confirmou que `refs/heads/main` tinha exatamente o SHA do commit local. `git status` mostrou `main...origin/main` e nenhuma alteração pendente.

Restrições do ambiente exigiram permissão adicional para conexão de rede e gravações em `.git`. Essas permissões de execução não substituem as autorizações do responsável para commit e push.

Código no GitHub e aplicação publicada são etapas diferentes: o site ainda não foi implantado na Azure.

## 5. Qualidade e CI — integrada e verificada

### Branch de trabalho

Com autorização, criamos uma branch a partir da `main` sincronizada:

```bash
git switch -c ci/validacoes-iniciais
```

Uma branch permite preparar uma mudança separadamente da linha principal. Sua criação não gera commit nem envia conteúdo ao GitHub.

### Ferramentas e limites

| Ferramenta    | Verificação                                                                                |
| ------------- | ------------------------------------------------------------------------------------------ |
| HTML Validate | Estrutura e regras recomendadas do HTML, incluindo verificações básicas de acessibilidade. |
| ESLint        | Problemas no JavaScript, como variáveis não definidas ou não utilizadas.                   |
| Prettier      | Formatação de HTML, CSS, JavaScript, configurações e documentação.                         |

Lint é análise estática: procura problemas sem executar o comportamento da página. Formatação padroniza o texto do código. Nenhum desses processos comprova sozinho que o menu funciona ou que a página é acessível em todos os cenários. Os testes de navegador da primeira etapa continuam sendo verificações separadas.

CSS é analisado pelo formatador quanto à leitura da sintaxe e à formatação; não há Stylelint ou validação semântica completa de CSS nesta configuração.

As ferramentas são `devDependencies`: servem ao desenvolvimento e à CI, e não são carregadas pelo visitante. O site continua abrindo diretamente no navegador e não ganhou framework, backend ou etapa de build.

### Arquivos e versões

- `package.json`: identifica o projeto, fixa pnpm e as dependências diretas, e define comandos reutilizáveis.
- `pnpm-lock.yaml`: registra as versões e integridades das dependências resolvidas; é gerado pelo gerenciador e será versionado.
- `pnpm-workspace.yaml`: configura apenas o pacote raiz. Desabilita scripts de instalação, exige runtimes compatíveis, usa dependências em estrutura plana e mantém store/cache na pasta ignorada `.cache/`.
- `.node-version`: fixa Node.js em `24.19.0`, a versão já disponível no Codex.
- `eslint.config.mjs`: aplica regras recomendadas e reconhece as variáveis de navegador de `script.js`.
- `.htmlvalidate.json`: aplica as regras recomendadas de HTML com compatibilidade com Prettier.
- `.prettierrc.json` e `.prettierignore`: definem formatação e exclusões, incluindo o lockfile gerado.
- `.github/workflows/ci.yml`: descreve as etapas para o GitHub Actions.

O pnpm já fornecido pelo Codex é `11.25.0`. As versões diretas foram consultadas no registro npm e fixadas: ESLint `10.13.0`, `@eslint/js` `10.0.1`, `globals` `17.13.0`, HTML Validate `11.17.0` e Prettier `3.9.10`.

Versões fixas tornam as alterações de ferramentas explícitas. O lockfile congelado faz a instalação falhar se o manifesto e o lockfile estiverem inconsistentes, em vez de atualizar dependências silenciosamente na CI. Isso reduz variações, mas não elimina a necessidade de atualizar e revisar dependências no futuro.

Também definimos `verifyDepsBeforeRun: error`: se `node_modules` estiver inconsistente, o pnpm falha antes de executar um comando, em vez de tentar uma instalação automática. Assim, conferir arquivos não inicia silenciosamente uma instalação de dependências.

### Comandos locais

Com `node` e `pnpm` disponíveis no terminal:

```bash
pnpm install --frozen-lockfile --ignore-scripts
pnpm run check
```

A primeira instalação, antes de existir lockfile, usa `pnpm install --ignore-scripts` para gerá-lo. As conferências posteriores e a CI usam `--frozen-lockfile`. Scripts de instalação estão desabilitados porque estas ferramentas não precisam deles; essa escolha deve ser revista se uma dependência futura exigir compilação ou preparação.

`pnpm run check` executa validação de HTML, ESLint e conferência de formatação. Também é possível chamar cada comando isoladamente:

```bash
pnpm run lint:html
pnpm run lint:js
pnpm run format:check
```

Para aplicar formatação, o comando autorizado nesta etapa é:

```bash
pnpm run format
```

`format` altera arquivos; `format:check` apenas confere. O diff deve ser revisado antes do próximo commit.

### Executar no PowerShell com o runtime do Codex

Nesta sessão, não foi necessário instalar Node ou pnpm globalmente. Os caminhos atuais são:

```text
Node: C:\Users\anacl\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
pnpm: C:\Users\anacl\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd
```

No terminal PowerShell, a adaptação abaixo altera o PATH apenas do processo atual, não as configurações globais do Windows:

```powershell
$taskNodeDir = 'C:\Users\anacl\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin'
$taskToolsDir = 'C:\Users\anacl\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback'
$env:Path = $taskNodeDir + ';' + $taskToolsDir + ';' + $env:Path
pnpm install --frozen-lockfile --ignore-scripts
pnpm run check
```

Esses caminhos podem mudar com atualizações do Codex. Quem tiver Node e pnpm compatíveis no PATH não precisa desta adaptação.

### Fluxo do GitHub Actions

Quando o workflow for enviado e estiver elegível para execução, os gatilhos serão:

- Push na `main`.
- Abertura ou atualização de pull request destinado à `main`.
- Execução manual, depois que o workflow estiver disponível na branch padrão.

Um envio apenas de `ci/validacoes-iniciais` não corresponde ao gatilho de push; a abertura de um pull request para `main` pode executar o workflow incluído nessa mudança. Portanto, a autorização futura para abrir esse PR também deverá considerar a ativação da CI e as condições de uso do GitHub Actions.

O job obtém o código, prepara Node e pnpm, instala com lockfile congelado e executa as três verificações em passos separados. Uma falha deixa a execução com erro e interrompe os passos seguintes; na CI não há correção automática de arquivos.

Escolhas de configuração:

- Executor padrão `ubuntu-24.04` e limite de dez minutos.
- `permissions: contents: read`, sem permissões de escrita no repositório.
- `persist-credentials: false` no checkout, sem manter sua credencial disponível aos comandos posteriores.
- Nenhum segredo personalizado e nenhuma credencial da Azure.
- Actions fixadas por SHA completo, confirmados nos repositórios de origem; versões legíveis em comentários.
- Cancelamento de execuções anteriores do mesmo workflow e referência/PR quando substituídas por uma nova.
- Sem caches remotos de dependências nesta primeira configuração, para reduzir configuração e armazenamento.

CI não é deploy: esse workflow não publica o site. Também não exige revisão para merge por si só; configurar proteção de branch é outra alteração remota, que dependerá de avaliação e autorização.

### Estado e limites desta etapa

A autorização inicial desta etapa cobria a implementação local, sem commit ou alterações remotas. Depois dos resultados locais, commit, envio, abertura de PR e merge receberam autorizações adicionais.

### Resultados locais

- A instalação gerou o lockfile, e uma segunda instalação com `--offline --frozen-lockfile --ignore-scripts` confirmou sua consistência usando os pacotes já baixados.
- `pnpm run check` passou: HTML Validate, ESLint e Prettier concluíram sem erros ou avisos.
- HTML Validate encontrou quatro caracteres `&` que precisavam de `&amp;` e um `aria-label` aplicado a um bloco sem papel semântico. Os caracteres foram codificados, e o bloco recebeu `role="group"`.
- ESLint identificou que `navigation` também é um global de navegador. A variável local foi renomeada para `siteNavigation`, sem alterar a lógica do menu.
- O CSS atual foi comparado com a formatação da versão do commit inicial: as diferenças são apenas de formatação.
- No Chrome, foram conferidos novamente imagens e layout em 320, 768 e 1440 pixels, menu móvel, Escape com retorno de foco, âncoras, perguntas frequentes e navegação sem JavaScript. Não houve transbordamento horizontal ou erros de execução nos cenários verificados.
- A conferência no navegador foi executada com ferramenta já disponível no Codex. Ela não foi adicionada ao workflow ou transformada em suíte versionada nesta etapa.

A proteção do ambiente também bloqueou o pnpm ao resolver o caminho da pasta; formatação e verificações locais foram concluídas com a permissão adicional de execução. Não foi necessário instalar ferramentas globalmente.

### Commit, PR e execução remota

O commit `dd3351c` registrou a configuração de qualidade. A branch `ci/validacoes-iniciais` foi enviada, e o [PR #1](https://github.com/anacletocoser/iluminarte-landing-page-azure/pull/1) foi aberto para a `main`.

A [primeira execução da CI](https://github.com/anacletocoser/iluminarte-landing-page-azure/actions/runs/39687061827) passou no ambiente Ubuntu do GitHub. Antes do merge, foram conferidos o SHA da branch, os checks e a ausência de conflitos.

Com autorização, o PR foi integrado por um commit de merge, `b42a576`, preservando o histórico. A [execução após o merge](https://github.com/anacletocoser/iluminarte-landing-page-azure/actions/runs/39687477243) também passou. A `main` local foi sincronizada com `fetch`, `switch main` e `merge --ff-only origin/main`.

O merge por API respeitou as permissões e regras do GitHub e validou o SHA aprovado. Não foi necessário clicar no site para abrir o PR ou fazer o merge. Os links continuam disponíveis para acompanhar a revisão e os logs.

O repositório foi confirmado como público, e as execuções utilizaram runners padrão Ubuntu. Essa condição é coberta pela gratuidade de Actions para repositórios públicos.

## 6. Azure pelo portal e primeira publicação manual

### Mudança de abordagem autorizada

O responsável preferiu criar e administrar o recurso pelo portal Azure e informou que ele já estava criado no plano **Free**. O endereço informado é <https://green-water-0008c3810.5.azurestaticapps.net>.

Por isso, a adaptação não instala Azure CLI ou Bicep e não cria recursos na assinatura. Também não gera infraestrutura como código para um recurso que está sendo administrado manualmente. Essa prática pode ser estudada depois, caso o responsável queira mudar a forma de administrar a infraestrutura.

A primeira publicação foi escolhida como manual. O objetivo desta etapa é preparar empacotamento, configuração de hospedagem, testes e workflow no repositório, para publicar no recurso existente quando o responsável iniciar o fluxo.

### Separar fonte e arquivos publicados

`scripts/package-site.mjs` usa apenas APIs nativas do Node. Ele gera a pasta ignorada `dist/` a partir de uma lista explícita de dez arquivos públicos. Isso evita usar a raiz do repositório como conteúdo publicado e inclui o `staticwebapp.config.json` junto à página.

O script verifica todas as entradas antes de remover uma saída anterior. Antes da remoção recursiva, confere que o destino é exatamente `dist/`, dentro da pasta real do projeto, e não um link para outra pasta.

```bash
pnpm run package:site
pnpm run test:package
```

Os testes cobrem vazamento de arquivos de desenvolvimento, limpeza de uma saída antiga, preservação da saída quando falta uma entrada e rejeição de um link no destino. Eles usam cópias em `.cache/`, sem alterar os arquivos originais da landing page.

### Configuração da hospedagem

`staticwebapp.config.json` configura cabeçalhos HTTP da Azure. A política de conteúdo permite os recursos locais usados pela página e bloqueia scripts inline, incorporação em frames, chamadas de rede e envio de formulários. A política deve ser revista se forem adicionadas integrações externas.

O cache usa revalidação (`no-cache`), porque os arquivos ainda não têm nomes com hash. Esses cabeçalhos só podem ser confirmados na hospedagem; abrir a página diretamente pelo arquivo local não aplica o arquivo de configuração Azure.

### Token e segredo do GitHub

O token de implantação fica diretamente em **Settings → Secrets and variables → Actions → New repository secret**, com o nome `AZURE_STATIC_WEB_APPS_API_TOKEN`. Ele não deve ser enviado pelo chat nem gravado no código, na documentação ou no histórico.

O responsável copia o token do recurso correto pelo portal e cadastra o valor no GitHub. Podemos conferir que o nome existe sem ler o valor original. O token determina o recurso de destino; a URL escrita no workflow não redireciona um token de outro recurso.

### Job de publicação manual

O workflow recebe uma opção booleana `deploy`, desmarcada por padrão. O job de publicação só é elegível quando:

1. O evento é uma execução manual (`workflow_dispatch`).
2. A branch é `main`.
3. A opção `deploy` está marcada.
4. O job de qualidade terminou com sucesso (`needs: quality`).

Pushes e PRs executam qualidade, empacotamento e seus testes, mas não publicam. O job de deploy obtém o mesmo SHA verificado, gera `dist/`, usa a action oficial Azure com build automático desabilitado e confere o endereço retornado após o upload. A action é fixada por um SHA confirmado no repositório oficial; o cliente de upload em container é mantido pela Microsoft.

O segredo aparece apenas nos passos que precisam dele. O workflow não precisa de permissões de escrita no repositório nem de uma credencial administrativa da assinatura Azure. Publicações não são canceladas automaticamente por uma execução mais recente.

O job declara o ambiente GitHub `production`; o primeiro uso pode criar esse registro no GitHub, sem criar infraestrutura Azure. Ele permite acompanhar deployments, mas não configura uma aprovação humana obrigatória por si só.

### Verificações locais da adaptação

As verificações estáticas passaram novamente, o pacote público foi gerado com dez arquivos e os três testes de proteção do empacotamento passaram. Nenhuma dependência nova precisou ser adicionada.

O pacote também foi servido em um servidor HTTP temporário restrito ao próprio computador, aplicando os cabeçalhos propostos. No Chrome, imagens, CSS, JavaScript e menu funcionaram em 390 e 1440 pixels, sem erros de console ou bloqueios da política de conteúdo. O servidor e o navegador de teste foram encerrados ao final. Isso é uma simulação local: os cabeçalhos e o comportamento reais da Azure ainda precisam ser conferidos após a primeira publicação.

Os cliques para cadastrar o segredo, executar o workflow e conferir a publicação estão no [guia de deploy](deploy-azure.md). A primeira publicação e a verificação dos cabeçalhos permanecem pendentes até o acionamento manual.

### Custos e responsabilidade sobre o recurso

O plano Free foi confirmado pelo responsável. Não há acesso administrativo da sessão à assinatura para auditar plano ou cobranças; o responsável deve conferir recursos adicionais no portal. O fluxo estático preparado não necessita de recursos pagos, banco de dados ou APIs. A publicação automática após mudanças na `main` será uma alteração explícita posterior.

## Registro de etapas

| Data       | Etapa              | Resultado                                                                                                  |
| ---------- | ------------------ | ---------------------------------------------------------------------------------------------------------- |
| 21/10/2026 | Landing page       | Primeira versão local implementada e verificada no Chrome.                                                 |
| 21/10/2026 | Documentação e Git | Criação dos arquivos e configuração local de `main` e `origin`, sem commit ou envio remoto.                |
| 21/10/2026 | Primeiro commit    | `c8a7191`, com autoria local aprovada e 14 arquivos.                                                       |
| 21/10/2026 | Primeiro envio     | `main` enviada ao GitHub e SHA remoto confirmado.                                                          |
| 21/10/2026 | Qualidade e CI     | PR #1 integrado em `b42a576`; CI passou no PR e na `main`.                                                 |
| 21/10/2026 | Azure pelo portal  | Recurso Free informado pelo responsável; configuração de deploy manual preparada para o recurso existente. |
