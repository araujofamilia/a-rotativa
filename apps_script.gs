/**
 * A Rotativa · Apps Script (Jornalismo Impresso Diário, turma noturna, 2026/2)
 *
 * Um projeto só faz quatro coisas:
 *   1. cria o Formulário Google que recebe as respostas escritas e os
 *      pareceres do jogo, ligado a uma planilha (backup completo);
 *   2. manda, uma vez por dia de madrugada (entre 3h e 4h), um resumo
 *      por e-mail com o que entrou desde o último resumo, agrupado por
 *      aluno; dia sem envio novo não gera e-mail;
 *   3. lê a pasta "A Rotativa · notícias" do Drive (já criada, dentro de
 *      "Jornalismo impresso noturno - teórico"): cada arquivo .json posto
 *      nela vira caso novo no jogo;
 *   4. como app da Web, serve ao jogo esses casos e o endereço do
 *      formulário (doGet, em JSONP).
 *
 * Como ligar (uma vez, na conta araujofamilia@gmail.com):
 *   a. https://script.google.com > Novo projeto; cole este arquivo no
 *      lugar do código e salve (Ctrl+S).
 *   b. Escolha a função criarTudo e clique em Executar; autorize
 *      (conta araujofamilia > Avançado > Acessar > Permitir).
 *   c. Implantar > Nova implantação > tipo App da Web. Executar como: eu.
 *      Quem pode acessar: qualquer pessoa. Copie o URL que termina em
 *      /exec e cole em appsScript, no config.js. É só isso.
 *   d. Para testar o e-mail sem esperar a madrugada: rode testeEnvio().
 */
var DESTINOS = "artur.araujo@puc-campinas.edu.br,artur.araujo@campinas.sp.gov.br";
var TITULO = "A Rotativa";
var PASTA_NOTICIAS = "1VVanWmgqQhlRs6lir_fIlGt-KBRG6b87"; /* "A Rotativa · notícias" */
var CAMPOS = ["email", "nome", "tipo", "caderno", "pergunta", "resposta", "dados"];
var ROTULOS = {
  email: "E-mail do aluno",
  nome: "Nome",
  tipo: "Tipo (dissertativa ou parecer)",
  caderno: "Caderno",
  pergunta: "Pergunta",
  resposta: "Resposta do aluno",
  dados: "Dados do jogo (XP, cadernos rodados, nota de treino, data)"
};

/* ---------------- 1. formulário, planilha, pasta e acionador ---------------- */
function criarTudo() {
  var p = PropertiesService.getScriptProperties();
  if (p.getProperty("formId")) {
    Logger.log("Já estava criado. Nada foi duplicado.");
    imprimeConfig_();
    return;
  }
  var form = FormApp.create(TITULO + " · respostas (Impresso noturno 2026/2)");
  form.setDescription("Recebe sozinho as respostas escritas e os pareceres do jogo A Rotativa. Não preencha à mão.");
  form.setCollectEmail(false);
  try { if (form.setPublished) form.setPublished(true); } catch (e) {}
  CAMPOS.forEach(function (n) {
    if (n === "pergunta" || n === "resposta" || n === "dados") form.addParagraphTextItem().setTitle(ROTULOS[n]);
    else form.addTextItem().setTitle(ROTULOS[n]);
  });
  var ss = SpreadsheetApp.create(TITULO + " · respostas dos alunos (Impresso noturno 2026/2)");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  var pasta;
  try { pasta = DriveApp.getFolderById(PASTA_NOTICIAS); } catch (e) { pasta = DriveApp.createFolder(TITULO + " · notícias"); }
  var pais = pasta.getParents();
  if (pais.hasNext()) {
    var pai = pais.next();
    try { DriveApp.getFileById(ss.getId()).moveTo(pai); DriveApp.getFileById(form.getId()).moveTo(pai); } catch (e) {}
  }

  p.setProperties({ formId: form.getId(), planilhaId: ss.getId(), pastaId: pasta.getId(), ultimaLinha: "1" });
  instalar();
  Logger.log("Formulário: " + form.getEditUrl());
  Logger.log("Planilha: " + ss.getUrl());
  Logger.log("Pasta de notícias: " + pasta.getUrl());
  imprimeConfig_();
}

function camposDoForm_(form) {
  var itens = form.getItems(), porTitulo = {};
  itens.forEach(function (it) { porTitulo[it.getTitle()] = it; });
  var resp = form.createResponse();
  CAMPOS.forEach(function (n) {
    var it = porTitulo[ROTULOS[n]];
    var r = it.getType() === FormApp.ItemType.PARAGRAPH_TEXT
      ? it.asParagraphTextItem().createResponse("X" + n)
      : it.asTextItem().createResponse("X" + n);
    resp.withItemResponse(r);
  });
  var url = resp.toPrefilledUrl(), campos = {};
  CAMPOS.forEach(function (n) {
    var m = url.match(new RegExp("entry\\.(\\d+)=X" + n));
    campos[n] = m ? "entry." + m[1] : "";
  });
  return { acao: form.getPublishedUrl().replace(/\/viewform.*$/, "/formResponse"), campos: campos };
}

function imprimeConfig_() {
  var form = FormApp.openById(PropertiesService.getScriptProperties().getProperty("formId"));
  var c = camposDoForm_(form);
  var bloco = "envio: {\n    acao: \"" + c.acao + "\",\n    campos: { " +
    CAMPOS.map(function (n) { return n + ": \"" + c.campos[n] + "\""; }).join(", ") + " }\n  },";
  Logger.log("Cole no config.js, no lugar do bloco envio:\n  " + bloco);
}

function instalar() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "resumoDiario") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("resumoDiario").timeBased().everyDays(1).atHour(3).inTimezone("America/Sao_Paulo").create();
  Logger.log("Resumo diário ligado para " + DESTINOS + " (todo dia entre 3h e 4h, horário de Brasília).");
}

/* ---------------- 2. resumo diário por e-mail ---------------- */
function abaRespostas_() {
  var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("planilhaId"));
  var abas = ss.getSheets();
  for (var i = 0; i < abas.length; i++) if (abas[i].getFormUrl()) return abas[i];
  return abas[0];
}

function resumoDiario() {
  var aba = abaRespostas_();
  var p = PropertiesService.getScriptProperties();
  var ultima = Number(p.getProperty("ultimaLinha") || 1);
  var total = aba.getLastRow();
  if (total <= ultima) { Logger.log("Nenhuma resposta nova."); return; }
  var ncol = aba.getLastColumn();
  var cab = aba.getRange(1, 1, 1, ncol).getValues()[0];
  var col = function (trecho) {
    for (var i = 0; i < cab.length; i++) if (String(cab[i]).toLowerCase().indexOf(trecho) >= 0) return i;
    return -1;
  };
  var cData = 0, cEmail = col("mail"), cNome = col("nome"), cTipo = col("tipo"), cCad = col("caderno"),
      cPerg = col("pergunta"), cResp = col("resposta"), cDados = col("dados");
  var tz = "America/Sao_Paulo";
  var linhas = aba.getRange(ultima + 1, 1, total - ultima, ncol).getValues();
  var get = function (l, c) { return c >= 0 ? String(l[c] == null ? "" : l[c]).trim() : ""; };

  var porAluno = {}, nomes = {}, pareceres = 0;
  linhas.forEach(function (l) {
    var em = get(l, cEmail).toLowerCase() || "(sem e-mail)";
    (porAluno[em] = porAluno[em] || []).push(l);
    if (get(l, cNome)) nomes[em] = get(l, cNome);
    if (get(l, cTipo).toLowerCase() === "parecer") pareceres++;
  });
  var alunos = Object.keys(porAluno).sort(function (a, b) { return (nomes[a] || a).localeCompare(nomes[b] || b); });

  var hoje = Utilities.formatDate(new Date(), tz, "dd/MM/yyyy");
  var txt = ["A ROTATIVA · respostas novas · " + hoje,
    linhas.length + " resposta(s) nova(s) de " + alunos.length + " aluno(s), desde o último resumo" + (pareceres ? ", " + pareceres + " parecer(es)" : "") + ".",
    "A planilha com tudo fica na conta araujofamilia@gmail.com: " + aba.getParent().getUrl(), ""];
  alunos.forEach(function (em) {
    txt.push("################################################################");
    txt.push("ALUNO: " + (nomes[em] || "(sem nome)") + " · " + em + " · " + porAluno[em].length + " resposta(s)");
    txt.push("");
    porAluno[em].forEach(function (l, i) {
      var quando = l[cData] instanceof Date ? Utilities.formatDate(l[cData], tz, "dd/MM HH:mm") : get(l, cData);
      var info = "";
      try {
        var d = JSON.parse(get(l, cDados) || "{}");
        info = "XP " + (d.xp || 0) + " · cadernos rodados " + (d.cadernos || 0) + "/12" +
          (d.notaTreino ? " · nota de treino " + d.notaTreino : "") +
          " · acertos " + (d.acertos || 0) + " · erros " + (d.erros || 0) +
          (d.tentativa > 1 ? " · enviado na tentativa " + d.tentativa : "");
      } catch (e) { info = get(l, cDados); }
      txt.push("==== " + (i + 1) + ". " + get(l, cTipo).toUpperCase() + " · " + get(l, cCad) + " · " + quando);
      txt.push("PERGUNTA: " + get(l, cPerg));
      txt.push("");
      txt.push(get(l, cResp));
      txt.push("");
      if (info) txt.push("(" + info + ")");
      txt.push("");
    });
  });

  MailApp.sendEmail({
    to: DESTINOS,
    subject: "A Rotativa · " + linhas.length + " resposta(s) nova(s) · " + hoje,
    body: txt.join("\n")
  });
  p.setProperty("ultimaLinha", String(total));
  Logger.log("Resumo enviado: " + linhas.length + " resposta(s).");
}

function testeEnvio() {
  MailApp.sendEmail(DESTINOS, "A Rotativa · teste do resumo diário",
    "Teste do resumo diário do jogo A Rotativa (Jornalismo Impresso Diário, turma noturna).\n\n" +
    "Uma vez por dia, de madrugada (entre 3h e 4h, horário de Brasília), chega aqui um e-mail com as respostas " +
    "escritas e os pareceres novos dos alunos, agrupados por aluno. Dia sem envio novo não gera e-mail.\n\n" +
    "A planilha com tudo fica na conta araujofamilia@gmail.com: " + abaRespostas_().getParent().getUrl());
}

/* ---------------- 3 e 4. casos novos para o jogo ---------------- */
function lerNoticias_() {
  var cache = CacheService.getScriptCache();
  var guardado = cache.get("noticias");
  if (guardado) return JSON.parse(guardado);
  var id = PropertiesService.getScriptProperties().getProperty("pastaId") || PASTA_NOTICIAS;
  var casos = [];
  if (id) {
    var arqs = DriveApp.getFolderById(id).getFiles();
    while (arqs.hasNext()) {
      var f = arqs.next();
      if (f.isTrashed() || /^leia-me/i.test(f.getName())) continue;
      var txt = "";
      try {
        txt = f.getMimeType() === MimeType.GOOGLE_DOCS
          ? DocumentApp.openById(f.getId()).getBody().getText()
          : f.getBlob().getDataAsString("UTF-8");
        var d = JSON.parse(txt);
        (Array.isArray(d) ? d : (d.casos || [])).forEach(function (x) { casos.push(x); });
      } catch (e) { Logger.log("Arquivo ignorado (" + f.getName() + "): " + e); }
    }
  }
  try { cache.put("noticias", JSON.stringify(casos), 300); } catch (e) {}
  return casos;
}

function doGet(e) {
  var prm = (e && e.parameter) || {};
  var dados;
  if (prm.config) {
    var cache = CacheService.getScriptCache(), guardado = cache.get("envio"), envio = null;
    if (guardado) envio = JSON.parse(guardado);
    else {
      var formId = PropertiesService.getScriptProperties().getProperty("formId");
      if (formId) {
        envio = camposDoForm_(FormApp.openById(formId));
        try { cache.put("envio", JSON.stringify(envio), 21600); } catch (e) {}
      }
    }
    dados = { envio: envio };
  } else {
    dados = { casos: lerNoticias_(), gerado: new Date().toISOString() };
  }
  var json = JSON.stringify(dados);
  var cb = String(prm.callback || "");
  if (/^[A-Za-z_$][\w$]*$/.test(cb)) {
    return ContentService.createTextOutput(cb + "(" + json + ");").setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function limparCache() { CacheService.getScriptCache().remove("noticias"); }
