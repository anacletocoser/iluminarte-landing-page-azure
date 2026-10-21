# Guia de aprendizado — IluminArte

Este documento acompanha o desenvolvimento da landing page e será atualizado a cada etapa autorizada. Ele registra decisões e verificações, sem apresentar etapas planejadas como se já estivessem concluídas.

## Acordo de trabalho

- Explicar o objetivo, a alteração proposta e como verificar seu resultado.
- Pedir autorização antes de modificar o computador, instalar ferramentas ou criar recursos externos.
- Obter autorização específica antes de fazer commit e antes de enviar conteúdo ao GitHub.
- Explicar e aprovar os gatilhos antes de habilitar qualquer deploy automático.
- Manter o fluxo inicial dentro das opções gratuitas, verificando as condições antes da criação de recursos.
- Não registrar tokens, senhas ou credenciais neste guia.

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
- O acesso remoto, a autenticação, a visibilidade e o conteúdo atual do repositório ainda precisam ser conferidos antes do primeiro envio.

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

| Arquivo | Por que existe |
| --- | --- |
| `.gitignore` | Evita adicionar arquivos temporários, dependências e alguns arquivos locais de configuração e segredos. |
| `.gitattributes` | Padroniza arquivos de texto em LF e preserva imagens binárias, evitando diferenças desnecessárias entre Windows e outros sistemas. |
| `README.md` | Apresenta o projeto a quem abrir o repositório e explica como visualizar a página. |
| `LICENSE` | Aplica a MIT ao código, documentação e SVGs originais, excluindo a logo e a identidade da marca. |
| `docs/guia-aprendizado.md` | Mantém o histórico didático do processo e distingue o que já foi feito do que ainda está planejado. |

O aviso de autoria usa `anacletocoser`, o identificador GitHub informado. A identidade que aparecerá nos commits será escolhida separadamente antes do primeiro commit.

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

## 3. Próxima etapa — identidade e primeiro commit

Antes de executar comandos que alterem o repositório:

1. Escolher o nome e o e-mail de autor. Se desejado, consultar no GitHub o endereço `noreply` correto da conta, sem inventá-lo.
2. Propor configuração de identidade apenas neste repositório, evitando alterar preferências de outros projetos.
3. Revisar os arquivos que serão incluídos e procurar conteúdo indevido.
4. Explicar a diferença entre a pasta de trabalho, a área de preparação (`staging`) e um commit.
5. Solicitar autorização para a configuração necessária, o staging e o primeiro commit.
6. Executar e conferir o commit apenas após aprovação.

Um commit é um registro local de uma versão. Ele não publica a página e não envia código ao GitHub.

## 4. Próxima etapa — primeiro envio ao GitHub

1. Conferir o estado do repositório remoto e sua visibilidade.
2. Preparar autenticação sem colocar credenciais em arquivos ou no histórico.
3. Explicar quais commits serão enviados e o que ficará visível conforme as permissões do repositório.
4. Pedir autorização para o `push` e executá-lo somente depois da aprovação.
5. Conferir no GitHub a branch e os arquivos recebidos.

## 5. Próximas etapas — qualidade, CI e CD

- **Qualidade:** escolher verificações úteis de HTML, CSS, JavaScript, navegação e acessibilidade; adicionar ferramentas somente quando necessário e autorizado.
- **CI:** configurar GitHub Actions para executar verificações de forma reproduzível em eventos definidos, como pull requests.
- **CD:** configurar a publicação na Azure, definindo se haverá aprovação manual ou implantação automática e em quais eventos ela ocorrerá.
- **Permissões:** restringir o acesso dos workflows e armazenar credenciais apenas nos mecanismos apropriados, quando necessários.
- **Mudanças:** aprender a usar branches e pull requests sem impor processos desproporcionais a este projeto de uma pessoa.
- **Recuperação:** aprender a identificar a versão publicada e a restaurar uma versão anterior.

Os workflows ainda não existem. Antes de ativá-los, será explicado que um evento autorizado, como um push em `main`, pode executar deploy automaticamente, sem uma nova pergunta do Codex a cada execução.

## 6. Próxima etapa — Azure e custos

O serviço planejado é Azure Static Web Apps no plano Free, usando o endereço disponibilizado pela Azure. A configuração será revisada antes de criar recursos na assinatura existente.

Serão conferidos plano, cotas, permissões e possíveis serviços adicionais. Não assumiremos que uma assinatura ativa torna todos os recursos gratuitos. No GitHub Actions, também serão conferidas as condições de uso da conta e do repositório antes da ativação.

A infraestrutura como código poderá ser introduzida quando a configuração estiver compreendida e houver uma finalidade didática clara. Não é necessária para visualizar a landing page local.

## Registro de etapas

| Data | Etapa | Resultado |
| --- | --- | --- |
| 21/10/2026 | Landing page | Primeira versão local implementada e verificada no Chrome. |
| 21/10/2026 | Documentação e Git | Criação dos arquivos e configuração local de `main` e `origin`, sem commit ou envio remoto. |
