/* =====================================================================
   A Rotativa · notícias novas guardadas no próprio repositório.

   O caminho principal para casos novos é a pasta "A Rotativa ·
   notícias" no Drive (lida pelo Apps Script; ver config.js). Este
   arquivo é o caminho reserva: dá para colar casos aqui e subir no
   GitHub. Os dois se somam; caso repetido (mesmo id) entra uma vez só.

   Formato de cada caso:
   {
     id: "cp-2026-11-18-tarifa",        // único, sem espaços
     data: "2026-11-18",                // data da edição
     cad: "informativo",                // um dos cadernos: ritual, imprensa1808,
                                        // empresa, grafico, informativo, opinativo,
                                        // dna, reportagem, capas, plataforma,
                                        // fowler, sustenta
     fonte: "Correio Popular, 18/11/2026, capa",
     txt: "O trecho ou a descrição do que está na página.",
     pergunta: "A pergunta.",
     ops: ["Resposta certa", "Errada 1", "Errada 2", "Errada 3"],
     c: 0,                              // índice da certa (o jogo embaralha)
     exp: "A explicação que aparece depois da resposta."
   }
   ===================================================================== */
var NOTICIAS_LOCAL = [
  {
    "id": "dp-2026-11-17-maioridade",
    "data": "2026-11-17",
    "cad": "ritual",
    "fonte": "Diario de Pernambuco, 17/11/2026, capa e p. 4",
    "txt": "Na capa: \"92% da população é a favor da redução da maioridade penal\". Na linha fina: \"A pesquisa realizada pela Quaest mostra que quase a totalidade dos entrevistados defende a redução de 18 para 16 anos\". Na página 4, o título vira \"Pesquisa: 92% apoiam redução da maioridade\".",
    "pergunta": "Antes de repassar \"92% da população\", o que a leitura lateral manda conferir?",
    "ops": [
      "Quantos foram ouvidos, quando, com que margem e com que pergunta exata.",
      "Se a Quaest tem perfil verificado nas redes sociais e quantos seguidores ela tem.",
      "Se outros jornais deram o mesmo número na capa no mesmo dia.",
      "Nada: pesquisa de instituto conhecido já vale para toda a população."
    ],
    "c": 0,
    "exp": "Pesquisa ouve uma amostra: \"92% dos entrevistados\" só vira \"92% da população\" se a amostra representa o país, e o resultado depende da pergunta feita, da data e da margem de erro. A linha fina do próprio jornal fala em \"entrevistados\"; a manchete apaga o recorte."
  },
  {
    "id": "dp-2026-11-17-fundos",
    "data": "2026-11-17",
    "cad": "ritual",
    "fonte": "Diario de Pernambuco, 17/11/2026, capa e p. 3",
    "txt": "Na capa: \"Fundos públicos bancaram 83% da campanha\". Na página 3: \"Verbas públicas pagaram 83% da despesa eleitoral\". O texto explica: \"Cerca de 83,4% dos recursos destinados aos gastos de campanhas nas eleições gerais estaduais de 2026, para governador, vice-governador e deputados\" vêm de financiamento público, segundo dados do TSE: cerca de R$ 225 milhões de R$ 270 milhões.",
    "pergunta": "Se alguém repassar \"dinheiro público pagou 83% das campanhas de 2026\", o que falta?",
    "ops": [
      "O recorte: são as campanhas estaduais de Pernambuco, não as do país todo.",
      "A fonte: o jornal não diz de onde tirou o número de 83%.",
      "Nada: o número vem do TSE e vale para todas as campanhas do Brasil em 2026.",
      "A conta: 225 milhões de 270 milhões dá menos da metade do total."
    ],
    "c": 0,
    "exp": "O texto fala das eleições gerais estaduais de 2026 em Pernambuco (governador, vice e deputados): R$ 225 milhões de R$ 270 milhões, 83,4%. Capa e título interno tiram o recorte. O denominador muda a conclusão: investigar a fonte é saber o que foi medido."
  },
  {
    "id": "dp-2026-11-17-refem",
    "data": "2026-11-17",
    "cad": "fowler",
    "fonte": "Diario de Pernambuco, 17/11/2026, capa e p. 11",
    "txt": "Na capa: \"Ex-PM é preso por ameaçar mulher\", com o texto \"após receber denúncia de que ela estava sendo mantida como refém\". Na página 11, o título muda: \"Ex-PM é preso após manter mulher refém\". No texto, o capitão do Bope diz: \"Quando chegamos, não se tratava de uma ocorrência com reféns\"; a mulher já tinha saído do apartamento.",
    "pergunta": "Qual dos dois títulos se sustenta no próprio texto?",
    "ops": [
      "O da capa: o interno afirma o refém que a própria fonte nega.",
      "O interno: \"refém\" é o termo técnico que o Bope usou ao registrar a ocorrência.",
      "Os dois: a denúncia falava em refém, e isso basta para o título.",
      "Nenhum: sem a versão do acusado, nada pode ir para o título."
    ],
    "c": 0,
    "exp": "A denúncia falava em refém; no local, a polícia desmentiu. A capa ficou com o que se confirmou (a ameaça) e atribuiu a denúncia; o título interno transformou em fato o que a fonte nega. Quem fez o quê, segundo quem: é a pergunta de Fowler. E a fala do capitão, que chama a ameaça de \"briga de marido e mulher\", também é uma representação; publicá-la sem contraponto é escolha da edição."
  },
  {
    "id": "dp-2026-11-17-claudionor",
    "data": "2026-11-17",
    "cad": "fowler",
    "fonte": "Diario de Pernambuco, 17/11/2026, capa e p. 10",
    "txt": "Na capa: \"Como não podia ser diferente, o maior intérprete do frevo pernambucano, Claudionor Germano, foi velado cercado por amigos, admiradores e familiares\". Na página 10: \"A despedida ao cantor Claudionor Germano, considerado o maior intérprete da história do frevo pernambucano, aconteceu, ontem...\".",
    "pergunta": "O que muda entre a capa e a página interna, na leitura de Fowler?",
    "ops": [
      "A capa tira o \"considerado\" e transforma a avaliação em fato.",
      "Nada: \"o maior\" e \"considerado o maior\" dizem exatamente a mesma coisa.",
      "A página interna é que opina, porque usa o verbo \"considerar\".",
      "A capa fica mais objetiva, porque corta palavras desnecessárias."
    ],
    "c": 0,
    "exp": "Modalidade: \"considerado\" marca que o juízo é de alguém (quem considera?); sem ele, a capa afirma o juízo como fato. \"Como não podia ser diferente\" também é avaliação de quem escreve. Num obituário, é escolha comum, mas é escolha."
  },
  {
    "id": "dp-2026-11-17-pf",
    "data": "2026-11-17",
    "cad": "fowler",
    "fonte": "Diario de Pernambuco, 17/11/2026, p. 4",
    "txt": "Título: \"Andrei Rodrigues nega crise na PF\". O texto: o diretor-geral da Polícia Federal negou racha e perda de autonomia, disse que não será intimidado e que a PF \"só tem um lado\"; as falas ocorreram \"após polêmicas envolvendo o afastamento de delegados de investigações do Caso Master\". Nenhuma outra voz aparece.",
    "pergunta": "Pelas perguntas de Fowler, o que esse título faz?",
    "ops": [
      "Dá a voz só à autoridade; a \"crise\" entra pela negação, sem quem a aponte.",
      "Prova que não há crise na Polícia Federal, porque o próprio diretor-geral a negou.",
      "Não tem juízo nem voz: é título informativo, sem nenhuma escolha.",
      "Dá a voz aos delegados afastados, que acusam a direção da PF."
    ],
    "c": 0,
    "exp": "De quem é a voz? Só a do diretor-geral. O título declaratório registra a negação e, de quebra, põe \"crise\" na cabeça do leitor, sem dizer quem fala em crise nem ouvir os delegados afastados. Declarar não é provar."
  },
  {
    "id": "dp-2026-11-17-espantalhos",
    "data": "2026-11-17",
    "cad": "opinativo",
    "fonte": "Diario de Pernambuco, 17/11/2026, p. 4",
    "txt": "Na página de Política, sob a marca \"Contraponto Diario\" e com o nome do autor: \"Entre os espantalhos, privilégios se perpetuam\". Abre assim: \"Espantalhos servem para afastar pássaros. Na disputa política, afastam o contato com o argumento do outro, o bom senso e, muitas vezes, o interesse público.\" Na mesma página, uma notícia sobre deputados que repercutem o ajuste fiscal.",
    "pergunta": "Que gênero é, e o que o separa da notícia ao lado?",
    "ops": [
      "Opinião assinada: o juízo vem no título e no texto, e o autor responde.",
      "Notícia: está na página de Política e trata do ajuste fiscal do dia.",
      "Editorial: fala em nome do jornal, porque leva a marca da casa no alto da coluna.",
      "Crônica: abre com uma imagem do campo e não toma posição nenhuma."
    ],
    "c": 0,
    "exp": "Assinatura, espaço com marca própria e juízo explícito (\"privilégios se perpetuam\"): é coluna de opinião. A metáfora do espantalho abre o argumento, mas o texto toma posição às claras, o que a crônica faria sem anunciar. A notícia ao lado relata o que os deputados disseram; o colunista diz o que pensa. Muda o mandato."
  }
];
