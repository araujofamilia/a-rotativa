/* =====================================================================
   A ROTATIVA · escrita
   DISS: uma dissertativa por rodada de caderno (o professor comenta).
   PARECERES: o Fechamento, no formato da Oficina 2 e da prova:
   preservar ou reinventar, com evidência do semestre.
   g: o que uma boa resposta costuma ter (autoavaliação do aluno).
   ===================================================================== */
var DISS = {
  ritual: [
    { q: "Escolha uma alegação do ritual deste semestre (a Lupo, o setembro chuvoso do Cepagri, os motoristas de aplicativo, o pronto-socorro de 390%, a cesta básica de Campinas). Escreva a ficha em texto corrido: a alegação literal, entre aspas; o que cada passo achou; o veredicto; e o grau de confiança no seu veredicto.",
      g: ["Copiei a alegação literal, entre aspas.", "Disse o que achei em cada passo (fonte, cobertura melhor, origem).", "Dei um dos cinco veredictos e justifiquei com evidência.", "Disse quão seguro estou do MEU veredicto, e por quê."] },
    { q: "\"A fonte fala. O documento comprova.\" Explique a frase com um exemplo de número em notícia (o pronto-socorro de 10 leitos, a cesta básica de Campinas ou os motoristas de aplicativo) e diga o que o repórter precisa ter na mão antes de publicar.",
      g: ["Diferenciei fonte (versão, interesse, memória) de documento (existe sem você).", "Usei um caso concreto, com o número.", "Mostrei como uma palavra ou um denominador muda a conta.", "Disse que documento o repórter deveria ter na mão."] },
    { q: "Por que o veredicto \"verdadeiro, mas…\" não é empate? Responda com um caso real do semestre e diga exatamente o que o \"mas\" acrescenta.",
      g: ["Defini \"verdadeiro, mas…\" sem copiar o verbete.", "Usei um caso real, com fonte e data.", "Disse o que a alegação omite ou exagera.", "Expliquei por que isso muda a conclusão do leitor."] },
    { q: "O ritual de leitura lateral é preservar ou reinventar? Argumente: o que ele herda do tempo de apuração e da credibilidade do impresso, e o que ele faz que o impresso não fazia.",
      g: ["Tomei posição (preservar, reinventar ou os dois, com critério).", "Liguei o ritual a pelo menos um atributo do DNA.", "Usei uma evidência do semestre.", "Disse o que o ritual faz de novo."] }
  ],
  imprensa1808: [
    { q: "1808 inventa os dois lados. Compare a Gazeta do Rio de Janeiro e o Correio Braziliense em quatro pontos (onde era impresso, quem fazia, periodicidade e formato, o que publicava) e termine dizendo o que isso ensina sobre imprensa e poder.",
      g: ["Comparei os quatro pontos, sem confundir os jornais.", "Usei números ou fatos da aula (4 meses, 175 números, 4 páginas...).", "Liguei o formato à função.", "Fechei com uma conclusão sobre imprensa e poder."] },
    { q: "Por que o Brasil ficou três séculos sem tipografia? Não pare na proibição: use as quatro condições que um jornal periódico pressupõe.",
      g: ["Citei a proibição portuguesa.", "Expliquei as quatro condições (máquina, leitor, interesse, dinheiro).", "Dei pelo menos um traço da sociedade colonial.", "Não reduzi tudo a uma causa só."] },
    { q: "Explique por que a história da imprensa brasileira não é marcha da censura para a liberdade, com duas evidências da Aula 2 (e, se quiser, uma de outra aula).",
      g: ["Apresentei a tese com minhas palavras.", "Dei duas evidências concretas.", "Evitei a narrativa de progresso linear.", "Conectei com o presente ou com outra aula."] },
    { q: "O Dia Nacional da Imprensa já foi 10 de setembro e hoje é 1º de junho. Aplique o passo 2 do ritual (investigue a fonte) à efeméride: quem escolheu cada data, e a favor de quem?",
      g: ["Disse a que jornal corresponde cada data.", "Disse quem escolheu 10 de setembro (Estado Novo) e quando mudou (1999).", "Expliquei a quem cada escolha favorece.", "Liguei ao método do ritual."] }
  ],
  empresa: [
    { q: "Escolha duas das quatro invenções do século XX (lide, manual, pirâmide invertida, copidesque) e julgue: preservar ou reinventar? Dê um ganho e uma perda de cada.",
      g: ["Defini as duas invenções com minhas palavras.", "Dei um ganho e uma perda de cada.", "Tomei posição clara.", "Usei um exemplo concreto (jornal, aula, matéria)."] },
    { q: "Reescreva em uma frase de até 40 palavras, em ordem direta, o lide desta abertura: \"Desde sempre a chuva preocupa os campineiros. Nos últimos dias, a cidade viveu momentos de apreensão. Ontem, a prefeitura decidiu fechar os parques da região Norte porque a chuva acumulada em 72 horas passou do limite.\" Depois explique o que você cortou e por quê.",
      g: ["Abri com sujeito e verbo.", "Pus o essencial (quem, o quê, quando, onde, por quê) na primeira frase.", "Cortei o nariz de cera.", "Expliquei o corte com o nome técnico."] },
    { q: "\"O caráter opinativo da imprensa tende a perder força e o teor informativo acentua-se\" (Romancini e Lago, p. 67). Explique a frase e diga o que se perdeu com essa virada.",
      g: ["Expliquei a passagem do jornal-panfleto ao jornal-empresa.", "Citei pelo menos um traço da empresa jornalística.", "Disse o que se ganhou e o que se perdeu.", "Usei um exemplo."] },
    { q: "A conta que o século XX cobrou: padronização, censura e concentração. Explique uma delas com um exemplo do semestre (pode ser uma capa da Aula 10).",
      g: ["Escolhi um dos três e defini.", "Dei exemplo concreto, com veículo e data.", "Mostrei a contradição com as conquistas do século.", "Fechei com um juízo."] }
  ],
  grafico: [
    { q: "Descreva a capa de um jornal de hoje (vercapas.com.br) usando pelo menos quatro verbetes da Aula 4 (mancha, manchete, olho, serifa, formato, fio, dobra, chamada). Para cada um, aponte o elemento e o lugar dele na página.",
      g: ["Usei quatro verbetes aplicados à página, sem copiar definição.", "Para cada um, apontei elemento e lugar.", "Disse o que a página diz além do texto.", "Identifiquei o jornal e a data."] },
    { q: "Amílcar de Castro tirou o fio do JB e, anos depois, pôs dois no Correio da Manhã. Explique por que \"a página é uma decisão, não uma moda\" e dê um exemplo de hoje.",
      g: ["Expliquei o caso dos fios.", "Disse o que cada página precisava (ar ou ordem).", "Dei exemplo atual com elemento da página.", "Concluí sobre a página como argumento."] },
    { q: "Nas capas cegas, qual evidência funciona e qual engana? Dê um exemplo de cada, com elementos da página.",
      g: ["Dei uma evidência que funciona, com elemento e lugar.", "Dei uma evidência que engana, e por quê.", "Evitei \"parece antiga\".", "Usei vocabulário da aula."] },
    { q: "O formato escolhe o leitor, ou o leitor escolhe o formato? Responda com tabloide e standard e com um caso real (Correio Popular e Notícia Já, por exemplo).",
      g: ["Defini os formatos pela mancha, não pelo conteúdo.", "Usei caso real.", "Tomei posição com critério.", "Disse que leitor cada projeto imagina."] }
  ],
  informativo: [
    { q: "Escolha uma notícia e uma reportagem de um jornal de hoje e mostre, com trechos, o que distingue uma da outra pela régua da aula (progressão do fato, captação da redação, acesso do público).",
      g: ["Identifiquei os textos (jornal, data, título).", "Citei trechos.", "Usei a régua da aula, não o tamanho.", "Apliquei a pergunta crítica de cada formato."] },
    { q: "Explique a diferença entre entrevista pingue-pongue e entrevista-perfil e diga, para cada uma, como a edição medeia a fala.",
      g: ["Defini os dois com minhas palavras.", "Mostrei a mediação em cada um.", "Dei exemplo (Bairro a bairro, Zero Hora, Folha...).", "Mencionei o risco de confundir visibilidade com ausência de mediação."] },
    { q: "O boato da Lupo e a nota usam o mesmo mecanismo. Explique.",
      g: ["Resumi o boato e o veredicto.", "Defini nota e sua pergunta crítica.", "Mostrei o mecanismo comum: decidir o que fica de fora.", "Disse qual a diferença ética entre os dois."] },
    { q: "Classifique pela finalidade dominante um texto de serviço (como \"Advogado explica como consumidores podem renegociar dívidas\", Correio da Manhã, 17/11/2026) e descreva os traços secundários.",
      g: ["Disse o gênero dominante e por quê.", "Descrevi traços de outros gêneros.", "Usei a classificação de Marques de Melo.", "Lembrei que são fronteiras, não muros."] }
  ],
  opinativo: [
    { q: "Pegue a página de opinião de um jornal de hoje e identifique editorial, artigo e, se houver, charge e cartas. Para cada um, a marca que decide (assinatura, posição, verbo, expediente).",
      g: ["Identifiquei jornal e data.", "Para cada gênero, apontei uma marca.", "Usei a régua assinatura, tom e suporte.", "Não chamei de editorial qualquer opinativo."] },
    { q: "Por que a crônica de Machado de Assis de 19/05/1888 não é artigo? Explique onde está a opinião dele.",
      g: ["Situei a crônica (data, jornal, Lei Áurea).", "Mostrei que a opinião não está escrita.", "Comparei com o que um artigo teria de fazer.", "Disse o que a crônica ganha com isso."] },
    { q: "\"Assinatura não é opinião\" e \"espaço fixo não é opinião\". Explique as duas frases com um exemplo (a coluna da Zero Hora que avisa \"Esta coluna contém informação e opinião\" serve).",
      g: ["Expliquei as duas frases.", "Usei exemplo real.", "Disse o que de fato decide (contraditório, juízo assumido).", "Fechei com a pergunta \"concordar ou saber\"."] },
    { q: "No feed, somem a cartola, o expediente e a página. Como o leitor pode, sozinho, descobrir se um texto quer que ele concorde ou que ele saiba?",
      g: ["Disse o que some no feed.", "Dei pelo menos dois sinais que o leitor pode procurar.", "Usei o contraditório como critério.", "Dei exemplo."] }
  ],
  dna: [
    { q: "Leia a capa de um jornal de hoje com as quatro lentes (curadoria, hierarquia, tempo de apuração, credibilidade). Uma frase por lente, cada uma com o elemento e o lugar na página.",
      g: ["Identifiquei jornal e data.", "Uma frase por lente, com elemento e lugar.", "Usei \"não se vê\" com o porquê, se foi o caso.", "Disse qual lente a capa mais exibe e qual mais esconde."] },
    { q: "Suporte e função: o papel pode acabar sem que a função acabe? Argumente com um atributo do DNA e um exemplo do semestre.",
      g: ["Distingui suporte de função.", "Escolhi um atributo e o apliquei.", "Dei exemplo do semestre.", "Tomei posição."] },
    { q: "Por que a errata é DNA do impresso? Compare com o que acontece quando um post errado circula numa plataforma.",
      g: ["Defini errata pelo que ela faz.", "Liguei à credibilidade institucional.", "Comparei com o post corrigido em silêncio ou não corrigido.", "Disse quem responde em cada caso."] },
    { q: "Faça um duelo: duas capas da mesma cidade, do mesmo dia (vercapas.com.br). O que uma escolheu que a outra não escolheu, e em que lente cai a diferença?",
      g: ["Identifiquei os dois jornais e a data.", "Apontei a diferença com elementos das páginas.", "Disse em que lente ela cai.", "Disse o que isso revela da curadoria de cada um."] }
  ],
  reportagem: [
    { q: "Faça a engenharia reversa de uma reportagem de hoje respondendo às perguntas 1, 3, 6 e 13 da ficha da Oficina 1, sempre com o trecho que prova.",
      g: ["Identifiquei jornal, data, página e título.", "Respondi às quatro perguntas.", "Cada resposta tem trecho copiado.", "Fechei com um veredicto curto."] },
    { q: "Euclides antes e depois de Canudos: o que mudou entre \"A nossa Vendéia\" (1897) e Os sertões (1902), e o que isso diz sobre tempo de apuração e presença?",
      g: ["Descrevi as duas posições.", "Citei ou parafraseei os trechos da aula.", "Liguei a mudança à presença e ao tempo.", "Tirei uma lição para a reportagem de hoje."] },
    { q: "Explique a diferença entre investigar e interpretar, em Lage, e o limite: \"a notícia é o relato do que se sabe, não do que se ignora\".",
      g: ["Defini investigar e interpretar.", "Expliquei o limite com minhas palavras.", "Dei exemplo de reportagem.", "Disse onde a reportagem vira literatura (ou não)."] },
    { q: "O texto longo é DNA do impresso: preservar ou reinventar? Use um exemplo da linhagem (Euclides, João do Rio, Realidade, Zuenir, Caco Barcellos, Daniela Arbex) e um creator.",
      g: ["Tomei posição.", "Usei um exemplo da linhagem.", "Usei um creator (o meu, se possível).", "Disse se o tempo de apuração sobrevive à troca de suporte."] }
  ],
  capas: [
    { q: "Escolha uma das onze capas da Aula 10 e responda à ficha: o que manda na página, a saída do editor, o custo e preservar ou reinventar, sempre com elemento da página.",
      g: ["Identifiquei o cartão e a capa.", "Nos itens 1, 2 e 4, apontei elemento da página.", "Disse o custo da saída.", "Terminei com preservar ou reinventar."] },
    { q: "Compare duas capas feitas sob censura (JB de 1968, JB de 1973 ou Estadão de 1974). Que saída cada uma encontrou, e qual foi o custo?",
      g: ["Descrevi as duas saídas com elementos da página.", "Disse o custo de cada uma.", "Comparei as estratégias.", "Liguei à história da censura (Aula 2)."] },
    { q: "\"Nasceu o diabo em São Paulo\" (1975) e o caça-clique de hoje: o que se parece, e o que não se parece? Use a Aula 11.",
      g: ["Descrevi o caso de 1975.", "Comparei com um caso de hoje.", "Usei um conceito da Aula 11.", "Disse quem paga a conta e quando."] },
    { q: "Notícia ou serviço? Com as capas de 1º de julho de 1994, diga qual escolha você faria e por quê.",
      g: ["Descrevi as escolhas dos jornais.", "Tomei posição.", "Usei gênero utilitário e hierarquia.", "Disse para que leitor é cada capa."] }
  ],
  plataforma: [
    { q: "Complete o quadro da Aula 11 para o feed: quem hierarquiza, para quantos leitores, quando fecha, quem responde pelo erro, dá para saber o que ficou de fora. Compare cada resposta com a da capa.",
      g: ["Respondi às cinco perguntas.", "Comparei com a capa.", "Usei curadoria opaca.", "Dei um exemplo."] },
    { q: "Explique curadoria opaca com um exemplo (o limite de conteúdo político no Instagram ou o bloqueio no Canadá) e diga por que ela é diferente da curadoria da capa.",
      g: ["Defini com minhas palavras.", "Usei exemplo real, com dado.", "Comparei com a capa.", "Disse por que o leitor não percebe."] },
    { q: "\"Não foi a internet que matou o jornal.\" Explique a frase com três dados da aula.",
      g: ["Usei três dados com fonte.", "Falei de fragmentação, diário de massa e especialização.", "Evitei o determinismo tecnológico.", "Fechei com preservar ou reinventar."] },
    { q: "O seu creator também mora na plataforma: de qual ele depende, o que faz que um jornal fazia, o que faz que um jornal nunca fez, e do que abriu mão?",
      g: ["Disse a plataforma.", "Respondi às três perguntas do acompanhamento.", "Dei exemplo de publicação dele.", "Respondi \"do que abriu mão\" com evidência."] }
  ],
  fowler: [
    { q: "Escolha dois títulos de jornais diferentes sobre o mesmo fato (pode ser o novo 007 em 17/11/2026, no Estadão e no Estado de Minas) e aplique as três perguntas de Fowler a cada um.",
      g: ["Copiei os dois títulos.", "Respondi quem age, onde está o juízo e de quem é a voz.", "Comparei os resultados.", "Evitei falar em \"viés\" e falei em representação."] },
    { q: "Representação ou viés? Explique por que Fowler prefere \"representação\" e por que é perigoso achar que só o jornal dos outros é enviesado.",
      g: ["Defini os dois termos.", "Usei um exemplo.", "Expliquei o perigo.", "Disse o que \"crítico\" quer dizer."] },
    { q: "Pingue-pongue ou reportagem com checagem? Quando o entrevistado faz alegação falsa, qual formato você escolheria, e o que perde e o que ganha?",
      g: ["Defini os dois formatos.", "Tomei posição.", "Disse o que se perde e o que se ganha.", "Usei o caso da aula ou outro real."] },
    { q: "O título molda o leitor, ou o leitor já encomendou o título que ia ler? Use idioma público e leitor ativo.",
      g: ["Usei os dois conceitos.", "Dei exemplo de título.", "Tomei posição.", "Evitei a ideia de leitor passivo."] }
  ],
  sustenta: [
    { q: "Assinatura, membership e newsletter: para cada uma, o que o leitor compra e o que do texto do impresso (curadoria, hierarquia, tempo, credibilidade) sobrevive.",
      g: ["Defini as três lógicas.", "Liguei cada uma a um atributo do DNA.", "Usei um caso da tabela ou da aula.", "Tomei posição."] },
    { q: "Explique o erro do denominador com os números 15%, 15,9% e 2,8%.",
      g: ["Disse a base de cada número.", "Disse país e ano de cada um.", "Expliquei por que não se comparam.", "Dei um exemplo de comparação errada."] },
    { q: "\"Reter não é lucrar.\" Explique com o achado de Kim et al. (2024) e o limite dele.",
      g: ["Resumi o achado.", "Disse que é associação, não causa.", "Expliquei a diferença entre retenção e lucro.", "Dei exemplo."] },
    { q: "Membership é mais democrático do que assinatura? Responda com Carpes e Sanseverino (2020) e Carpes e Vieira (2025).",
      g: ["Usei os dois estudos.", "Disse o que é participação real.", "Tomei posição com critério.", "Mencionei um limite das pesquisas."] }
  ]
};

/* Lista fixa da autoavaliação do parecer, alinhada à régua da Oficina 2
   e da prova: posição nas duas metades, evidência do semestre citada,
   caso usado, conceito aplicado (não copiado), clareza. */
var GUIA_PARECER = [
  "Disse o que preservar E o que reinventar: as duas metades.",
  "Citei evidência do MEU semestre (capa analisada, reportagem desmontada, creator, aula de história), com nome e data, não só alusão.",
  "Usei o caso de verdade: o argumento depende dele, não é enfeite.",
  "Apliquei conceitos do banco a elementos concretos do caso, sem copiar o verbete.",
  "O texto está claro e organizado: posição, evidência, conclusão."
];

var PARECERES = [
  { titulo: "Só aos sábados", fonte: "",
    caso: "O jornal diário da sua cidade anuncia que, a partir de janeiro, o papel sai só aos sábados. Nos outros dias: site, uma newsletter às 6h e vídeos curtos no Instagram. A empresa diz que \"o jornalismo continua o mesmo, só muda o suporte\".",
    pede: "Escreva um parecer: o que do DNA do impresso este jornal deve preservar, e o que deve reinventar? A frase da empresa se sustenta? Use pelo menos duas evidências do semestre e conceitos do banco aplicados ao caso." },
  { titulo: "A capa que voltou pelo feed", fonte: "Estado de Minas, 26/10/2026 (Aula 11)",
    caso: "O resultado da eleição foi confirmado no domingo à noite; a capa chegou às bancas umas dez horas depois. Mesmo assim, na segunda à tarde, uma republicação da capa no X passava de mil compartilhamentos e cerca de 8 mil curtidas.",
    pede: "O que a capa ainda faz que o feed não faz? Isso é argumento para preservar o quê, e reinventar o quê? Use a Aula 7 (DNA) e a Aula 11 (plataformização), com pelo menos uma evidência sua do semestre." },
  { titulo: "O papel que cresce", fonte: "Poder360 e Brazil Journal, 27/05/2026 (Aula 11)",
    caso: "Em dez anos, a tiragem média diária somada dos principais jornais caiu 84,6%. Mas, em 2025, a Folha cresceu 18,1% no impresso (52.920 assinaturas), enquanto o Estadão perdeu 59,9% do papel. Nos EUA, a assinatura impressa já custa cerca de seis vezes a digital e ainda é o produto que mais rende.",
    pede: "O papel deve ser preservado? Para quem? Escreva o parecer com evidência do semestre e diga o que precisa ser reinventado para que o impresso de nicho não vire só produto de luxo." },
  { titulo: "Uma edição de terça-feira", fonte: "Correio Popular, 17/11/2026",
    caso: "Na capa, \"Campinas é a única cidade do Sudeste que teve queda no preço da cesta básica\" (o título interno restaura: \"entre cidades monitoradas pelo Dieese\"). Na página A3, o editorial \"Custo da cesta básica precisa ser tratado como prioridade\". Na mesma edição, cartas de leitores, colunas com aviso de que os artigos assinados não refletem a opinião da direção e a seção \"Há 50 anos\", com a bomba no semanário Opinião, em 1976.",
    pede: "O que desta edição é DNA a preservar, e o que precisa ser reinventado? Use a leitura lateral, os gêneros (Aulas 5 e 6) e a história (Aula 2 ou 10)." },
  { titulo: "O QR code na reportagem", fonte: "Zero Hora, 17/11/2026",
    caso: "Reportagem sobre uma paciente do SUS com exames marcados para 2033, com dados oficiais e documento do hospital. No meio da página, o selo \"Conexão digital: acesse o QR code e assista ao vídeo reportagem\".",
    pede: "Isso é preservar, reinventar, ou os dois? Escreva o parecer usando reportagem em profundidade (Aula 8), projeto gráfico (Aula 4) e uma evidência sua do semestre." },
  { titulo: "Uma capa diferente para cada leitor", fonte: "",
    caso: "Um portal de notícias troca a home igual para todos por uma home personalizada por algoritmo, diferente para cada pessoa, conforme o que ela clicou antes. A audiência sobe 30% no primeiro mês.",
    pede: "Parecer: o que se perde e o que se ganha? O que do DNA deveria ser preservado nessa home, e o que pode ser reinventado? Use curadoria opaca, hierarquia editorial e uma evidência sua." },
  { titulo: "Notas escritas por IA", fonte: "",
    caso: "Uma redação passa a usar inteligência artificial para escrever as notas do dia (trânsito, clima, resultados), sempre a partir de documentos oficiais, e diz que isso libera os repórteres para as reportagens. As notas não trazem assinatura.",
    pede: "Escreva o parecer: o que preservar (pense em credibilidade, errata, quem responde) e o que reinventar? Use gêneros informativos e o DNA do impresso, com evidência do semestre." },
  { titulo: "O podcast investigativo", fonte: "",
    caso: "Um jornalista-creator lança uma série investigativa em podcast, seis episódios, dois anos de apuração. Não tem editor, nem expediente, nem errata; tem patrocínio de uma marca e 300 mil ouvintes.",
    pede: "É reportagem em profundidade? O que ela preserva do impresso e o que reinventa, e do que abriu mão? Use Lage, o DNA e o creator que você acompanhou." },
  { titulo: "Membros que fazem a pauta", fonte: "",
    caso: "Um site de notícias de Campinas abre programa de membros: conteúdo aberto a todos, apoio de R$ 15 por mês e uma reunião de pauta com os membros a cada trimestre. Em seis meses, chega a 1.200 membros.",
    pede: "Isso é membership de verdade ou assinatura com outro nome? O que preservar e o que reinventar? Use a Aula 13 e mais uma evidência do semestre." },
  { titulo: "O erro corrigido em silêncio", fonte: "",
    caso: "Um jornal publica no Instagram um card com um número errado sobre vagas em creches. Horas depois, apaga o card e publica outro, com o número certo, sem nenhum aviso. No papel do dia seguinte, sai um \"Erramos\" de três linhas.",
    pede: "Escreva o parecer: o que o jornal preservou e o que deixou de preservar ao passar para o feed? Que reinvenção a errata precisaria ter? Use credibilidade institucional e uma evidência sua." },
  { titulo: "O fim do jornal popular", fonte: "Aula 11",
    caso: "Em 2010, o Super Notícia, de Belo Horizonte, vendia mais de 290 mil exemplares por dia e era o segundo maior jornal do país. Em junho de 2025, encerrou a edição impressa. O leitor dele está hoje no WhatsApp, no YouTube e no feed.",
    pede: "O que se perdeu com o fim do diário de massa? O que deveria ser preservado para esse leitor, e como reinventar? Use a Aula 11 e uma capa histórica da Aula 10 (o Notícias Populares, por exemplo)." },
  { titulo: "O bebê-diabo de 2026", fonte: "",
    caso: "Num domingo sem notícia forte, um portal popular publica \"Moradores juram ter visto criatura no lago do Taquaral\", com um vídeo granulado. O post bate o recorde de cliques do mês. Na segunda, o portal publica \"Criatura do Taquaral: novas imagens\".",
    pede: "Compare com o cartão G da Aula 10 (Notícias Populares, 1975). O que o jornalismo deve preservar diante do caça-clique, e o que pode reinventar sem perder a credibilidade? Use leitura lateral e DNA." }
];
