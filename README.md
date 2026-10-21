# IluminArte — Luz, aroma e arte

Landing page da IluminArte, com apresentação de velas, sabonetes artesanais, produtos em MDF com corte a laser e kits personalizados.

Este também é um projeto de aprendizado: acompanhar a criação de uma aplicação simples, do desenvolvimento local ao versionamento no GitHub e à publicação na Azure com CI/CD.

## Estado atual

- Landing page local implementada em HTML, CSS e JavaScript.
- Logo da marca incorporada como uma cópia do arquivo original.
- Imagens de produtos ilustrativas, criadas em SVG; não são fotografias nem um catálogo de modelos disponíveis.
- Layout responsivo, menu para telas pequenas e perguntas frequentes expansíveis.
- Contatos demonstrativos: esta versão não recebe pedidos nem pagamentos.
- Primeiro commit `c8a7191` enviado e confirmado na branch `main` do GitHub.
- CI integrada à `main` pelo [PR #1](https://github.com/anacletocoser/iluminarte-landing-page-azure/pull/1), com execuções bem-sucedidas no PR e após o merge.
- Azure Static Web App criado manualmente pelo responsável no plano Free.
- Empacotamento público e deploy manual integrados pelo [PR #2](https://github.com/anacletocoser/iluminarte-landing-page-azure/pull/2).
- Primeira publicação concluída e verificada em [green-water-0008c3810.5.azurestaticapps.net](https://green-water-0008c3810.5.azurestaticapps.net).
- Deploy automático após push ou merge na `main`, condicionado ao sucesso da qualidade; execução manual mantida como alternativa.

Repositório informado para este projeto: [anacletocoser/iluminarte-landing-page-azure](https://github.com/anacletocoser/iluminarte-landing-page-azure).

## Visualizar localmente

1. Abra a pasta do projeto no Explorador de Arquivos.
2. Abra `index.html` no Chrome, Edge ou outro navegador moderno.
3. Altere o código, salve o arquivo e atualize o navegador para ver o resultado.

Para visualizar a página, não é necessário instalar dependências nem realizar um build. Os caminhos de CSS, JavaScript e imagens são relativos, permitindo abrir a página diretamente pelo arquivo. As dependências adicionadas ao projeto servem às verificações de desenvolvimento, não à execução da página no navegador.

Para verificar a adaptação a celular, abra as ferramentas de desenvolvedor do navegador (`F12`) e ative a visualização de dispositivos. Abrir por arquivo é suficiente para esta versão; funcionalidades futuras podem exigir um servidor HTTP local.

## Executar as verificações de qualidade

Requisitos desta configuração: Node.js **24.19.0** (registrado em `.node-version`) e pnpm **11.25.0** (registrado em `package.json`). Não é necessário instalar Node ou pnpm globalmente quando os executáveis fornecidos pelo Codex estão disponíveis; veja os caminhos e exemplos no [guia de aprendizado](docs/guia-aprendizado.md).

Com os executáveis disponíveis no terminal, execute na pasta do projeto:

```bash
pnpm install --frozen-lockfile --ignore-scripts
pnpm run check
```

O primeiro comando baixa as versões registradas no `pnpm-lock.yaml`, sem executar scripts de instalação. O segundo executa, em sequência:

| Comando                 | Responsabilidade                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `pnpm run lint:html`    | Valida o HTML com HTML Validate e suas regras recomendadas.                         |
| `pnpm run lint:js`      | Analisa o JavaScript com ESLint, incluindo variáveis inexistentes e não utilizadas. |
| `pnpm run format:check` | Confere a formatação com Prettier, sem alterar os arquivos.                         |

Para aplicar a formatação localmente:

```bash
pnpm run format
```

Esse último comando **altera os arquivos**. Confira o diff antes de preparar um commit. Ele ignora dependências, caches e o lockfile gerado. A logo PNG não é reformatada.

O `package.json` é marcado como `private` para impedir publicação acidental como pacote; isso não altera a visibilidade do repositório no GitHub. As versões diretas das ferramentas são exatas, e o lockfile registra as dependências resolvidas. Não edite o lockfile manualmente.

O `pnpm-workspace.yaml` configura um único projeto: define versões exatas ao adicionar dependências, verifica a versão do runtime, desabilita scripts de instalação e mantém armazenamento e cache em `.cache/`, que não é versionada. Se as dependências locais estiverem inconsistentes, os comandos falham e pedem uma instalação explícita, em vez de instalar automaticamente. Não há monorepo ou múltiplos pacotes nesta configuração.

## Integração e implantação contínuas (CI/CD)

O arquivo [`.github/workflows/ci.yml`](.github/workflows/ci.yml) reúne as verificações, o empacotamento e a publicação na Azure. A configuração atual publica automaticamente após um push ou merge na `main`, depois que a qualidade passa.

Gatilhos configurados:

- Push na branch `main`.
- Abertura ou atualização de pull request destinado à `main`.
- Execução manual em **Actions**, depois que o workflow estiver disponível na branch padrão.

O job de qualidade usa um executor padrão Ubuntu, Node e pnpm definidos pelo projeto e a instalação com lockfile congelado. Executa as três verificações estáticas, gera o pacote público e testa a proteção do empacotamento. Um push apenas na branch de trabalho não dispara o gatilho de push; um pull request dessa branch para `main` pode disparar a CI.

O job de deploy depende do sucesso da qualidade (`needs: quality`) e exige a branch `main`. Ele executa em eventos de push, incluindo commits de merge, ou em acionamento manual com a opção `deploy` marcada. PRs apenas validam e não publicam. O job obtém o mesmo SHA verificado, recria `dist/` com Node e envia o pacote usando o segredo `AZURE_STATIC_WEB_APPS_API_TOKEN`. Uma falha na qualidade impede a publicação daquela execução. Até mudanças somente na documentação disparam o fluxo completo quando entram na `main`.

As actions são fixadas por SHA completo, com a versão legível em comentário. O workflow tem permissão `contents: read` e não persiste a credencial de checkout. A qualidade tem limite de dez minutos; o deploy, quinze. PRs podem cancelar verificações anteriores substituídas por uma nova; publicações não são canceladas automaticamente por uma execução mais recente.

Essas verificações não substituem testes de comportamento no navegador, revisão de conteúdo, auditoria de acessibilidade ou validação do deploy. O workflow também não impõe uma proteção de branch: tornar um resultado obrigatório para merge é uma configuração separada do GitHub.

## Pacote de publicação

```bash
pnpm run package:site
pnpm run test:package
```

`package:site` recria `dist/` com uma lista explícita de dez arquivos públicos: página, CSS, JavaScript, configuração de hospedagem, logo e ilustrações. Não há compilação de framework. `dist/`, dependências, caches, documentação, metadados Git e segredos não são adicionados ao histórico como pacote de publicação.

O script confere os arquivos antes de substituir a saída anterior e recusa um destino `dist` que seja um link para outra pasta. Os testes verificam exclusão de arquivos de desenvolvimento, limpeza de saída antiga, preservação da saída quando falta uma entrada e recusa de um link no destino.

Para adicionar uma nova imagem ao site publicado, inclua-a na lista de `scripts/package-site.mjs` e revise a mudança. A Azure recebe somente `dist/`, com o build automático desabilitado.

## Primeira publicação na Azure

Recurso informado pelo responsável: [green-water-0008c3810.5.azurestaticapps.net](https://green-water-0008c3810.5.azurestaticapps.net), plano **Free**, criado pelo portal Azure.

O primeiro deploy foi autorizado e acionado pelo chat como execução manual da `main`, com `deploy: true`. A [execução 39690752800](https://github.com/anacletocoser/iluminarte-landing-page-azure/actions/runs/39690752800) publicou o commit `1f161b2` e concluiu com sucesso os jobs de qualidade e publicação.

Na conferência ao vivo, a página respondeu HTTP 200, os nove arquivos servidos da página coincidiram por hash com as fontes e os seis cabeçalhos configurados foram confirmados. Menu, Escape/foco, âncoras, perguntas frequentes e imagens funcionaram no Chrome em 390/1440 pixels, sem erros de console. Caminhos de README, package.json, guia, `.git/config` e `.env` retornaram HTTP 404.

O pacote inclui dez arquivos porque `staticwebapp.config.json` é enviado para configurar a hospedagem, além dos nove arquivos servidos e comparados. A comparação não depende de tornar a configuração de hospedagem publicamente acessível.

As instruções abaixo permitem repetir uma publicação sob demanda:

Cadastre o token diretamente no GitHub em **Settings → Secrets and variables → Actions → New repository secret**, com o nome exato `AZURE_STATIC_WEB_APPS_API_TOKEN`. Nunca cole o token no chat, nos arquivos ou em um commit. O secret deve pertencer ao recurso acima; o endereço documentado não seleciona por si só o destino do token.

Depois que a configuração estiver na `main`, use **Actions → CI e deploy Azure → Run workflow**, selecione `main` e marque a opção **Publicar na Azure após as verificações**. A opção fica desmarcada por padrão. O job de qualidade precisa passar antes da publicação. O job de deploy verifica a presença do segredo e confere o endereço retornado pela Azure após o upload.

O recurso Azure é administrado pelo portal, conforme a preferência do responsável. O fluxo não instala Azure CLI ou Bicep e não cria infraestrutura. As próximas alterações na `main` publicam automaticamente após as verificações, sem precisar clicar em **Run workflow**.

Veja o [guia de deploy pelo portal e GitHub](docs/deploy-azure.md) para os cliques, verificações e recuperação de uma versão anterior.

## Organização

```text
.
├── index.html                  # Estrutura e conteúdo
├── styles.css                  # Aparência e responsividade
├── script.js                   # Interações do menu
├── assets/
│   ├── iluminarte.png          # Logo fornecida pela marca
│   ├── favicon.svg            # Ícone ilustrativo do projeto
│   ├── kit-artesanal.svg       # Composição ilustrativa
│   ├── vela.svg
│   ├── sabonetes.svg
│   └── caixa-mdf.svg
├── docs/
│   ├── guia-aprendizado.md     # Etapas, decisões e comandos explicados
│   └── deploy-azure.md         # Portal, segredo e primeira publicação manual
├── .github/workflows/ci.yml    # Verificações no GitHub Actions
├── scripts/
│   ├── package-site.mjs        # Lista de arquivos públicos e geração de dist/
│   └── package-site.test.mjs   # Testes de proteção do empacotamento
├── staticwebapp.config.json   # Cabeçalhos enviados pela hospedagem
├── package.json               # Ferramentas e comandos de desenvolvimento
├── pnpm-lock.yaml             # Versões resolvidas das dependências
├── pnpm-workspace.yaml        # Configurações locais do gerenciador
├── .node-version              # Versão do Node usada na CI
├── eslint.config.mjs          # Regras para JavaScript
├── .htmlvalidate.json         # Regras para HTML
├── .prettierrc.json            # Convenções de formatação
├── .prettierignore             # Exclusões da formatação
├── .gitignore                  # Arquivos que o Git deve ignorar
├── .gitattributes              # Convenções de texto e arquivos binários
├── LICENSE                    # Licença e escopo de aplicação
└── README.md
```

## Decisões de implementação

- **HTML semântico:** seções, títulos, navegação, textos alternativos e link para pular ao conteúdo.
- **CSS responsivo:** layouts adaptados à largura disponível e cores centralizadas em variáveis.
- **JavaScript como melhoria:** o menu compacto é adicionado quando há JavaScript; a navegação continua disponível sem ele.
- **Acessibilidade:** foco visível, fechamento do menu por Escape, estado `aria-expanded` e respeito à preferência de movimento reduzido. Isso não equivale a uma auditoria completa de acessibilidade.
- **Recursos locais:** fontes do sistema, logo e ilustrações locais, sem bibliotecas, rastreadores ou serviços externos carregados pela página.
- **Escopo simples:** sem backend, banco de dados, autenticação ou processamento de pagamentos nesta etapa.

## Verificações realizadas

Na primeira versão, foram feitas verificações locais no Chrome:

- Larguras de 320, 390, 768, 1024 e 1440 pixels, sem transbordamento horizontal.
- Carregamento das imagens e existência de apenas um título principal `h1`.
- Abertura e fechamento do menu, Escape com retorno de foco e navegação por âncoras.
- Expansão das perguntas frequentes e navegação disponível sem JavaScript.
- Sintaxe do JavaScript, referências locais, IDs duplicados e estrutura XML dos SVGs.
- Integridade da cópia da logo, comparada ao original por hash.

Essas verificações foram executadas durante a implementação com ferramentas disponíveis no Codex. Ainda não existe uma suíte versionada de testes de comportamento no navegador. A prévia por HTTP local encontrou uma restrição do ambiente; a validação visual foi feita abrindo o arquivo diretamente no navegador. As verificações estáticas também passaram no GitHub Actions; o empacotamento acrescenta testes de arquivos nesta etapa.

Na preparação da CI, `pnpm run check` passou localmente nas três verificações. Foram corrigidos quatro caracteres `&` no HTML, o papel semântico de um bloco com rótulo acessível e o nome de uma variável que coincidia com o global `navigation` dos navegadores. O CSS mudou apenas de formatação. Após as correções, o menu, as âncoras, o foco por Escape, as perguntas frequentes e a navegação sem JavaScript foram conferidos novamente no Chrome, junto ao carregamento das imagens e ao layout em 320, 768 e 1440 pixels.

## Fluxo de desenvolvimento planejado

1. Revisar as alterações localmente.
2. Criar commits pequenos, com mensagens que descrevam o resultado.
3. Usar branches e pull requests para as próximas melhorias.
4. Automatizar verificações com GitHub Actions (**CI**, integração contínua).
5. Publicar com Azure Static Web Apps no plano Free (**CD**, entrega ou implantação contínua, conforme a configuração escolhida).
6. Aprender a acompanhar uma publicação e retornar a uma versão anterior.

O responsável autorizou as modificações locais e no repositório para adaptar o deploy ao recurso já criado. A primeira publicação foi manual; depois, autorizou explicitamente a ativação do deploy automático na `main`. A automação não substitui as autorizações combinadas para mudanças, commits e envios futuros.

## Azure e custos

O destino é o Static Web App Free criado pelo responsável pelo portal Azure. A confirmação do plano foi fornecida no chat; o projeto não tem acesso administrativo à assinatura para auditar sua cobrança.

O responsável deve manter o plano Free e conferir possíveis recursos adicionais criados na assinatura. O repositório foi confirmado como público, e o workflow usa executores padrão Ubuntu, cobertos pela gratuidade de Actions para repositórios públicos. Nenhum recurso pago é necessário para este fluxo estático.

Referências para consulta na etapa de publicação:

- [Planos do Azure Static Web Apps](https://learn.microsoft.com/azure/static-web-apps/plans)
- [Cobrança do GitHub Actions](https://docs.github.com/en/billing/concepts/product-billing/github-actions)

## Configurações e segredos

O `.gitignore` exclui arquivos locais como `.env`, chaves privadas e saídas de ferramentas. Ele não detecta todos os segredos e não remove arquivos que já estejam versionados. Revise o conteúdo antes de cada commit e não coloque credenciais no HTML, JavaScript, documentação ou histórico do Git.

`node_modules/` e `.cache/` são locais e não devem entrar em commits. Os padrões de build permanecem preparados para uma eventual etapa futura; o site atual não tem compilação.

## Licença e identidade visual

O código, a documentação e as ilustrações SVG originais deste projeto são disponibilizados sob a [licença MIT](LICENSE), com autoria identificada pelo usuário GitHub `anacletocoser`.

O arquivo `assets/iluminarte.png`, o nome IluminArte e os elementos de identidade da marca não são licenciados pela MIT deste repositório. A presença desses elementos no projeto não concede permissão para reutilizar a marca ou sua logo.

## Guia do aprendizado

Leia o [guia de aprendizado](docs/guia-aprendizado.md) para acompanhar o que já foi feito, o significado dos comandos e as próximas etapas.
