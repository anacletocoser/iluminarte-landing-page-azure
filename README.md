# IluminArte — Luz, aroma e arte

Landing page da IluminArte, com apresentação de velas, sabonetes artesanais, produtos em MDF com corte a laser e kits personalizados.

Este também é um projeto de aprendizado: acompanhar a criação de uma aplicação simples, do desenvolvimento local ao versionamento no GitHub e à publicação na Azure com CI/CD.

## Estado atual

- Landing page local implementada em HTML, CSS e JavaScript.
- Logo da marca incorporada como uma cópia do arquivo original.
- Imagens de produtos ilustrativas, criadas em SVG; não são fotografias nem um catálogo de modelos disponíveis.
- Layout responsivo, menu para telas pequenas e perguntas frequentes expansíveis.
- Contatos demonstrativos: esta versão não recebe pedidos nem pagamentos.
- Documentação e configuração inicial de Git preparadas.
- Commit inicial, envio ao GitHub, workflows e publicação na Azure ainda pendentes.

Repositório informado para este projeto: [anacletocoser/iluminarte-landing-page-azure](https://github.com/anacletocoser/iluminarte-landing-page-azure).

## Visualizar localmente

1. Abra a pasta do projeto no Explorador de Arquivos.
2. Abra `index.html` no Chrome, Edge ou outro navegador moderno.
3. Altere o código, salve o arquivo e atualize o navegador para ver o resultado.

Nesta versão, não é necessário instalar dependências, executar `npm install` ou realizar um build. Os caminhos de CSS, JavaScript e imagens são relativos, permitindo abrir a página diretamente pelo arquivo.

Para verificar a adaptação a celular, abra as ferramentas de desenvolvedor do navegador (`F12`) e ative a visualização de dispositivos. Abrir por arquivo é suficiente para esta versão; funcionalidades futuras podem exigir um servidor HTTP local.

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

Essas verificações foram executadas durante a implementação com ferramentas disponíveis no Codex. Ainda não existe uma suíte de testes versionada nem um workflow de CI no repositório. A prévia por HTTP local encontrou uma restrição do ambiente; a validação visual foi feita abrindo o arquivo diretamente no navegador.

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

Os padrões de dependências e build estão preparados para ferramentas que poderão ser adotadas depois; sua presença não significa que elas já foram instaladas.

## Licença e identidade visual

O código, a documentação e as ilustrações SVG originais deste projeto são disponibilizados sob a [licença MIT](LICENSE), com autoria identificada pelo usuário GitHub `anacletocoser`.

O arquivo `assets/iluminarte.png`, o nome IluminArte e os elementos de identidade da marca não são licenciados pela MIT deste repositório. A presença desses elementos no projeto não concede permissão para reutilizar a marca ou sua logo.

## Guia do aprendizado

Leia o [guia de aprendizado](docs/guia-aprendizado.md) para acompanhar o que já foi feito, o significado dos comandos e as próximas etapas.
