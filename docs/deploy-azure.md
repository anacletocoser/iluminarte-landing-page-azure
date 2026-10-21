# Deploy na Azure — portal e GitHub

## O que já existe

- O responsável criou pelo portal um Azure Static Web App e confirmou o plano **Free**.
- Endereço informado: <https://green-water-0008c3810.5.azurestaticapps.net>.
- O repositório é público: [iluminarte-landing-page-azure](https://github.com/anacletocoser/iluminarte-landing-page-azure).
- A primeira publicação será manual. A automação de publicação após merge ficará para uma etapa posterior.

O recurso é administrado pelo portal Azure. Não precisamos instalar Azure CLI ou Bicep para este caminho. Não há infraestrutura como código criada nesta etapa.

## 1. Confirmar o recurso no portal Azure

1. Abra o Static Web App criado.
2. Confira o endereço padrão acima e o plano **Free**.
3. Abra **Manage deployment token / Gerenciar token de implantação** na visão geral.
4. Copie o token desse recurso para cadastrá-lo diretamente no GitHub. Não o envie ao chat.

O token autoriza a publicação naquele recurso. O texto da URL no workflow serve para identificação e conferência; não muda o recurso ao qual um token pertence.

## 2. Cadastrar o segredo no GitHub

1. Abra [Settings → Secrets and variables → Actions](https://github.com/anacletocoser/iluminarte-landing-page-azure/settings/secrets/actions).
2. Clique em **New repository secret**.
3. Em **Name**, informe exatamente `AZURE_STATIC_WEB_APPS_API_TOKEN`.
4. Em **Secret**, cole o token de implantação copiado do recurso correto.
5. Clique em **Add secret**.

O valor fica armazenado no mecanismo de secrets do GitHub; o workflow referencia apenas o nome. A API de listagem permite conferir a existência do nome, mas não recuperar o valor original. Não é necessário criar um arquivo `.env` para este deploy.

Se o token for exposto, redefina-o no recurso Azure e atualize o secret correspondente. Apagar um token de um arquivo não desfaz sua exposição anterior.

## 3. Entender o pacote público

```bash
pnpm run package:site
```

Esse comando usa apenas recursos nativos do Node e recria `dist/` com os arquivos explicitamente permitidos em `scripts/package-site.mjs`. A saída contém dez arquivos da landing page e da configuração de hospedagem.

O repositório inteiro não é usado como pasta de publicação. README, guia, workflows, ferramentas, dependências e credenciais não fazem parte do pacote. Para acrescentar uma imagem ou outro recurso público, atualize a lista e revise a mudança.

`dist/` é uma saída gerada, ignorada pelo Git. Não a edite manualmente: edite as fontes e gere novamente.

Os testes do empacotamento são executados com:

```bash
pnpm run test:package
```

Eles verificam que arquivos locais de desenvolvimento não são copiados, saídas antigas são removidas, entradas ausentes não destroem a saída anterior e um link no lugar de `dist/` é recusado. Os cenários usam pastas temporárias dentro de `.cache/`, não a página original.

## 4. Iniciar a primeira publicação manual

Depois do merge desta configuração na `main`:

1. Abra [Actions](https://github.com/anacletocoser/iluminarte-landing-page-azure/actions).
2. Selecione **CI e deploy Azure**.
3. Clique em **Run workflow**.
4. Selecione a branch **main**.
5. Marque **Publicar na Azure após as verificações (somente main)**.
6. Confirme em **Run workflow**.

A opção de deploy fica desmarcada por padrão. Se estiver desmarcada, executa somente qualidade e empacotamento. A publicação também é recusada pelo fluxo quando o acionamento é em outra branch.

O GitHub executará dois jobs:

1. **Qualidade e pacote público:** instala as dependências pelo lockfile, confere HTML, JavaScript e formatação, gera o pacote e executa os testes do empacotamento.
2. **Publicar na Azure:** aguarda o sucesso do primeiro, obtém exatamente o mesmo commit, confere a presença do segredo, gera `dist/` e envia ao recurso existente.

O segundo job usa a action oficial Azure com `app_location: dist`, `skip_app_build: true` e saída de build vazia. A página não precisa de compilação ou de uma API. O job também compara o endereço retornado pela Azure com o recurso informado. Essa conferência acontece após o upload e não substitui a seleção correta do token antes da execução.

O job declara o ambiente GitHub `production`, que passa a aparecer no histórico de deployments quando houver publicação. Isso não cria um recurso Azure nem configura revisores obrigatórios por si só.

## 5. Conferir o resultado

1. Na execução de Actions, abra os jobs e confira os passos concluídos.
2. Se o deploy terminar com sucesso, abra <https://green-water-0008c3810.5.azurestaticapps.net>.
3. Confira a marca, imagens, navegação, menu no celular e perguntas frequentes.
4. Nas ferramentas de desenvolvedor, confira erros no console e os cabeçalhos HTTP na aba de rede.

`staticwebapp.config.json` configura política de conteúdo restrita aos recursos locais, proteção contra interpretação incorreta de tipos e incorporação em frames, política de referência e restrições de câmera, microfone e geolocalização. A política bloqueia scripts e estilos inline, chamadas de rede e envio de formulários, funcionalidades que esta landing page não utiliza.

`Cache-Control: no-cache` permite armazenamento, mas exige revalidação, facilitando a conferência de atualizações em arquivos que ainda não têm hashes no nome. Recursos externos ou novas integrações poderão exigir revisão consciente da política de conteúdo.

Esses cabeçalhos são aplicados pela hospedagem Azure; abrir `index.html` pelo arquivo local não permite verificá-los. A validação final de hospedagem fica pendente até a primeira publicação.

## 6. Se ocorrer uma falha

- **Secret ausente:** confira o nome exato no repositório e cadastre o valor; o workflow não mostra o token.
- **Token inválido ou recurso não encontrado:** confira se ele pertence ao Static Web App indicado; se necessário, redefina-o no portal e atualize o secret.
- **Falha na qualidade:** corrija o problema no código antes de publicar. Não remova o bloqueio para forçar um deploy.
- **Endereço retornado diferente:** confira o recurso de origem do token. Não repita o deploy até identificar o destino correto.
- **Mudança não aparece:** confira o SHA usado na execução, o endereço aberto e a revalidação do navegador.

Logs não devem conter tokens. Evite ativar rastreamento detalhado de comandos que tratam credenciais.

## 7. Atualizações e recuperação

Nesta configuração, um merge na `main` executa a qualidade, mas não publica automaticamente. Para publicar uma atualização aprovada, execute novamente o fluxo manual na `main` com a opção de deploy marcada.

Para recuperar conteúdo de uma versão anterior, o caminho inicial será preparar um `git revert` da mudança problemática, revisar por PR e publicar a nova versão da `main`. O revert gera um novo commit sem apagar o histórico. Isso exige autorização para a alteração, commit, envio e integração, conforme o acordo de trabalho. A alteração dos gatilhos para publicação automática será tratada separadamente.

## Referências

- [Configuração de build e deploy do Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration)
- [Configuração de hospedagem](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration)
- [Gerenciamento de tokens de implantação](https://learn.microsoft.com/en-us/azure/static-web-apps/deployment-token-management)
- [Planos do serviço](https://learn.microsoft.com/en-us/azure/static-web-apps/plans)
