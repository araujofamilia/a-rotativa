/* =====================================================================
   A Rotativa · configuração.

   Datas: o envio de textos fecha na virada de sábado, 28/11, para
   domingo (meia-noite, horário de Brasília). Depois disso as questões
   de escolha continuam abertas para treino até a prova; para fechar o
   jogo inteiro no prazo, troque fecharTudoNoPrazo para true.

   appsScript: endereço do app da Web do Apps Script (termina em
   /exec). É a única linha que precisa ser preenchida: por ela o jogo
   recebe o endereço do formulário das respostas e os casos novos da
   pasta "A Rotativa · notícias" no Drive (cada arquivo .json posto lá
   vira caso no jogo, sem mexer no GitHub).

   envio: opcional. Se preenchido com o bloco que a função criarTudo()
   imprime, o jogo usa este bloco e dispensa o canal para o envio.
   Sem nenhum dos dois, as respostas ficam guardadas na fila do
   navegador até o canal responder.
   ===================================================================== */
var CONFIG = {
  emailProfessor: "artur.araujo@puc-campinas.edu.br",
  dataProva: "30/11",
  fimEnvio: "2026-11-29T00:00:00-03:00",
  fimTexto: "sábado, 28/11, à meia-noite",
  fimCurto: "sábado, 28/11, meia-noite",
  fecharTudoNoPrazo: false,
  cadernosParaParecer: 6,
  /* Frase que explica a correção ao aluno (capa e "Minhas respostas"). */
  correcao: "O professor lê e devolve um comentário. Na correção, usa IA em parte e supervisiona cada devolutiva.",
  appsScript: "",
  envio: {
    acao: "",
    campos: { email: "", nome: "", tipo: "", caderno: "", pergunta: "", resposta: "", dados: "" }
  }
};
