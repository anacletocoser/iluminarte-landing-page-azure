# IluminArte 2.0 — planejamento de implementação

Atualizado em 31/10/2026. Estado: implementação local 2.0 disponível para revisão; contatos oficiais configurados e localização limitada a Aracruz–ES; validação final pendente.

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
├── Sobre a IluminArte
├── Convite “Vamos criar juntos”
├── Perguntas frequentes
└── Contatos e localização
    ├── WhatsApp de vendas e Instagram
    └── Cidade: Aracruz–ES (sem endereço ou mapa)

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

Menu principal: **Início · Catálogo · Sobre · Contatos**, com **“Compre aqui”** como botão de destaque. Nas páginas internas, os links de seções levam à respectiva seção da página inicial.

## Comportamento das áreas

### Início, fotos e identidade visual

O carrossel inicial usa fotos reais dos produtos e o vídeo de feedback fornecido pela marca, sem imagens geradas por IA. O vídeo tem controles, reprodução manual e pausa ao trocar de item. Terá controles visíveis, navegação por teclado, suporte a toque, imagens responsivas e textos alternativos. Se houver reprodução automática, oferecer pausa e respeitar movimento reduzido. Não apresentar imagens de teste como fotografias reais da loja.

As ilustrações usadas em outras áreas podem receber mais detalhes, texturas, elementos botânicos e sombras, mantendo um padrão artístico consistente. Elas não substituem as fotos reais do carrossel. A escolha de fotos ou ilustrações para cada produto será revisada com o responsável; imagens ilustrativas não devem sugerir modelos reais disponíveis.

Adicionar entradas suaves durante a rolagem, transições de filtros e movimentos discretos em cartões e elementos visuais. O conteúdo deverá permanecer acessível sem animações e sem depender delas para ser compreendido.

Manter Sobre e Perguntas frequentes, ajustando o conteúdo às encomendas. Remover do rodapé “Projeto de aprendizado · versão demonstrativa”.

### Catálogo e dados estáticos

Organizar os produtos em um arquivo de dados com identificador estável, nome, categoria, descrição, imagens, preço, opções e informações de personalização. Manter dados separados da renderização para evitar duplicar HTML ao cadastrar produtos.

O catálogo oferece filtros de categoria no endereço, busca por nome/categoria e estados sem resultados. A busca na página inicial mostra sugestões e encaminha ao catálogo com `?q=termo`, já filtrado. A categoria ativa permanece visível e pode ser trocada ou removida.

Os preços serão armazenados em centavos e exibidos em reais, com formatação brasileira. Produtos com preço definido entram no cálculo. Itens com “a partir de” devem identificar o valor base e o que depende de orçamento. Personalização e frete sem valor definido aparecem como “a consultar”, nunca como gratuitos. O total será explicitamente estimado quando houver valores pendentes.

Usar dados de teste identificados durante o desenvolvimento. Antes da publicação, revisar produtos, preços e imagens com o responsável; não apresentar exemplos como oferta real.

### Monte sua combinação e WhatsApp

Página sugerida: `catalogo/monte-seu-kit.html`. Permitir escolher produtos e opções disponíveis, incluir uma caixa MDF, definir quantidades, remover itens e registrar observações. Atualizar subtotais e total estimado automaticamente. Validar quantidades e opções antes de gerar o resumo.

Preservar o rascunho no próprio navegador, sem servidor, permitindo limpar a seleção. Tratar armazenamento indisponível e produtos que tenham sido alterados ou removidos desde a última visita.

O botão “Enviar minha combinação pelo WhatsApp” abrirá o canal oficial com uma mensagem preenchida contendo produtos, opções, quantidades, valores conhecidos, total estimado e observações. A mensagem solicitará confirmação de disponibilidade, orçamento e prazo. O cliente revisa e confirma o envio no WhatsApp; o site não envia mensagens sozinho e a seleção não constitui pedido confirmado.

O número oficial foi confirmado e configurado: +55 (27) 98114-8673, vendas com Marcela. Testar acentos, quebras de linha, seleções extensas, celular e computador, oferecendo uma alternativa para copiar o resumo caso necessário.

### Contatos e localização pública

Atualização do responsável: a loja funciona na residência; divulgar somente **Aracruz–ES (Aracruz, Espírito Santo)**. Endereço, mapa e rotas foram retirados do escopo. Não solicitar nem publicar a localização residencial.

WhatsApp de vendas da Marcela: **+55 (27) 98114-8673**, destino `https://wa.me/5527981148673`. Instagram oficial: `https://www.instagram.com/iluminarte.atelie/`, sem parâmetro de compartilhamento. Os contatos aparecem na página inicial, inclusive sem JavaScript. O montador abre a mensagem preenchida; o cliente confirma o envio no WhatsApp.

## Etapas e critérios de conclusão

1. **Preparação e isolamento:** conferir instruções, Git e arquivos existentes; criar a branch dedicada com autorização; conferir gatilhos de publicação. Concluir com produção e `main` preservadas.
2. **Estrutura e navegação:** criar catálogo e montador; organizar estilos e elementos comuns; atualizar menu, Contatos e rodapé. Concluir com todos os caminhos funcionando em computador e celular.
3. **Dados dos produtos:** definir estrutura estática de produtos, opções, imagens e preços; adaptar o empacotamento público às novas páginas e recursos. Concluir com inclusão de produto sem duplicação de estrutura e sem exposição de arquivos internos.
4. **Catálogo:** implementar cartões, detalhes, preços, busca, filtros no endereço e estados vazios; ligar a busca da página inicial ao catálogo filtrado. Concluir com troca e remoção de filtros funcionando de forma clara.
5. **Montagem da combinação:** implementar seleção, opções, quantidades, remoção, observações, cálculos e rascunho local. Concluir com resumo consistente e tratamento de seleções inválidas ou antigas.
6. **WhatsApp:** gerar a mensagem pronta e integrar o número oficial. Concluir com conteúdo correto e envio sob controle do cliente, incluindo alternativa para copiar o resumo.
7. **Fotos, arte e movimento:** incorporar fotos reais autorizadas ao carrossel; refinar ilustrações das demais áreas e animações. Concluir com identidade consistente, imagens otimizadas, controles acessíveis e movimento reduzido respeitado.
8. **Localização:** informar somente Aracruz–ES. Não incluir endereço, mapa ou rotas.
9. **Validação e publicação final:** revisar conteúdo real, valores, cálculos, navegação, teclado, foco, contraste, movimento reduzido, desempenho, armazenamento e pacote público; executar CI e testes pertinentes. Comparar as versões, preparar PR final e aguardar aprovação explícita para merge. Após o merge autorizado, acompanhar CI/deploy e conferir a produção.

Cada etapa terá entrega local revisável e explicação do que mudou e como foi verificado. Commits serão organizados por etapa dentro da autonomia concedida. Nenhum envio da branch de desenvolvimento deverá publicar o site.

## Informações e materiais para a retomada

- Fotos reais para o carrossel, com identificação dos produtos e autorização de uso.
- Número oficial do WhatsApp com DDD e perfil do Instagram.
- Localização pública confirmada: apenas Aracruz–ES, sem mapa ou endereço.
- Primeiros produtos reais: nomes, categorias, descrições, imagens, preços e opções.
- Regras de personalização, embalagem/caixas, disponibilidade, prazo e frete a comunicar.

Esses materiais podem ser fornecidos gradualmente. A estrutura poderá ser desenvolvida com estados vazios e dados de teste claramente identificados, mas a revisão de conteúdo real é requisito para a publicação final.

## Ponto de retomada

O responsável solicitou pausa após salvar este plano e, em 31/10/2026, autorizou sua transferência por uma branch no GitHub para continuar em outro computador. Esta preparação inclui branch, commit e push do planejamento; não inicia a implementação 2.0 nem inclui merge ou publicação. Na outra máquina, clonar o repositório, selecionar `feat/reestruturacao-iluminarte` e ler este documento, o README e o guia de aprendizado. Depois de conferir o ambiente, retomar a etapa 1 quando solicitado. Ferramentas e autenticações locais precisam ser verificadas na nova máquina; não copiar tokens ou arquivos de credenciais.

## Retomada no computador atual — 31/10/2026

Implementados localmente: navegação, Sobre, catálogo com filtros/busca, dados dos seis produtos fornecidos, montador com caixa opcional, cálculos/quantidades/observações, rascunho e resumo copiável, WhatsApp oficial configurado e localização pública limitada a Aracruz–ES, carrossel manual com fotos reais, animações discretas e pacote público ampliado. As ilustrações existentes foram preservadas e continuam identificadas como ilustrações.

O canal oficial da etapa 6 foi configurado; envio efetivo da mensagem fica sob controle do cliente. A etapa 8 foi ajustada para informar apenas Aracruz–ES, sem endereço ou mapa. A etapa 9 permanece aberta para revisão da marca, composição/opções/personalização, prazo/frete e aprovação explícita de merge/publicação.

## Contatos confirmados e mudança de localização

WhatsApp de vendas da Marcela e Instagram oficial configurados. A antiga previsão de mapa/endereço está cancelada por solicitação do responsável. A abertura e o envio efetivo da mensagem ficam sob controle do cliente; não foram enviadas mensagens em testes. A revisão final e as autorizações de merge/publicação permanecem pendentes.

## Revisão de conteúdo e navegação solicitada pelo responsável

Retiradas as seções Coleções/Três formas de encantar e Da ideia ao presente/passo a passo. Menu sem Coleções e com CTA Monte seu kit. Sobre substituído pela foto fornecida e pelo texto integral do casal sob o título Quem está por trás da marca. FAQ renomeada para Perguntas frequentes. Retirado o título Feito em Aracruz–ES, preservando a cidade em texto simples. Busca inicial com sugestões e catálogo filtrado por parâmetro q. Vídeo de feedback incluído como sétimo item do carrossel; controles manuais, pausa ao sair e alternativa textual dos comentários. Esses ajustes substituem os trechos anteriores do planejamento relativos às áreas removidas.

## Ajuste mais recente: compra, busca no cabeçalho e feedback

O responsável substituiu o CTA do menu por Compre aqui, mantendo o destino no montador. Busca Encontre seu produto movida ao cabeçalho das três páginas, com sugestões e catálogo filtrado. Vídeo retirado do carrossel, que volta a conter somente seis fotos; vídeo e comentários ficam na seção Feedback de clientes ao final da página, depois dos contatos, sem link no menu. Ilustração da caixa e texto para guardar bons momentos removidos; conteúdo restante de personalização reorganizado sem a imagem. Essas decisões substituem as posições e os rótulos anteriores.

## Ajuste de movimento e navegação móvel

Cabeçalho móvel fixado ao topo durante a rolagem, com pesquisa sempre disponível; fundo com transparência de 50% após rolar e campos opacos, com desfoque para leitura. Desktop preservado sem fixação. Carrossel de seis fotos avança a cada 3 segundos, com pausa/reprodução e suspensão durante interação, fora da tela ou com aba oculta. Movimento reduzido mantém navegação manual. Somente a página inicial recebe entrada dos elementos de baixo para cima e letras rápidas nos trechos em destaque dos títulos. Catálogo e montador permanecem sem animações.
