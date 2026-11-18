# A Rotativa

Jogo de revisão de **Jornalismo Impresso Diário** (turma noturna T0101, PUC-Campinas, 2026/2), feito para treinar a prova individual. Mesmo desenho e visual de [O Fechamento](https://araujofamilia.github.io/o-fechamento/), com fundo cinza de papel-jornal.

**Não vale nota.** A nota de treino que aparece no jogo serve só para o aluno saber como está.

## Como pôr no ar

1. **Apps Script (uma vez, conta araujofamilia@gmail.com).** Em https://script.google.com, Novo projeto. Cole o conteúdo de `apps_script.gs` no lugar do código e salve. Escolha a função `criarTudo` e clique em Executar; autorize (Avançado > Acessar > Permitir). Ela cria o formulário, a planilha e o resumo diário, e liga a pasta "A Rotativa · notícias" do Drive.
2. **App da Web.** Implantar > Nova implantação > tipo App da Web. Executar como: eu. Quem pode acessar: qualquer pessoa. Copie o URL que termina em `/exec`.
3. **config.js.** Cole esse URL entre as aspas de `appsScript: ""`. É a única linha a preencher.
4. **GitHub.** Repositório público novo (sugestão: `a-rotativa`), suba todos os arquivos desta pasta e ligue Settings > Pages (branch `main`, pasta raiz). O endereço fica `https://araujofamilia.github.io/a-rotativa/`.
5. **Teste.** Jogue um caderno até a resposta escrita: ela deve aparecer na planilha em segundos. No Apps Script, rode `testeEnvio` para ver o e-mail chegar.

## Como o jogo funciona

- O aluno entra com nome completo e e-mail; o progresso fica salvo no navegador.
- Pergunta de entrada sorteada a cada login.
- **Doze cadernos**, um por aula do semestre: o ritual da leitura lateral; 1808; o jornal como empresa; o projeto gráfico; o gênero informativo; o opinativo; o DNA do impresso; reportagem; capas históricas; plataformas; Fowler; sustentabilidade.
- Cada rodada de caderno: 4 questões de múltipla escolha ou verdadeiro/falso, 1 questão gerada do banco de conceitos ou da linha do tempo, 2 casos para aplicar (um deles real, quando houver) e 1 resposta escrita (mínimo de 40 palavras). O caderno "roda" com metade das escolhas certas e a resposta escrita entregue.
- **Plantão**: 10 casos misturados de todos os cadernos.
- **Notícias novas**: casos tirados dos jornais dos últimos dias (ver abaixo).
- **Banco de conceitos**: os verbetes e a linha do tempo, com busca, e o treino relâmpago (10 questões geradas).
- **Fechamento**: abre com 6 cadernos rodados; parecer "preservar ou reinventar" (mínimo de 150 palavras), no formato da Oficina 2.
- Toda rodada sorteia questões de novo e embaralha as alternativas. As alternativas foram equilibradas para que a certa não seja, em regra, a mais longa.

## Prazos

Definidos no `config.js`:

- `fimEnvio`: o envio de textos fecha na virada de **sábado, 28/11, à meia-noite**, para dar tempo das devolutivas.
- `fecharTudoNoPrazo`: com `false`, as questões de escolha seguem abertas para treino até a prova; com `true`, o jogo inteiro fecha no prazo.
- `dataProva`: data mostrada aos alunos.
- `cadernosParaParecer`: quantos cadernos abrem o Fechamento (6).

## Para onde vão as respostas

Cada resposta escrita e cada parecer entram numa fila salva no navegador e seguem sozinhos para o Formulário Google, com nova tentativa ao abrir a página, ao voltar a conexão e a cada minuto. O formulário grava numa planilha da conta araujofamilia@gmail.com, e um resumo diário, entre 3h e 4h, chega a artur.araujo@puc-campinas.edu.br e artur.araujo@campinas.sp.gov.br, agrupado por aluno. Dia sem envio novo não gera e-mail.

A tela "Minhas respostas" também deixa baixar, copiar ou mandar por e-mail, como cópia de segurança.

## Notícias novas (atualização sem mexer no código)

A pasta **"A Rotativa · notícias"** fica no Drive, dentro de "Jornalismo impresso noturno - teórico". Cada arquivo `.json` posto nela vira caso novo no jogo (aba "Notícias novas", Plantão e rodada do caderno correspondente), em até 5 minutos. O formato está no `leia-me.txt` da pasta e no modelo `2026-11-17-diario-de-pernambuco.json`. O jogo lê a pasta pelo app da Web do Apps Script.

Caminho reserva: colar os casos no `noticias.js` e subir no GitHub. Os seis casos do Diario de Pernambuco de 17/11 já estão nos dois lugares; repetidos entram uma vez só.

## Arquivos

| Arquivo | O que tem |
|---|---|
| `index.html` | Página e estilo |
| `config.js` | Datas, e-mail e o endereço do Apps Script |
| `dados-base.js` | Cadernos, banco de conceitos, linha do tempo, níveis |
| `dados-questoes-1.js` a `-3.js` | Questões de múltipla escolha e verdadeiro/falso por caderno |
| `dados-casos.js` | Casos para aplicar (jornais de 16 e 17/11/2026, aulas e situações de treino) |
| `dados-escrita.js` | Respostas escritas por caderno, guia e casos do parecer |
| `noticias.js` | Casos novos guardados no repositório (reserva) |
| `jogo.js` | Lógica |
| `apps_script.gs` | Formulário, planilha, resumo diário e canal de notícias |

Ao trocar arquivos, suba o parâmetro `?v=` dos scripts no `index.html` para os navegadores não usarem cópia velha.

Jogo feito com apoio de IA, sob supervisão do professor Artur Araujo.
