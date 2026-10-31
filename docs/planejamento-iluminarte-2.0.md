# IluminArte 2.0 — planejamento de implementação

Atualizado em 31/10/2026. Estado: planejamento pronto para transferência pelo GitHub; implementação 2.0 ainda não iniciada.

## Objetivo e acordos

Evoluir a landing page para um site com catálogo, preços e montagem de combinações, mantendo as cores bege, marrom e verde e a identidade artística da marca. Acrescentar animações e interações sem prejudicar a navegação, a acessibilidade ou o uso em celulares.

- Manter o site atual em produção durante todo o desenvolvimento.
- Implementar a nova versão na branch dedicada `feat/reestruturacao-iluminarte`, cuja criação e envio do planejamento foram autorizados em 31/10/2026.
- Manter alterações e futuros envios ao GitHub nessa branch, sem merge na `main` durante o desenvolvimento.
- Comparar a nova versão local com a produção atual, lado a lado.
- Não criar publicações intermediárias ou ambientes de prévia na Azure. A publicação ocorrerá apenas no final, após validação local e aprovação explícita do responsável para o merge.
- O merge final na `main` disparará a CI e, após sucesso, o deploy automático existente.
- Em 31/10/2026, o responsável autorizou criar a branch, registrar e enviar este planejamento e concedeu autonomia para ações rotineiras dentro do escopo solicitado, sem confirmações a cada alteração, teste, commit ou envio. Continuar explicando as etapas. Preservar a aprovação explícita para o merge e a publicação final da versão 2.0, ações destrutivas, custos e mudanças fora do escopo. As permissões técnicas do ambiente continuam aplicáveis.
- Usar arquivos estáticos, sem banco de dados, backend, cadastro administrativo, checkout ou pagamentos. Produtos serão adicionados gradualmente pelo código, com auxílio deste chat.
- Preservar a administração da Azure pelo portal e o recurso Free existente. Qualquer integração nova deverá ser verificada quanto a requisitos e custos antes de sua adoção.

## Mapa do site

```text
Início
├── Apresentação com carrossel de fotos reais da loja/produtos
├── Coleções: Velas · Sabonetes · MDF
├── Sobre a IluminArte
├── Convite “Vamos criar juntos”
├── Perguntas frequentes
└── Contatos e localização
    ├── Canais oficiais e endereço
    ├── Google Maps incorporado em um quadro
    └── Botão “Abrir rotas no Google Maps”

Catálogo
├── Todos · Velas · Sabonetes · MDF · Kits
├── Busca, filtros e indicação da categoria ativa
├── Produtos com imagem, descrição, opções e preço
└── Acesso a “Monte sua combinação”

Monte sua combinação
├── Produtos, opções e quantidades
├── Caixa MDF opcional e preferências de personalização
├── Resumo e total estimado
└── Mensagem pronta para envio pelo WhatsApp
```

Menu principal: **Início · Coleções · Catálogo · Sobre · Contatos**, com **“Vamos criar juntos”** como botão de destaque. Nas páginas internas, os links de seções levam à respectiva seção da página inicial.

## Comportamento das áreas

### Início, fotos e identidade visual

O carrossel inicial usará exclusivamente fotos reais fornecidas pela loja, não ilustrações ou fotos geradas por IA. Terá controles visíveis, navegação por teclado, suporte a toque, imagens responsivas e textos alternativos. Se houver reprodução automática, oferecer pausa e respeitar movimento reduzido. Não apresentar imagens de teste como fotografias reais da loja.

As ilustrações usadas em outras áreas podem receber mais detalhes, texturas, elementos botânicos e sombras, mantendo um padrão artístico consistente. Elas não substituem as fotos reais do carrossel. A escolha de fotos ou ilustrações para cada produto será revisada com o responsável; imagens ilustrativas não devem sugerir modelos reais disponíveis.

Adicionar entradas suaves durante a rolagem, transições de filtros e movimentos discretos em cartões e elementos visuais. O conteúdo deverá permanecer acessível sem animações e sem depender delas para ser compreendido.

Manter Sobre e Perguntas frequentes, ajustando o conteúdo às encomendas. Remover do rodapé “Projeto de aprendizado · versão demonstrativa”.

### Catálogo e dados estáticos

Organizar os produtos em um arquivo de dados com identificador estável, nome, categoria, descrição, imagens, preço, opções e informações de personalização. Manter dados separados da renderização para evitar duplicar HTML ao cadastrar produtos.

Os três destaques de Coleções abrirão o catálogo com filtro correspondente, por exemplo `catalogo.html?categoria=velas`. A categoria ativa ficará visível; será possível trocar o filtro ou selecionar “Todos os produtos”. Busca por nome, estados sem resultados e categorias ainda vazias deverão ser tratados explicitamente. Não será obrigatória uma página individual por produto nesta etapa; os detalhes podem ser expansíveis.

Os preços serão armazenados em centavos e exibidos em reais, com formatação brasileira. Produtos com preço definido entram no cálculo. Itens com “a partir de” devem identificar o valor base e o que depende de orçamento. Personalização e frete sem valor definido aparecem como “a consultar”, nunca como gratuitos. O total será explicitamente estimado quando houver valores pendentes.

Usar dados de teste identificados durante o desenvolvimento. Antes da publicação, revisar produtos, preços e imagens com o responsável; não apresentar exemplos como oferta real.

### Monte sua combinação e WhatsApp

Página sugerida: `catalogo/monte-seu-kit.html`. Permitir escolher produtos e opções disponíveis, incluir uma caixa MDF, definir quantidades, remover itens e registrar observações. Atualizar subtotais e total estimado automaticamente. Validar quantidades e opções antes de gerar o resumo.

Preservar o rascunho no próprio navegador, sem servidor, permitindo limpar a seleção. Tratar armazenamento indisponível e produtos que tenham sido alterados ou removidos desde a última visita.

O botão “Enviar minha combinação pelo WhatsApp” abrirá o canal oficial com uma mensagem preenchida contendo produtos, opções, quantidades, valores conhecidos, total estimado e observações. A mensagem solicitará confirmação de disponibilidade, orçamento e prazo. O cliente revisa e confirma o envio no WhatsApp; o site não envia mensagens sozinho e a seleção não constitui pedido confirmado.

O número oficial será fornecido antes da integração final. Testar acentos, quebras de linha, seleções extensas, celular e computador, oferecendo uma alternativa para copiar o resumo caso necessário.

### Contatos e localização no Google Maps

Adicionar à seção Contatos o endereço em texto e um mapa Google Maps incorporado em um quadro responsivo dentro do site. O visitante poderá consultar a localização sem sair da página.

Adicionar um botão explícito “Abrir rotas no Google Maps”, com destino na localização confirmada da loja. O serviço Google Maps poderá permitir iniciar a navegação no celular; o site não precisa solicitar acesso à localização do visitante nem garante que a navegação GPS inicie automaticamente.

Antes de implementar, confirmar endereço completo e ponto exato ou link compartilhado do local, bem como se o endereço deve ser divulgado publicamente. Não inventar uma localização. Verificar a forma de incorporação disponível sem cobrança ou habilitação desnecessária de APIs pagas.

Usar carregamento adiado do mapa, título acessível e alternativa em texto/link se o conteúdo externo não carregar. Revisar a política de conteúdo em `staticwebapp.config.json` para permitir somente os domínios externos necessários ao mapa, preservando as demais restrições. Considerar o carregamento de conteúdo de terceiros na informação de privacidade do site.

## Etapas e critérios de conclusão

1. **Preparação e isolamento:** conferir instruções, Git e arquivos existentes; criar a branch dedicada com autorização; conferir gatilhos de publicação. Concluir com produção e `main` preservadas.
2. **Estrutura e navegação:** criar catálogo e montador; organizar estilos e elementos comuns; atualizar menu, Contatos e rodapé. Concluir com todos os caminhos funcionando em computador e celular.
3. **Dados dos produtos:** definir estrutura estática de produtos, opções, imagens e preços; adaptar o empacotamento público às novas páginas e recursos. Concluir com inclusão de produto sem duplicação de estrutura e sem exposição de arquivos internos.
4. **Catálogo:** implementar cartões, detalhes, preços, busca, filtros no endereço e estados vazios; ligar Coleções ao filtro correto. Concluir com troca e remoção de filtros funcionando de forma clara.
5. **Montagem da combinação:** implementar seleção, opções, quantidades, remoção, observações, cálculos e rascunho local. Concluir com resumo consistente e tratamento de seleções inválidas ou antigas.
6. **WhatsApp:** gerar a mensagem pronta e integrar o número oficial. Concluir com conteúdo correto e envio sob controle do cliente, incluindo alternativa para copiar o resumo.
7. **Fotos, arte e movimento:** incorporar fotos reais autorizadas ao carrossel; refinar ilustrações das demais áreas e animações. Concluir com identidade consistente, imagens otimizadas, controles acessíveis e movimento reduzido respeitado.
8. **Localização:** confirmar endereço e destino; incorporar mapa e botão de rotas; ajustar política de conteúdo. Concluir com mapa responsivo, endereço legível, alternativa de acesso e link de destino correto em celular e computador.
9. **Validação e publicação final:** revisar conteúdo real, valores, cálculos, navegação, teclado, foco, contraste, movimento reduzido, desempenho, armazenamento e pacote público; executar CI e testes pertinentes. Comparar as versões, preparar PR final e aguardar aprovação explícita para merge. Após o merge autorizado, acompanhar CI/deploy e conferir a produção.

Cada etapa terá entrega local revisável e explicação do que mudou e como foi verificado. Commits serão organizados por etapa dentro da autonomia concedida. Nenhum envio da branch de desenvolvimento deverá publicar o site.

## Informações e materiais para a retomada

- Fotos reais para o carrossel, com identificação dos produtos e autorização de uso.
- Número oficial do WhatsApp com DDD e perfil do Instagram.
- Endereço completo, confirmação de divulgação pública e link/ponto exato no Google Maps.
- Primeiros produtos reais: nomes, categorias, descrições, imagens, preços e opções.
- Regras de personalização, embalagem/caixas, disponibilidade, prazo e frete a comunicar.

Esses materiais podem ser fornecidos gradualmente. A estrutura poderá ser desenvolvida com estados vazios e dados de teste claramente identificados, mas a revisão de conteúdo real é requisito para a publicação final.

## Ponto de retomada

O responsável solicitou pausa após salvar este plano e, em 31/10/2026, autorizou sua transferência por uma branch no GitHub para continuar em outro computador. Esta preparação inclui branch, commit e push do planejamento; não inicia a implementação 2.0 nem inclui merge ou publicação. Na outra máquina, clonar o repositório, selecionar `feat/reestruturacao-iluminarte` e ler este documento, o README e o guia de aprendizado. Depois de conferir o ambiente, retomar a etapa 1 quando solicitado. Ferramentas e autenticações locais precisam ser verificadas na nova máquina; não copiar tokens ou arquivos de credenciais.
