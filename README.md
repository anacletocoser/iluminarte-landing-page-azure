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
- Configuração de qualidade e CI preparada localmente na branch `ci/validacoes-iniciais`.
- Workflow ainda não enviado nem executado no GitHub; publicação na Azure pendente.

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

## Integração contínua (CI)

O arquivo [`.github/workflows/ci.yml`](.github/workflows/ci.yml) está preparado localmente. Ele só poderá executar no GitHub depois de enviado e quando o evento e as políticas do repositório permitirem. Nenhuma execução remota foi realizada nesta etapa.

Gatilhos configurados:

- Push na branch `main`.
- Abertura ou atualização de pull request destinado à `main`.
- Execução manual em **Actions**, depois que o workflow estiver disponível na branch padrão.

O job usa um executor padrão Ubuntu, Node e pnpm definidos pelo projeto e a instalação com lockfile congelado. Depois executa as mesmas três verificações disponíveis localmente. Um push apenas na branch de trabalho não dispara o gatilho de push; um pull request dessa branch para `main` pode disparar a CI.

As actions são fixadas por SHA completo, com a versão legível em comentário. O workflow tem permissão `contents: read`, não persiste a credencial de checkout, não usa segredos personalizados e tem limite de dez minutos. Execuções anteriores do mesmo grupo são canceladas quando substituídas por uma nova.

Essas verificações não substituem testes de comportamento no navegador, revisão de conteúdo, auditoria de acessibilidade ou validação do deploy. O workflow também não impõe uma proteção de branch: tornar um resultado obrigatório para merge é uma configuração separada do GitHub.

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
│   └── guia-aprendizado.md     # Etapas, decisões e comandos explicados
├── .github/workflows/ci.yml    # Verificações no GitHub Actions
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

Essas verificações foram executadas durante a implementação com ferramentas disponíveis no Codex. Ainda não existe uma suíte versionada de testes de comportamento no navegador. A prévia por HTTP local encontrou uma restrição do ambiente; a validação visual foi feita abrindo o arquivo diretamente no navegador. A configuração de CI acrescenta verificações estáticas reproduzíveis; sua execução remota ainda está pendente.

Na preparação da CI, `pnpm run check` passou localmente nas três verificações. Foram corrigidos quatro caracteres `&` no HTML, o papel semântico de um bloco com rótulo acessível e o nome de uma variável que coincidia com o global `navigation` dos navegadores. O CSS mudou apenas de formatação. Após as correções, o menu, as âncoras, o foco por Escape, as perguntas frequentes e a navegação sem JavaScript foram conferidos novamente no Chrome, junto ao carregamento das imagens e ao layout em 320, 768 e 1440 pixels.

## Fluxo de desenvolvimento planejado

1. Revisar as alterações localmente.
2. Criar commits pequenos, com mensagens que descrevam o resultado.
3. Usar branches e pull requests para as próximas melhorias.
4. Automatizar verificações com GitHub Actions (**CI**, integração contínua).
5. Publicar com Azure Static Web Apps no plano Free (**CD**, entrega ou implantação contínua, conforme a configuração escolhida).
6. Aprender a acompanhar uma publicação e retornar a uma versão anterior.

A criação de recursos e a ativação de deploy automático dependerão de autorização específica. Um workflow automático, depois de habilitado, executa conforme os gatilhos configurados; essa consequência será explicada antes de sua ativação.

## Azure e custos

O destino planejado é Azure Static Web Apps no plano Free, com o endereço fornecido pelo serviço. Ainda não há infraestrutura Azure criada por este projeto nem deploy configurado.

Antes da publicação, serão conferidos plano, cotas, cobrança e permissões na assinatura do responsável. A gratuidade depende dos serviços e das condições efetivamente utilizados; não criaremos recursos pagos como parte do fluxo inicial. No GitHub Actions, também será necessário conferir a visibilidade do repositório e a franquia aplicável à conta.

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
