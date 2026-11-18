/* A Rotativa: lógica do jogo. Sem dependências. */
(function () {
  "use strict";

  var VERSAO = "2026-11-17a";
  var PREF = "rotativa-impresso:v1:";
  var ULTIMO = "rotativa-impresso:ultimo";
  var MIN_DISS = 40, MIN_PARECER = 150;
  var N_OBJ = 4, N_CASO = 2, N_PLANTAO = 10, N_RELAMPAGO = 10, N_NOTICIAS = 8;
  var FIM = new Date(CONFIG.fimEnvio || "2026-11-29T00:00:00-03:00").getTime();
  var PARA_PARECER = CONFIG.cadernosParaParecer || 6;
  var TOTAL = CADERNOS.length;

  var app = document.getElementById("app");
  var barra = document.getElementById("barra");
  var toastEl = document.getElementById("toast");
  var S = null;
  var porId = {};
  CADERNOS.forEach(function (t) { porId[t.id] = t; });
  var NOTICIAS = [];
  var telaAtual = "";

  /* ---------------- utilidades ---------------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function embaralha(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function sorteia(a, n) { return embaralha(a).slice(0, n); }
  function idx(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function palavras(t) { return (t.trim().match(/\S+/g) || []).length; }
  function agora() { return new Date().toISOString(); }
  function dataBR(iso) { try { var d = new Date(iso); return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); } catch (e) { return iso; } }
  function emailValido(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); }
  function fmtNota(n) { return (Math.round(n * 10) / 10).toFixed(1).replace(".", ","); }
  function prazoAberto() { return Date.now() < FIM; }
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function () { toastEl.classList.remove("on"); }, 3400); }
  function flutua(txt, el) {
    try {
      var r = el ? el.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0 };
      var d = document.createElement("div"); d.className = "xpfloat"; d.textContent = txt;
      d.style.left = (r.left + r.width / 2 - 20) + "px"; d.style.top = (r.top - 10) + "px";
      document.body.appendChild(d); setTimeout(function () { d.remove(); }, 1200);
    } catch (e) {}
  }
  function confirma(msg, sim) {
    var fundo = document.createElement("div");
    fundo.style.cssText = "position:fixed;inset:0;background:rgba(29,27,24,.55);z-index:70;display:flex;align-items:center;justify-content:center;padding:18px";
    fundo.innerHTML = '<div class="box" style="max-width:460px"><p style="margin-top:0">' + esc(msg) + '</p><div class="acoes"><button class="btn verm" data-r="1">Sim</button><button class="btn sec" data-r="0">Não</button></div></div>';
    document.body.appendChild(fundo);
    fundo.addEventListener("click", function (e) { var b = e.target.closest("[data-r]"); if (!b && e.target !== fundo) return; fundo.remove(); if (b && b.dataset.r === "1") sim(); });
  }
  function topo() { window.scrollTo(0, 0); }
  function fraseCorrecao() { return CONFIG.correcao || "O professor lê e devolve um comentário; na correção, usa IA em parte e supervisiona cada devolutiva."; }

  /* ---------------- estado ---------------- */
  function novo(email, nome) {
    return { v: 1, email: email, nome: nome, inicio: agora(), xp: 0, acertos: 0, erros: 0, seq: 0, melhorSeq: 0,
      cad: {}, plantao: { rodadas: 0, melhor: 0 }, relampago: { rodadas: 0, melhor: 0 }, noticias: { rodadas: 0, melhor: 0 },
      pareceres: 0, respostas: [], fila: [], rodada: null, rascunhos: {}, entrada: { total: 0 } };
  }
  function salvar() { try { localStorage.setItem(PREF + S.email, JSON.stringify(S)); localStorage.setItem(ULTIMO, S.email); } catch (e) {} }
  function carregar(email) { try { var t = localStorage.getItem(PREF + email); return t ? JSON.parse(t) : null; } catch (e) { return null; } }
  function cadEstado(id) { if (!S.cad[id]) S.cad[id] = { rodadas: 0, melhor: 0, rodou: false }; return S.cad[id]; }
  function rodados() { return CADERNOS.filter(function (t) { return S.cad[t.id] && S.cad[t.id].rodou; }).length; }
  function notaTreino() {
    var ns = CADERNOS.filter(function (t) { return S.cad[t.id] && S.cad[t.id].rodadas; }).map(function (t) { return S.cad[t.id].melhor; });
    if (!ns.length) return null;
    return { media: ns.reduce(function (a, b) { return a + b; }, 0) / ns.length, n: ns.length };
  }
  function nivel() { var n = NIVEIS[0], prox = null; for (var i = 0; i < NIVEIS.length; i++) { if (S.xp >= NIVEIS[i].xp) { n = NIVEIS[i]; prox = NIVEIS[i + 1] || null; } } return { n: n, prox: prox }; }
  function ganha(x, el) { S.xp += x; if (x > 0) flutua("+" + x, el); }
  function pendentes() { return (S && S.fila || []).filter(function (x) { return !x.ok; }); }
  function filaDe(id) { var f = S.fila || []; for (var i = 0; i < f.length; i++) if (f[i].id === id) return f[i]; return null; }

  /* ---------------- aviso do prazo ---------------- */
  function avisoFim() {
    var ult = new Date(FIM - 1), hj = new Date();
    var dias = Math.round((Date.UTC(ult.getFullYear(), ult.getMonth(), ult.getDate()) - Date.UTC(hj.getFullYear(), hj.getMonth(), hj.getDate())) / 86400000);
    var quando = dias > 1 ? "Faltam " + dias + " dias." : (dias === 1 ? "É amanhã." : "É hoje.");
    if (!prazoAberto()) return '<div class="aviso" style="margin:14px 0"><b>O envio de textos fechou</b> ' + esc(CONFIG.fimTexto) + '. As questões continuam abertas para treino até a prova de ' + esc(CONFIG.dataProva) + '.</div>';
    return '<div class="aviso" style="margin:14px 0"><b>Atenção:</b> A Rotativa roda até ' + esc(CONFIG.fimTexto) + '. Depois disso, dissertativas e pareceres não seguem mais para o professor, para dar tempo da devolutiva antes da prova de ' + esc(CONFIG.dataProva) + '. ' + quando + '</div>';
  }

  /* ---------------- barra ---------------- */
  function desenhaBarra() {
    if (!S) { barra.hidden = true; return; }
    barra.hidden = false;
    var nv = nivel();
    var pct = nv.prox ? Math.round((S.xp - nv.n.xp) / (nv.prox.xp - nv.n.xp) * 100) : 100;
    var pend = pendentes().length;
    var nt = notaTreino();
    barra.innerHTML = '<div class="in"><span class="marca" data-ir="redacao">A Rotativa</span>' +
      '<span class="chip" title="Seu cargo na redação">' + esc(nv.n.nome) + ' · ' + S.xp + ' XP<span class="xpbar"><i style="width:' + pct + '%"></i></span></span>' +
      '<span class="chip" title="Cadernos que já rodaram">Cadernos ' + rodados() + '/' + TOTAL + '</span>' +
      '<span class="chip" title="Média das suas melhores rodadas. Não vale nota no semestre.">' + (nt ? 'Nota de treino ' + fmtNota(nt.media) : 'Sem nota de treino ainda') + '</span>' +
      '<span class="esp"></span>' +
      '<button data-ir="banco">Banco</button>' +
      '<button data-ir="respostas">Respostas' + (pend ? ' (' + pend + ' na fila)' : '') + '</button>' +
      '<button data-ir="redacao">Redação</button></div>';
  }
  barra.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ir]"); if (!b) return;
    if (b.dataset.ir === "redacao") telaRedacao(); else if (b.dataset.ir === "banco") telaBanco(); else telaRespostas();
  });

  /* ---------------- capa ---------------- */
  function telaFechada() {
    S = null; desenhaBarra(); telaAtual = "fechada";
    app.innerHTML =
      '<header class="masthead"><div class="kicker">Jornalismo Impresso Diário · PUC-Campinas · Turma noturna (T0101)</div>' +
      '<h1>A Rotativa</h1><div class="sub">o jogo de revisão do jornalismo impresso</div></header>' +
      '<div class="dateline"><span>Edição de revisão · 2026/2</span><span>Prova individual em ' + esc(CONFIG.dataProva) + '</span><span>Rodou até ' + esc(CONFIG.fimCurto) + '</span></div>' +
      '<div class="carimbao verm" style="display:block;width:max-content;margin:30px auto">EDIÇÃO FECHADA</div>' +
      '<p class="linhafina" style="text-align:center">A Rotativa parou ' + esc(CONFIG.fimTexto) + ', para dar tempo das devolutivas antes da prova de ' + esc(CONFIG.dataProva) + '. Boa prova!</p>' +
      '<div class="rodape">Versão ' + VERSAO + '.</div>';
  }

  function telaCapa() {
    if (CONFIG.fecharTudoNoPrazo && !prazoAberto()) { telaFechada(); return; }
    S = null; desenhaBarra(); telaAtual = "capa";
    var ult = ""; try { ult = localStorage.getItem(ULTIMO) || ""; } catch (e) {}
    var antigo = ult ? carregar(ult) : null;
    app.innerHTML =
      '<header class="masthead"><div class="kicker">Jornalismo Impresso Diário · PUC-Campinas · Turma noturna (T0101)</div>' +
      '<h1>A Rotativa</h1><div class="sub">o jogo de revisão do jornalismo impresso</div></header>' +
      '<div class="dateline"><span>Edição de revisão · 2026/2</span><span>Prova individual em ' + esc(CONFIG.dataProva) + '</span><span>Roda até ' + esc(CONFIG.fimCurto) + '</span></div>' + avisoFim() +
      '<div class="cols"><div class="c-intro">' +
      '<div class="selo">Edição extra</div>' +
      '<div class="manchete">Doze cadernos, uma edição: você roda antes da prova?</div>' +
      '<p class="linhafina">Você entra na redação como foca. Cada caderno é uma aula do semestre: história do impresso, projeto gráfico, gêneros, DNA, reportagem, capas históricas, plataformas, Fowler e sustentabilidade. Em cada um: questões, casos reais dos jornais e uma resposta escrita. Quando metade da edição rodar, abre o Fechamento: o parecer \"preservar ou reinventar\".</p>' +
      '</div><div class="c-resto">' +
      '<div class="aviso"><b>Não vale nota.</b> O jogo dá uma nota de treino a cada rodada, mas ela é só para você saber como está: não conta no semestre. Treina para a prova de ' + esc(CONFIG.dataProva) + ', que traz o banco de conceitos impresso no enunciado e pede para usá-lo num objeto concreto, com as análises que você fez no semestre.</div>' +
      '<h2 class="secao">Como funciona</h2><ul class="lista">' +
      '<li><b>Cadernos:</b> doze, um por aula. Cada rodada traz múltipla escolha, uma questão do banco de conceitos ou da linha do tempo, dois casos para aplicar e uma resposta escrita.</li>' +
      '<li><b>Plantão:</b> casos misturados, de jornais de novembro de 2026 (Correio Popular, Correio da Manhã de Campinas, Folha de S.Paulo, Estadão, Estado de Minas, Zero Hora e Diario de Pernambuco), das aulas e de situações criadas para o treino.</li>' +
      '<li><b>Notícias novas:</b> casos tirados dos jornais dos últimos dias entram no jogo ao longo da semana.</li>' +
      '<li><b>Jogue quantas vezes quiser:</b> cada rodada sorteia outras questões.</li>' +
      '<li><b>Ao entregar</b> uma resposta escrita, o texto segue sozinho para o professor, com seu nome e e-mail. Se a internet falhar, ele espera numa fila e tenta de novo. ' + esc(fraseCorrecao()) + '</li>' +
      '<li><b>Seu progresso</b> fica salvo neste navegador. Use sempre o mesmo e-mail.</li></ul>' +
      '</div><div class="c-entrada"><div class="box"><div class="tipo" style="--c:var(--vermelho)">Crachá de entrada</div>' +
      '<label class="l" for="nome">Seu nome completo</label>' +
      '<input class="campo" id="nome" type="text" autocomplete="name" value="' + esc(antigo && antigo.nome || "") + '">' +
      '<label class="l" for="email">Seu e-mail</label>' +
      '<input class="campo" id="email" type="email" autocomplete="email" placeholder="seu.nome@puccampinas.edu.br" value="' + esc(ult) + '">' +
      '<div class="erro" id="erro"></div>' +
      '<div class="acoes"><button class="btn verm" id="entrar">Entrar na redação</button></div>' +
      '<p class="mini">O nome e o e-mail identificam suas respostas para a devolutiva e guardam seu progresso.</p>' +
      '<div id="retorno"></div></div></div></div>' +
      '<div class="rodape">Casos reais citados com veículo e data. Situações sem fonte foram criadas para o treino. Jogo feito com apoio de IA, sob supervisão do professor Artur Araujo. Versão ' + VERSAO + '.</div>';
    var inp = document.getElementById("email"), nm = document.getElementById("nome");
    function mostraRetorno() {
      var e = inp.value.trim().toLowerCase(); var s = emailValido(e) ? carregar(e) : null;
      document.getElementById("retorno").innerHTML = s ? '<p class="mini" style="color:var(--verde)">Bem-vindo de volta: ' + s.xp + ' XP, ' + CADERNOS.filter(function (t) { return s.cad[t.id] && s.cad[t.id].rodou; }).length + ' de ' + TOTAL + ' cadernos rodados.</p>' : "";
      if (s && s.nome && !nm.value.trim()) nm.value = s.nome;
    }
    inp.addEventListener("input", mostraRetorno); mostraRetorno();
    function entrar() {
      var e = inp.value.trim().toLowerCase(), n = nm.value.trim().replace(/\s+/g, " ");
      if (n.split(" ").length < 2) { document.getElementById("erro").textContent = "Escreva seu nome completo (nome e sobrenome)."; nm.focus(); return; }
      if (!emailValido(e)) { document.getElementById("erro").textContent = "Digite um e-mail válido."; inp.focus(); return; }
      S = carregar(e) || novo(e, n);
      S.nome = n; if (!S.fila) S.fila = []; if (!S.noticias) S.noticias = { rodadas: 0, melhor: 0 }; if (!S.relampago) S.relampago = { rodadas: 0, melhor: 0 };
      salvar(); processaFila(); telaEntrada();
    }
    document.getElementById("entrar").onclick = entrar;
    inp.addEventListener("keydown", function (ev) { if (ev.key === "Enter") entrar(); });
    nm.addEventListener("keydown", function (ev) { if (ev.key === "Enter") inp.focus(); });
  }

  /* ---------------- geradores de questões ---------------- */
  function deObj(q, rotulo) {
    return { tipo: "esc", rotulo: rotulo || (q.vf ? "Verdadeiro ou falso" : "Múltipla escolha"), q: q.q, ops: q.ops.slice(), c: q.c, exp: q.exp, vf: !!q.vf, pts: 10,
      ordem: q.vf ? idx(q.ops.length) : embaralha(idx(q.ops.length)) };
  }
  function deCaso(c) {
    return { tipo: "esc", rotulo: c.fonte ? "Aplique · caso real" : "Aplique · situação para treino", recorte: { fonte: c.fonte || "", txt: c.txt, novo: !!c.novo },
      q: c.pergunta, ops: c.ops.slice(), c: c.c || 0, exp: c.exp, pts: 15, ordem: embaralha(idx(c.ops.length)), cad: c.cad };
  }
  function geraVerbete(pool) {
    var v = sorteia(pool, 1)[0];
    var mesmos = BANCO.filter(function (b) { return b.cat === v.cat && b.t !== v.t; });
    var outros = sorteia(mesmos, 3);
    if (outros.length < 3) outros = outros.concat(sorteia(BANCO.filter(function (b) { return b.t !== v.t && outros.indexOf(b) < 0; }), 3 - outros.length));
    var revela = v.d.toLowerCase().indexOf(v.t.toLowerCase().slice(0, Math.max(3, v.t.length - 1))) >= 0;
    if (!revela && Math.random() < 0.5) {
      return { tipo: "esc", rotulo: "Banco de conceitos", q: "Qual verbete do banco de conceitos diz isto? \"" + v.d + "\"",
        ops: [v.t].concat(outros.map(function (o) { return o.t; })), c: 0, pts: 8, ordem: embaralha(idx(4)),
        exp: v.t + ": " + v.d + " Na prova, o verbete vem impresso: o que vale é reconhecer a coisa num objeto concreto." };
    }
    return { tipo: "esc", rotulo: "Banco de conceitos", q: "No banco de conceitos, o que é \"" + v.t + "\"?",
      ops: [v.d].concat(outros.map(function (o) { return o.d; })), c: 0, pts: 8, ordem: embaralha(idx(4)),
      exp: v.t + ": " + v.d };
  }
  function geraMarco(pool) {
    var anos = {}; MARCOS.forEach(function (m) { anos[m.ano] = true; });
    if (Math.random() < 0.5 || pool.length < 3) {
      var m = sorteia(pool, 1)[0];
      var outrosAnos = sorteia(Object.keys(anos).map(Number).filter(function (a) { return a !== m.ano; }), 3);
      return { tipo: "esc", rotulo: "Linha do tempo", q: "Em que ano? " + m.txt + ".",
        ops: [String(m.ano)].concat(outrosAnos.map(String)), c: 0, pts: 8, ordem: embaralha(idx(4)),
        exp: m.txt + " (" + m.ano + ")." };
    }
    var escolhidos = [], vistos = {};
    embaralha(pool).forEach(function (x) { if (escolhidos.length < 3 && !vistos[x.ano]) { vistos[x.ano] = true; escolhidos.push(x); } });
    if (escolhidos.length < 3) embaralha(MARCOS).forEach(function (x) { if (escolhidos.length < 3 && !vistos[x.ano]) { vistos[x.ano] = true; escolhidos.push(x); } });
    escolhidos.sort(function (a, b) { return a.ano - b.ano; });
    return { tipo: "esc", rotulo: "Linha do tempo", q: "Qual destes aconteceu primeiro?",
      ops: escolhidos.map(function (x) { return x.txt + "."; }), c: 0, pts: 8, ordem: embaralha(idx(escolhidos.length)),
      exp: escolhidos.map(function (x) { return x.ano + ": " + x.txt; }).join(". ") + "." };
  }
  function geraParaCaderno(id) {
    var bancoCad = BANCO.filter(function (b) { return b.cad === id; });
    var marcosCad = MARCOS.filter(function (m) { return m.cad === id; });
    if (marcosCad.length >= 2 && (Math.random() < 0.4 || bancoCad.length < 2)) return geraMarco(marcosCad.length >= 3 ? marcosCad : MARCOS);
    return geraVerbete(bancoCad.length >= 2 ? bancoCad : BANCO);
  }
  function todosCasos() { return CASOS.concat(NOTICIAS); }

  /* ---------------- pergunta de entrada ---------------- */
  function telaEntrada() {
    var pool = [];
    CADERNOS.forEach(function (t) { (OBJ[t.id] || []).forEach(function (q) { pool.push(q); }); });
    var item = Math.random() < 0.3 ? (Math.random() < 0.5 ? geraVerbete(BANCO) : geraMarco(MARCOS)) : deObj(sorteia(pool, 1)[0]);
    desenhaBarra(); topo(); telaAtual = "entrada";
    app.innerHTML = '<div class="dateline" style="margin-top:18px"><span>' + esc(S.nome) + '</span><span>Pergunta de entrada</span><span>Sorteada a cada login</span></div>' + avisoFim() +
      '<div class="cartao" style="--c:var(--ouro)"><div class="tipo">Pergunta de entrada · ' + esc(item.rotulo) + '</div><div class="enun">' + esc(item.q) + '</div><div class="ops">' +
      item.ordem.map(function (o, i) { return '<button class="op" data-o="' + o + '"><span class="letra">' + "ABCDE"[i] + '</span><span>' + esc(item.ops[o]) + '</span></button>'; }).join("") +
      '</div><div id="fb"></div></div><div class="acoes"><button class="btn sec" id="pular">Ir direto para a redação</button></div>';
    document.getElementById("pular").onclick = telaRedacao;
    var bts = app.querySelectorAll(".op");
    bts.forEach(function (b) {
      b.onclick = function () {
        var certo = +b.dataset.o === item.c;
        bts.forEach(function (x) { x.disabled = true; if (+x.dataset.o === item.c) x.classList.add("certa"); });
        if (!certo) b.classList.add("errada");
        if (certo) { S.acertos++; ganha(10, b); } else { S.erros++; }
        S.entrada.total = (S.entrada.total || 0) + 1; salvar(); desenhaBarra();
        document.getElementById("fb").innerHTML = '<div class="feedback ' + (certo ? 'ok' : 'no') + '"><b class="v">' + (certo ? 'Certo!' : 'Não foi dessa vez.') + '</b>' + esc(item.exp) + '</div>' +
          '<div class="acoes"><button class="btn" id="seguir">Entrar na redação</button></div>';
        document.getElementById("pular").style.display = "none";
        var sg = document.getElementById("seguir"); sg.focus(); sg.onclick = telaRedacao;
      };
    });
  }

  /* ---------------- redação ---------------- */
  function telaRedacao() {
    desenhaBarra(); topo(); telaAtual = "redacao";
    var c = rodados(), nt = notaTreino();
    var html = '<div class="dateline" style="margin-top:18px"><span>' + esc(S.nome) + '</span><span>' + c + ' de ' + TOTAL + ' cadernos rodados</span><span>' + S.acertos + ' acertos · melhor sequência ' + S.melhorSeq + '</span></div>' + avisoFim();
    if (S.rodada) {
      var r = S.rodada;
      html += '<div class="aviso" style="border-color:var(--ouro);background:#fbf6ea;margin-bottom:16px"><b style="color:var(--tinta)">Rodada em andamento:</b> ' + esc(nomeRodada(r)) + ', questão ' + (r.i + 1) + ' de ' + r.itens.length + '. <button class="btn" style="margin-left:8px;padding:6px 14px;font-size:14px" id="continuar">Continuar de onde parei</button></div>';
    }
    html += '<div class="manchete" style="font-size:clamp(28px,4vw,40px)">A redação</div><div class="progresso"><i style="width:' + (c / TOTAL * 100) + '%"></i></div>' +
      '<p class="mini">Escolha um caderno. Cada um é uma aula. O caderno roda quando você acerta pelo menos metade das questões de escolha e entrega a resposta escrita. ' +
      (nt ? 'Sua nota de treino: <b>' + fmtNota(nt.media) + '</b> (média das melhores rodadas em ' + nt.n + ' caderno' + (nt.n > 1 ? 's' : '') + '; só das questões de escolha, a ser complementada com a análise das respostas escritas; não vale nota no semestre).' : '') + '</p><div class="grade">';
    CADERNOS.forEach(function (t) {
      var s = S.cad[t.id];
      var st = !s || !s.rodadas ? "Nova pauta" : "Melhor nota: " + fmtNota(s.melhor) + " · " + s.rodadas + " rodada(s)";
      html += '<button class="mesa" style="--c:' + t.cor + '" data-cad="' + t.id + '"><span class="simb">' + t.simbolo + '</span><div class="num">Caderno&nbsp;' + t.n + ' · ' + esc(t.aula.split(" · ")[0]).replace(/ /g, "&nbsp;") + '</div><div class="nome">' + esc(t.nome) + '</div><div class="st">' + st + '</div>' + (s && s.rodou ? '<span class="carimbo">RODOU</span>' : '') + '</button>';
    });
    var aberto = c >= PARA_PARECER;
    html += '<button class="mesa especial" data-especial="plantao"><span class="simb">☎</span><div class="num">Plantão</div><div class="nome">Casos misturados</div><div class="st">' + N_PLANTAO + ' casos de todos os cadernos · ' + (S.plantao.rodadas ? 'melhor nota: ' + fmtNota(S.plantao.melhor) : 'ainda não jogado') + '</div></button>';
    html += '<button class="mesa especial" data-especial="noticias"><span class="simb">✉</span><div class="num">Notícias novas</div><div class="nome">Os jornais dos últimos dias</div><div class="st">' + (NOTICIAS.length ? NOTICIAS.length + ' caso(s) novo(s) no jogo' : 'Os casos novos entram ao longo da semana') + '</div></button>';
    html += '<button class="mesa especial" data-especial="relampago"><span class="simb">≡</span><div class="num">Banco de conceitos</div><div class="nome">Treino relâmpago</div><div class="st">' + N_RELAMPAGO + ' verbetes e marcos históricos · ' + (S.relampago.rodadas ? 'melhor nota: ' + fmtNota(S.relampago.melhor) : 'ainda não jogado') + '</div></button>';
    html += '<button class="mesa especial' + (aberto ? '' : ' trancada') + '" data-especial="fechamento"><span class="simb">' + (aberto ? '✎' : '🔒') + '</span><div class="num">Fechamento</div><div class="nome">O parecer: preservar ou reinventar</div><div class="st">' + (aberto ? 'Aberto · pareceres entregues: ' + S.pareceres : 'Abre com ' + PARA_PARECER + ' cadernos rodados (' + c + '/' + PARA_PARECER + ')') + '</div></button>';
    html += '</div><h2 class="secao">Crachás</h2><div>';
    CADERNOS.forEach(function (t) { var ok = S.cad[t.id] && S.cad[t.id].rodou; html += '<span class="cracha' + (ok ? '' : ' off') + '" style="--c:' + t.cor + '">' + t.simbolo + ' ' + esc(t.curto) + '</span>'; });
    html += '<span class="cracha' + (S.plantao.melhor >= 10 ? '' : ' off') + '" style="--c:var(--ouro)">☎ Plantão perfeito</span>';
    html += '<span class="cracha' + (S.relampago.melhor >= 10 ? '' : ' off') + '" style="--c:var(--ouro)">≡ Banco na ponta da língua</span>';
    html += '<span class="cracha' + (S.pareceres ? '' : ' off') + '" style="--c:var(--vermelho)">✎ Edição fechada</span>';
    html += '<span class="cracha' + (S.melhorSeq >= 10 ? '' : ' off') + '" style="--c:var(--verde)">⚡ 10 seguidas</span></div>';
    html += '<div class="acoes"><button class="btn sec" id="trocar">Trocar de usuário</button><button class="btn sec" id="banco">Banco de conceitos</button><button class="btn sec" id="resp">Minhas respostas</button></div>';
    html += '<div class="rodape">Prepara para a prova de ' + esc(CONFIG.dataProva) + '. Progresso salvo neste navegador. Versão ' + VERSAO + '.</div>';
    app.innerHTML = html;
    app.querySelectorAll("[data-cad]").forEach(function (b) { b.onclick = function () { telaPauta(b.dataset.cad); }; });
    app.querySelector('[data-especial="plantao"]').onclick = function () { confirmaTroca(novaPlantao); };
    app.querySelector('[data-especial="relampago"]').onclick = function () { confirmaTroca(novaRelampago); };
    app.querySelector('[data-especial="noticias"]').onclick = function () {
      if (NOTICIAS.length < 3) { toast("Ainda não há casos novos suficientes. Volte amanhã; enquanto isso, o Plantão tem casos de 17/11."); return; }
      confirmaTroca(novaNoticias);
    };
    app.querySelector('[data-especial="fechamento"]').onclick = function () { if (aberto) telaFechamentoEscolha(); else toast("Rode " + PARA_PARECER + " cadernos para abrir o Fechamento."); };
    document.getElementById("trocar").onclick = function () { telaCapa(); };
    document.getElementById("banco").onclick = telaBanco;
    document.getElementById("resp").onclick = telaRespostas;
    var cont = document.getElementById("continuar"); if (cont) cont.onclick = mostraItem;
  }
  function nomeRodada(r) {
    if (r.modo === "caderno") return porId[r.cad].nome;
    return { plantao: "Plantão", relampago: "Banco de conceitos", noticias: "Notícias novas" }[r.modo] || "Rodada";
  }
  function confirmaTroca(fn) {
    if (S.rodada) confirma("Você tem uma rodada em andamento. Começar outra apaga essa rodada (seus pontos e as respostas já entregues ficam). Continuar?", fn);
    else fn();
  }

  /* ---------------- pauta do caderno ---------------- */
  function telaPauta(id) {
    var t = porId[id]; desenhaBarra(); topo(); telaAtual = "pauta";
    var emAnd = S.rodada && S.rodada.modo === "caderno" && S.rodada.cad === id;
    var verb = BANCO.filter(function (b) { return b.cad === id; });
    var marc = MARCOS.filter(function (m) { return m.cad === id; });
    var s = S.cad[id];
    app.innerHTML = '<div class="dateline" style="margin-top:18px"><span>Caderno ' + t.n + '</span><span>' + esc(t.aula) + '</span><span>' + (s && s.rodadas ? s.rodadas + " rodada(s) · melhor nota " + fmtNota(s.melhor) : "Primeira vez") + '</span></div>' +
      '<div class="pauta" style="--c:' + t.cor + '"><div class="tipo" style="--c:' + t.cor + '">' + t.simbolo + ' ' + esc(t.nome) + '</div>' +
      '<div class="frase">' + esc(t.frase) + '</div><dl class="ficha">' +
      '<dt>Pergunta-chave</dt><dd>' + esc(t.pergunta) + '</dd>' +
      '<dt>Conceitos</dt><dd>' + t.conceitos.map(esc).join(" · ") + '</dd>' +
      '<dt>Para lembrar</dt><dd>' + esc(t.lembrar) + '</dd>' +
      '<dt>Armadilha da prova</dt><dd><b>' + esc(t.armadilha) + '</b></dd>' +
      '<dt>De onde vem</dt><dd>' + esc(t.fonte) + '</dd></dl>' +
      (verb.length ? '<div class="arquivo"><div class="tipo" style="--c:var(--cinza)">Verbetes deste caderno no banco de conceitos</div><ul class="lista">' + verb.map(function (b) { return '<li><b>' + esc(b.t) + ':</b> ' + esc(b.d) + '</li>'; }).join("") + '</ul></div>' : '') +
      (marc.length ? '<div class="arquivo"><div class="tipo" style="--c:var(--cinza)">Na linha do tempo</div><ul class="lista">' + marc.map(function (m) { return '<li><b>' + m.ano + ':</b> ' + esc(m.txt) + '</li>'; }).join("") + '</ul></div>' : '') +
      '</div>' +
      '<div class="acoes">' + (emAnd ? '<button class="btn" id="cont">Continuar a rodada</button>' : '') +
      '<button class="btn' + (emAnd ? ' sec' : ' verm') + '" id="comecar">' + (emAnd ? 'Começar outra rodada' : 'Começar a rodada') + '</button>' +
      '<button class="btn sec" id="volta">Voltar à redação</button></div>' +
      '<p class="mini">A rodada tem ' + N_OBJ + ' questões de múltipla escolha, 1 do banco de conceitos ou da linha do tempo, ' + N_CASO + ' casos para aplicar e 1 resposta escrita.</p>';
    document.getElementById("comecar").onclick = function () { confirmaTroca(function () { novaCaderno(id); }); };
    document.getElementById("volta").onclick = telaRedacao;
    var c = document.getElementById("cont"); if (c) c.onclick = mostraItem;
  }

  /* ---------------- montagem das rodadas ---------------- */
  function novaCaderno(id) {
    var objs = sorteia(OBJ[id] || [], N_OBJ).map(function (q) { return deObj(q); });
    var gen = geraParaCaderno(id);
    var casos = todosCasos().filter(function (x) { return x.cad === id; });
    var reais = casos.filter(function (x) { return x.fonte; }), simul = casos.filter(function (x) { return !x.fonte; });
    var esc2 = [];
    if (reais.length) esc2.push(sorteia(reais, 1)[0]);
    esc2 = esc2.concat(sorteia(simul.concat(reais).filter(function (x) { return esc2.indexOf(x) < 0; }), N_CASO - esc2.length));
    var escolhas = embaralha(objs.concat([gen]).concat(esc2.map(deCaso)));
    var d = Math.floor(Math.random() * DISS[id].length);
    escolhas.push({ tipo: "diss", cad: id, d: d });
    S.rodada = { modo: "caderno", cad: id, itens: escolhas, i: 0, res: [], inicio: agora() };
    salvar(); mostraItem();
  }
  function novaPlantao() {
    var itens = sorteia(todosCasos(), N_PLANTAO).map(deCaso);
    S.rodada = { modo: "plantao", itens: itens, i: 0, res: [], inicio: agora() };
    salvar(); mostraItem();
  }
  function novaNoticias() {
    var ord = NOTICIAS.slice().sort(function (a, b) { return String(b.data || "").localeCompare(String(a.data || "")); });
    var itens = sorteia(ord.slice(0, 16), N_NOTICIAS).map(deCaso);
    S.rodada = { modo: "noticias", itens: itens, i: 0, res: [], inicio: agora() };
    salvar(); mostraItem();
  }
  function novaRelampago() {
    var itens = [];
    for (var i = 0; i < N_RELAMPAGO; i++) itens.push(i < 6 ? geraVerbete(BANCO) : geraMarco(MARCOS));
    S.rodada = { modo: "relampago", itens: embaralha(itens), i: 0, res: [], inicio: agora() };
    salvar(); mostraItem();
  }

  /* ---------------- exibição de um item ---------------- */
  function corRodada(r) { return r.modo === "caderno" ? porId[r.cad].cor : "var(--ouro)"; }
  function pontinhos(r) {
    return '<div class="pontos">' + r.itens.map(function (it, i) {
      var cl = i < r.res.length ? (r.res[i] === false ? "no" : "ok") : (i === r.i ? "at" : "");
      return '<span class="' + cl + '"></span>';
    }).join("") + '</div>';
  }
  function cabecalhoItem(r) {
    return '<div class="topo-rodada"><div><div class="tipo" style="--c:' + corRodada(r) + '">' + esc(nomeRodada(r)) + '</div><div class="mini">Questão ' + (r.i + 1) + ' de ' + r.itens.length + '</div></div>' + pontinhos(r) + '</div>';
  }
  function recorte(rc) {
    return '<div class="recorte"><span class="fonte' + (rc.fonte ? ' real' : '') + '">' + (rc.novo ? '<span class="tag ok" style="margin:0 6px 0 0">NOVO</span>' : '') + (rc.fonte ? 'Caso real · ' + esc(rc.fonte) : 'Situação criada para o treino') + '</span>' + esc(rc.txt) + '</div>';
  }

  function mostraItem() {
    var r = S.rodada; if (!r) { telaRedacao(); return; }
    if (r.i >= r.itens.length) { fimRodada(); return; }
    desenhaBarra(); topo(); telaAtual = "item";
    var it = r.itens[r.i];
    var html = cabecalhoItem(r) + '<div class="cartao" style="--c:' + corRodada(r) + '">';
    if (it.tipo === "esc") {
      html += '<div class="tipo">' + esc(it.rotulo) + '</div>' + (it.recorte ? recorte(it.recorte) : '') +
        '<div class="enun"' + (it.recorte ? ' style="font-size:19px"' : '') + '>' + esc(it.q) + '</div><div class="ops">' +
        it.ordem.map(function (o, i) { return '<button class="op" data-o="' + o + '"><span class="letra">' + "ABCDE"[i] + '</span><span>' + esc(it.ops[o]) + '</span></button>'; }).join("") + '</div><div id="fb"></div>';
    } else {
      var dq = DISS[it.cad][it.d];
      html += '<div class="tipo">Resposta escrita · o professor comenta</div><div class="enun">' + esc(dq.q) + '</div>' +
        '<textarea id="txt" placeholder="Escreva aqui. Pelo menos ' + MIN_DISS + ' palavras."></textarea><div class="contador" id="cont"></div>' +
        (prazoAberto() ? '' : '<p class="mini" style="color:var(--vermelho)">O envio de textos fechou ' + esc(CONFIG.fimTexto) + '. Você pode escrever para treinar, mas o texto fica só com você.</p>') +
        '<div class="acoes"><button class="btn verm" id="entregar" disabled>' + (prazoAberto() ? 'Entregar resposta' : 'Guardar e seguir') + '</button><button class="btn sec" id="pular">Pular esta (sem pontos)</button></div>' +
        '<p class="mini">O texto fica salvo enquanto você escreve, mesmo se fechar o navegador. Lembrete da prova: não basta repetir o verbete; o que vale é usá-lo num objeto concreto.</p>';
    }
    html += '</div><div class="acoes"><button class="btn sec" id="sair">Sair e continuar depois</button></div>';
    app.innerHTML = html;
    document.getElementById("sair").onclick = function () { salvar(); telaRedacao(); };
    if (it.tipo === "diss") ligaDissertativa(it); else ligaEscolha(it);
  }

  function ligaEscolha(it) {
    var bts = app.querySelectorAll(".op");
    bts.forEach(function (b) {
      b.onclick = function () {
        var r = S.rodada, certo = +b.dataset.o === it.c;
        bts.forEach(function (x) { x.disabled = true; if (+x.dataset.o === it.c) x.classList.add("certa"); });
        if (!certo) b.classList.add("errada");
        var pts = 0;
        if (certo) { S.acertos++; S.seq++; S.melhorSeq = Math.max(S.melhorSeq, S.seq); pts = it.pts || 10; if (S.seq >= 3) pts += 5; }
        else { S.erros++; S.seq = 0; }
        ganha(pts, b);
        r.res.push(certo); r.i++; salvar(); desenhaBarra();
        document.getElementById("fb").innerHTML = '<div class="feedback ' + (certo ? 'ok' : 'no') + '"><b class="v">' + (certo ? (S.seq >= 3 ? 'Certo! Sequência de ' + S.seq + '.' : 'Certo!') : 'Não foi dessa vez.') + '</b>' + esc(it.exp) + '</div>' +
          '<div class="acoes"><button class="btn" id="prox">' + (r.i >= r.itens.length ? 'Ver resultado' : 'Próxima') + '</button></div>';
        var p = document.getElementById("prox"); p.focus(); p.onclick = mostraItem;
      };
    });
  }

  function rascunhoKey() { var r = S.rodada; return "rasc:" + r.inicio + ":" + r.i; }
  function ligaDissertativa(it) {
    var ta = document.getElementById("txt"), cont = document.getElementById("cont"), bt = document.getElementById("entregar");
    S.rascunhos = S.rascunhos || {};
    ta.value = S.rascunhos[rascunhoKey()] || "";
    function atualiza() {
      var n = palavras(ta.value);
      cont.textContent = n + " palavra(s)" + (n < MIN_DISS ? " · faltam " + (MIN_DISS - n) + " para entregar" : " · pronto para entregar");
      cont.className = "contador" + (n >= MIN_DISS ? " ok" : "");
      bt.disabled = n < MIN_DISS;
    }
    var tmr;
    ta.addEventListener("input", function () { atualiza(); clearTimeout(tmr); tmr = setTimeout(function () { S.rascunhos[rascunhoKey()] = ta.value; salvar(); }, 500); });
    atualiza();
    bt.onclick = function () {
      var dq = DISS[it.cad][it.d];
      var reg = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), tipo: "dissertativa", cad: it.cad, pergunta: dq.q, texto: ta.value.trim(), data: agora() };
      S.respostas.push(reg); delete S.rascunhos[rascunhoKey()];
      ganha(30, bt);
      enfileira(reg);
      S.rodada.res.push(null); S.rodada.i++; salvar(); desenhaBarra();
      autoavaliacao(dq.g, reg, function () { mostraItem(); });
    };
    document.getElementById("pular").onclick = function () {
      confirma("Pular a resposta escrita? Ela é o treino mais parecido com a prova, e sem ela o caderno não roda.", function () {
        delete S.rascunhos[rascunhoKey()];
        S.rodada.res.push(false); S.rodada.i++; salvar(); mostraItem();
      });
    };
  }

  function autoavaliacao(guia, reg, depois, regua) {
    topo(); telaAtual = "auto";
    var enviada = !reg.fora;
    app.innerHTML = '<div class="cartao"><div class="carimbao">' + (enviada ? 'ENTREGUE' : 'GUARDADA') + '</div><div class="tipo">Confira sua resposta</div>' +
      '<p>' + (enviada ? (CONFIG.envio.acao ? 'Sua resposta entrou na fila e segue sozinha para o professor (se a internet cair, ela tenta de novo).' : 'Sua resposta foi guardada. Mande para o professor pela tela "Minhas respostas".') : 'O prazo de envio já fechou: a resposta ficou só com você.') + ' Agora compare com o que uma boa resposta costuma ter e marque o que você fez:</p>' +
      (regua ? '<div class="regua"><div><b>As duas metades</b>O que preservar E o que reinventar.</div><div><b>Evidência do semestre</b>Capa, reportagem, creator, aula: citada, não aludida.</div><div><b>Uso do caso e dos conceitos</b>O caso sustenta o argumento; o verbete é aplicado, não copiado.</div></div>' : '') +
      '<div class="checklist">' + guia.map(function (g, i) { return '<label><input type="checkbox" data-i="' + i + '"><span>' + esc(g) + '</span></label>'; }).join("") + '</div>' +
      '<details style="margin-top:12px"><summary class="mini" style="cursor:pointer">Ver o que eu escrevi</summary><div class="resp"><div class="t">' + esc(reg.texto) + '</div></div></details>' +
      '<div class="acoes"><button class="btn" id="seg">Seguir</button></div></div>';
    document.getElementById("seg").onclick = function () {
      var marc = 0; app.querySelectorAll(".checklist input").forEach(function (c) { if (c.checked) marc++; });
      reg.auto = marc + "/" + guia.length; salvar(); depois();
    };
  }

  /* ---------------- fim de rodada ---------------- */
  function fimRodada() {
    var r = S.rodada; desenhaBarra(); topo(); telaAtual = "fim";
    var escolhas = r.itens.filter(function (it) { return it.tipo === "esc"; }).length;
    var certos = r.res.filter(function (x) { return x === true; }).length;
    var nota = escolhas ? certos / escolhas * 10 : 0;
    var html = '<div class="placar">';
    var notaHtml = '<div class="mini" style="margin-top:6px">Nota de treino desta rodada: <b style="font-size:20px;color:var(--tinta)">' + fmtNota(nota) + '</b><br>A nota considera só as questões de escolha e será complementada com a análise da sua resposta escrita, que o professor lê e comenta. É só para você saber como foi: não vale nada no semestre.</div>';
    if (r.modo === "caderno") {
      var t = porId[r.cad], s = cadEstado(r.cad);
      var entregou = r.res[r.res.length - 1] === null;
      s.rodadas++; s.melhor = Math.max(s.melhor, nota); s.ultima = agora();
      var rodou = nota >= 5 && entregou, primeira = rodou && !s.rodou;
      if (rodou) s.rodou = true;
      if (primeira) ganha(50);
      html += '<div class="tipo" style="--c:' + t.cor + '">' + esc(t.nome) + '</div><div class="grande">' + certos + '/' + escolhas + '</div>' + notaHtml +
        '<div class="mini">resposta escrita ' + (entregou ? 'entregue' : 'não entregue') + '</div>' +
        (s.rodou ? '<div class="carimbao">' + (primeira ? 'RODOU!' : 'RODOU') + '</div>' : '<div class="carimbao verm">VOLTA PRA PAUTA</div><p>Para o caderno rodar: pelo menos metade das questões de escolha certas e a resposta escrita entregue.</p>') +
        (primeira ? '<p>Crachá <span class="cracha" style="--c:' + t.cor + '">' + t.simbolo + ' ' + esc(t.curto) + '</span> conquistado. +50 XP</p>' : '') +
        '<p class="mini" style="max-width:640px;margin:10px auto"><b>Para a prova, lembre:</b> ' + esc(t.armadilha) + '</p>';
    } else {
      var reg = r.modo === "plantao" ? S.plantao : (r.modo === "relampago" ? S.relampago : S.noticias);
      reg.rodadas++; reg.melhor = Math.max(reg.melhor, nota);
      if (certos === escolhas && escolhas >= 8) ganha(40);
      html += '<div class="tipo" style="--c:var(--ouro)">' + esc(nomeRodada(r)) + '</div><div class="grande">' + certos + '/' + escolhas + '</div>' + notaHtml +
        (certos === escolhas ? '<div class="carimbao">EDIÇÃO SEM ERRO</div>' : (nota >= 6 ? '<div class="carimbao">BOM PLANTÃO</div>' : '<div class="carimbao verm">VOLTE ÀS PAUTAS</div>')) +
        '<p class="mini">Cada rodada sorteia outros casos. Errou? Abra a pauta do caderno do caso e releia a armadilha.</p>';
    }
    html += '</div><div class="acoes" style="justify-content:center"><button class="btn verm" id="denovo">Jogar de novo (novas questões)</button><button class="btn sec" id="red">Voltar à redação</button></div>';
    var modo = r.modo, id = r.cad;
    S.rodada = null; salvar(); desenhaBarra();
    app.innerHTML = html;
    document.getElementById("denovo").onclick = function () {
      if (modo === "caderno") novaCaderno(id); else if (modo === "plantao") novaPlantao(); else if (modo === "relampago") novaRelampago(); else if (NOTICIAS.length >= 3) novaNoticias(); else novaPlantao();
    };
    document.getElementById("red").onclick = telaRedacao;
    if (rodados() >= PARA_PARECER && !S.avisoFech) { S.avisoFech = true; salvar(); setTimeout(function () { toast("Metade da edição rodou: o Fechamento abriu!"); }, 600); }
  }

  /* ---------------- banco de conceitos ---------------- */
  function telaBanco() {
    desenhaBarra(); topo(); telaAtual = "banco";
    var cats = []; BANCO.forEach(function (b) { if (cats.indexOf(b.cat) < 0) cats.push(b.cat); });
    var html = '<div class="dateline" style="margin-top:18px"><span>Banco de conceitos</span><span>' + BANCO.length + ' verbetes</span><span>Como virá na prova: verbetes de uma linha</span></div>' +
      '<div class="manchete" style="font-size:clamp(28px,4vw,40px)">O banco de conceitos</div>' +
      '<p class="linhafina">Na prova, os verbetes vêm impressos no enunciado. Decorar não é o ponto: o que vale é reconhecer a coisa numa página, num título, num caso, e dizer o que ela faz.</p>' +
      '<input class="campo" id="busca" type="search" placeholder="Procure um verbete (ex.: mancha, lide, membership)" style="margin-bottom:10px">' +
      '<div id="lista"></div>' +
      '<h2 class="secao">Linha do tempo</h2><ul class="lista">' + MARCOS.map(function (m) { return '<li><b>' + m.ano + ':</b> ' + esc(m.txt) + '</li>'; }).join("") + '</ul>' +
      '<div class="acoes"><button class="btn verm" id="treino">Treino relâmpago</button><button class="btn sec" id="volta">Voltar à redação</button></div>';
    app.innerHTML = html;
    function pinta(f) {
      f = (f || "").toLowerCase();
      var h = "";
      cats.forEach(function (c) {
        var itens = BANCO.filter(function (b) { return b.cat === c && (!f || (b.t + " " + b.d).toLowerCase().indexOf(f) >= 0); });
        if (!itens.length) return;
        h += '<h3 class="sans" style="margin:18px 0 6px;font-size:15px;letter-spacing:1px;text-transform:uppercase;color:var(--cinza)">' + esc(c) + '</h3><ul class="lista">' +
          itens.map(function (b) { return '<li><b>' + esc(b.t) + ':</b> ' + esc(b.d) + ' <span class="mini">(' + esc(porId[b.cad].curto) + ')</span></li>'; }).join("") + '</ul>';
      });
      document.getElementById("lista").innerHTML = h || '<p class="mini">Nenhum verbete com esse termo.</p>';
    }
    pinta("");
    document.getElementById("busca").addEventListener("input", function (e) { pinta(e.target.value); });
    document.getElementById("treino").onclick = function () { confirmaTroca(novaRelampago); };
    document.getElementById("volta").onclick = telaRedacao;
  }

  /* ---------------- fechamento (parecer) ---------------- */
  function telaFechamentoEscolha() {
    desenhaBarra(); topo(); telaAtual = "fechamento";
    var html = '<div class="dateline" style="margin-top:18px"><span>Fechamento</span><span>Parecer \"preservar ou reinventar\"</span><span>Pareceres entregues: ' + S.pareceres + '</span></div>' +
      '<div class="manchete">Feche a edição</div><p class="linhafina">Escolha um caso e escreva um parecer: o que do DNA do impresso deve ser preservado e o que deve ser reinventado, com evidências do seu semestre. É o formato da Oficina 2 e o treino mais próximo da prova de ' + esc(CONFIG.dataProva) + '.</p>' +
      '<div class="regua"><div><b>As duas metades</b>O que preservar E o que reinventar, com posição clara.</div><div><b>Evidência do semestre</b>Capa analisada, reportagem desmontada, creator, aula de história: citada, não aludida.</div><div><b>O caso e os conceitos</b>O caso é usado, não enfeite; o verbete é aplicado, não copiado.</div></div><div class="grade">';
    PARECERES.forEach(function (p, i) {
      var feito = S.respostas.some(function (r) { return r.tipo === "parecer" && r.pi === i; });
      html += '<button class="mesa" style="--c:' + (p.fonte ? 'var(--vermelho)' : 'var(--cinza)') + '" data-p="' + i + '"><div class="num">' + (p.fonte ? 'Caso real' : 'Situação para treino') + '</div><div class="nome">' + esc(p.titulo) + '</div><div class="st">' + esc(p.fonte || 'Criada para o treino') + '</div>' + (feito ? '<span class="carimbo">ENTREGUE</span>' : '') + '</button>';
    });
    html += '</div><div class="acoes"><button class="btn sec" id="volta">Voltar à redação</button></div>';
    app.innerHTML = html;
    app.querySelectorAll("[data-p]").forEach(function (b) { b.onclick = function () { telaParecer(+b.dataset.p); }; });
    document.getElementById("volta").onclick = telaRedacao;
  }
  function telaParecer(i) {
    var p = PARECERES[i]; desenhaBarra(); topo(); telaAtual = "parecer";
    S.rascunhos = S.rascunhos || {}; var key = "parecer:" + i;
    var cats = []; BANCO.forEach(function (b) { if (cats.indexOf(b.cat) < 0) cats.push(b.cat); });
    app.innerHTML = '<div class="topo-rodada"><div class="tipo">Fechamento · parecer</div><div class="mini">Mínimo de ' + MIN_PARECER + ' palavras</div></div>' +
      '<div class="cartao"><div class="enun" style="font-family:var(--titulo);font-weight:900;font-size:28px;margin-top:0">' + esc(p.titulo) + '</div>' +
      '<div class="recorte"><span class="fonte' + (p.fonte ? ' real' : '') + '">' + (p.fonte ? 'Caso real · ' + esc(p.fonte) : 'Situação criada para o treino') + '</span>' + esc(p.caso) + '</div>' +
      '<div class="enun" style="font-size:19px"><b>Pedido:</b> ' + esc(p.pede) + '</div>' +
      '<details><summary class="mini" style="cursor:pointer">Abrir o banco de conceitos (como virá na prova)</summary>' +
      cats.map(function (c) { return '<p class="mini" style="margin:10px 0 2px"><b>' + esc(c) + '</b></p><ul class="lista" style="font-size:15px">' + BANCO.filter(function (b) { return b.cat === c; }).map(function (b) { return '<li><b>' + esc(b.t) + ':</b> ' + esc(b.d) + '</li>'; }).join("") + '</ul>'; }).join("") + '</details>' +
      '<textarea id="txt" style="min-height:320px" placeholder="Preservar: ...&#10;Reinventar: ...&#10;Evidência do meu semestre: ...&#10;Conclusão: ..."></textarea><div class="contador" id="cont"></div>' +
      (prazoAberto() ? '' : '<p class="mini" style="color:var(--vermelho)">O envio de textos fechou ' + esc(CONFIG.fimTexto) + '. Você pode escrever para treinar, mas o texto fica só com você.</p>') +
      '<div class="acoes"><button class="btn verm" id="entregar" disabled>' + (prazoAberto() ? 'Entregar parecer' : 'Guardar') + '</button><button class="btn sec" id="volta">Voltar (o texto fica salvo)</button></div></div>';
    var ta = document.getElementById("txt"), cont = document.getElementById("cont"), bt = document.getElementById("entregar");
    ta.value = S.rascunhos[key] || "";
    function atualiza() { var n = palavras(ta.value); cont.textContent = n + " palavra(s)" + (n < MIN_PARECER ? " · faltam " + (MIN_PARECER - n) : " · pronto para entregar"); cont.className = "contador" + (n >= MIN_PARECER ? " ok" : ""); bt.disabled = n < MIN_PARECER; }
    var tmr; ta.addEventListener("input", function () { atualiza(); clearTimeout(tmr); tmr = setTimeout(function () { S.rascunhos[key] = ta.value; salvar(); }, 500); });
    atualiza();
    document.getElementById("volta").onclick = function () { S.rascunhos[key] = ta.value; salvar(); telaFechamentoEscolha(); };
    bt.onclick = function () {
      var reg = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5), tipo: "parecer", pi: i, cad: "fechamento", pergunta: p.titulo + (p.fonte ? " (" + p.fonte + ")" : " (situação para treino)") + ". " + p.caso + " PEDIDO: " + p.pede, texto: ta.value.trim(), data: agora() };
      S.respostas.push(reg); S.pareceres++; delete S.rascunhos[key];
      ganha(80, bt); enfileira(reg); salvar(); desenhaBarra();
      autoavaliacao(GUIA_PARECER, reg, telaFechamentoEscolha, true);
    };
  }

  /* ---------------- envio (fila salva no navegador) ---------------- */
  function nomeCad(id) { return id === "fechamento" ? "Fechamento (parecer)" : (porId[id] ? "Caderno " + porId[id].n + ": " + porId[id].nome : id); }
  function enfileira(reg) {
    if (!prazoAberto()) { reg.fora = true; salvar(); return; }
    var nt = notaTreino();
    S.fila = S.fila || [];
    S.fila.push({ id: reg.id, tipo: reg.tipo, cad: reg.cad, pergunta: reg.pergunta, texto: reg.texto, data: reg.data, ok: false, tent: 0,
      dados: { v: VERSAO, xp: S.xp, cadernos: rodados(), notaTreino: nt ? fmtNota(nt.media) : "", acertos: S.acertos, erros: S.erros } });
    salvar(); processaFila();
  }
  var enviando = false;
  function processaFila() {
    var E = CONFIG.envio; if (!S || !E || !E.acao || enviando) return;
    var fila = pendentes(); if (!fila.length) return;
    enviando = true;
    var c = E.campos, i = 0;
    (function proximo() {
      if (i >= fila.length) { enviando = false; salvar(); desenhaBarra(); if (telaAtual === "respostas") telaRespostas(); return; }
      var it = fila[i++], f = new URLSearchParams();
      var d = {}; for (var k in it.dados) d[k] = it.dados[k]; d.entregue = it.data; d.tentativa = it.tent + 1; d.id = it.id;
      f.append(c.email, S.email); f.append(c.nome, S.nome); f.append(c.tipo, it.tipo); f.append(c.caderno, nomeCad(it.cad));
      f.append(c.pergunta, it.pergunta); f.append(c.resposta, it.texto); f.append(c.dados, JSON.stringify(d));
      it.tent++;
      fetch(E.acao, { method: "POST", mode: "no-cors", body: f })
        .then(function () { it.ok = true; it.enviado = agora(); salvar(); proximo(); })
        .catch(function () { salvar(); proximo(); });
    })();
  }
  window.addEventListener("online", function () { processaFila(); });
  setInterval(function () { if (S && pendentes().length) processaFila(); }, 60000);

  function textoCompleto() {
    var l = ["A ROTATIVA · respostas para o professor", "Jornalismo Impresso Diário · turma noturna · PUC-Campinas · 2026/2", "Nome: " + S.nome, "E-mail: " + S.email, "Gerado em: " + dataBR(agora()),
      "Cadernos rodados: " + rodados() + "/" + TOTAL + " · XP: " + S.xp + " · acertos: " + S.acertos + " · erros: " + S.erros, ""];
    S.respostas.forEach(function (r, i) {
      l.push("==== " + (i + 1) + ". " + (r.tipo === "parecer" ? "PARECER" : "RESPOSTA ESCRITA") + " · " + nomeCad(r.cad) + " · " + dataBR(r.data));
      l.push("Pergunta: " + r.pergunta); l.push(""); l.push(r.texto); l.push(""); if (r.auto) l.push("(Autoavaliação: " + r.auto + " itens marcados)"); l.push("");
    });
    return l.join("\n");
  }
  function telaRespostas() {
    desenhaBarra(); topo(); telaAtual = "respostas";
    var n = S.respostas.length, pend = pendentes().length;
    var html = '<div class="dateline" style="margin-top:18px"><span>Minhas respostas</span><span>' + n + ' entregue(s)</span><span>' + esc(S.email) + '</span></div>' +
      '<div class="manchete" style="font-size:clamp(28px,4vw,40px)">Suas respostas</div>' +
      '<p class="linhafina">' + esc(fraseCorrecao()) + ' A devolutiva não vale nota: serve para você chegar à prova sabendo onde acerta e onde erra.</p>';
    if (CONFIG.envio.acao) html += '<div class="aviso" style="border-color:var(--verde);background:#f1faf4"><b style="color:var(--verde)">Envio automático ligado.</b> Cada resposta entra numa fila e segue sozinha para o professor. ' + (pend ? '<b>' + pend + ' resposta(s) ainda na fila</b>: elas tentam de novo quando a internet voltar e a cada minuto com a página aberta. <button class="btn" style="padding:6px 12px;font-size:14px;margin-left:6px" id="reenviar">Tentar agora</button>' : 'Tudo o que você entregou já seguiu.') + ' Os botões abaixo servem de cópia de segurança.</div>';
    else html += '<div class="aviso"><b>Como enviar:</b> clique em "Baixar arquivo" e mande para <b>' + esc(CONFIG.emailProfessor) + '</b>.</div>';
    html += '<div class="acoes"><button class="btn verm" id="baixar"' + (n ? '' : ' disabled') + '>Baixar arquivo</button><button class="btn" id="mail"' + (n ? '' : ' disabled') + '>Abrir e-mail</button><button class="btn sec" id="copiar"' + (n ? '' : ' disabled') + '>Copiar tudo</button></div>';
    html += '<h2 class="secao">Entregues</h2>';
    if (!n) html += '<p>Nenhuma resposta ainda. Cada caderno termina com uma resposta escrita, e o Fechamento pede um parecer.</p>';
    S.respostas.slice().reverse().forEach(function (r) {
      var fi = filaDe(r.id);
      var tag = r.fora ? '<span class="tag">FORA DO PRAZO</span>' : (fi && fi.ok ? '<span class="tag ok">ENVIADA</span>' : (fi ? '<span class="tag">NA FILA</span>' : ''));
      html += '<div class="resp"><div class="meta">' + (r.tipo === "parecer" ? "Parecer" : "Resposta escrita") + ' · ' + esc(nomeCad(r.cad)) + ' · ' + dataBR(r.data) + tag + '</div><div class="q">' + esc(r.pergunta) + '</div><div class="t">' + esc(r.texto) + '</div></div>';
    });
    html += '<div class="acoes"><button class="btn sec" id="volta">Voltar à redação</button></div>';
    app.innerHTML = html;
    document.getElementById("volta").onclick = telaRedacao;
    var rv = document.getElementById("reenviar"); if (rv) rv.onclick = function () { processaFila(); toast("Tentando enviar..."); };
    if (!n) return;
    document.getElementById("baixar").onclick = function () {
      var blob = new Blob([textoCompleto()], { type: "text/plain;charset=utf-8" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = "rotativa-respostas-" + S.email.split("@")[0].replace(/[^\w.-]/g, "") + ".txt";
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      toast("Arquivo baixado.");
    };
    document.getElementById("mail").onclick = function () {
      var corpo = textoCompleto();
      if (corpo.length > 1700) corpo = "Professor, seguem minhas respostas do jogo A Rotativa em arquivo anexo (baixado na tela Minhas respostas).\n\nNome: " + S.nome + "\nE-mail: " + S.email + "\nRespostas: " + n;
      location.href = "mailto:" + CONFIG.emailProfessor + "?subject=" + encodeURIComponent("A Rotativa · respostas · " + S.nome) + "&body=" + encodeURIComponent(corpo);
    };
    document.getElementById("copiar").onclick = function () {
      var t = textoCompleto();
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { toast("Copiado."); }, function () {
        var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); toast("Copiado."); } catch (e) { toast("Não deu para copiar; use Baixar arquivo."); } ta.remove();
      });
    };
  }

  /* ---------------- notícias novas ----------------
     Casos novos chegam por dois caminhos, sem mexer neste arquivo:
     noticias.js (NOTICIAS_LOCAL, no repositório) e o canal do
     professor (CONFIG.appsScript, JSONP do Apps Script, que junta os
     arquivos .json da pasta "A Rotativa · notícias" no Drive).
     Entrada inválida é ignorada. */
  function valido(c) {
    return c && porId[c.cad] && typeof c.txt === "string" && c.txt.length > 20 && typeof c.pergunta === "string" &&
      Array.isArray(c.ops) && c.ops.length >= 2 && c.ops.length <= 5 && c.ops.every(function (o) { return typeof o === "string" && o; }) &&
      typeof (c.c || 0) === "number" && (c.c || 0) < c.ops.length && typeof c.exp === "string";
  }
  function aplicaNoticias(lista) {
    var vistos = {}, out = [];
    NOTICIAS.concat(lista || []).forEach(function (c) {
      if (!valido(c)) return;
      var k = c.id || (c.fonte + "|" + c.pergunta);
      if (vistos[k]) return; vistos[k] = true;
      out.push({ id: k, cad: c.cad, fonte: c.fonte || "", txt: c.txt, pergunta: c.pergunta, ops: c.ops, c: c.c || 0, exp: c.exp, data: c.data || "", novo: true });
    });
    NOTICIAS = out;
    if (telaAtual === "redacao" && S) telaRedacao();
  }
  /* Canal do Apps Script (CONFIG.appsScript): devolve os casos novos e,
     se o config.js não trouxer o bloco envio, o endereço do formulário.
     O envio recebido fica guardado no navegador para a próxima visita. */
  var CHAVE_ENVIO = "rotativa-impresso:envio";
  function jsonp(params, ok) {
    var u = CONFIG.appsScript; if (!u) return;
    var cb = "__rotativa" + Math.random().toString(36).slice(2);
    var s = document.createElement("script");
    function limpa() { try { delete window[cb]; } catch (e) { window[cb] = undefined; } if (s.parentNode) s.parentNode.removeChild(s); }
    window[cb] = function (d) { try { ok(d); } catch (e) {} limpa(); };
    s.onerror = limpa;
    s.src = u + (u.indexOf("?") >= 0 ? "&" : "?") + params + "&callback=" + cb + "&t=" + Date.now();
    document.head.appendChild(s);
  }
  function usaEnvio(e) {
    if (!e || !e.acao || !e.campos || !e.campos.resposta) return false;
    CONFIG.envio = e; return true;
  }
  function carregaRemoto() {
    if (typeof NOTICIAS_LOCAL !== "undefined") aplicaNoticias(NOTICIAS_LOCAL);
    if (!CONFIG.envio || !CONFIG.envio.acao) {
      try { usaEnvio(JSON.parse(localStorage.getItem(CHAVE_ENVIO) || "null")); } catch (e) {}
      jsonp("config=1", function (d) {
        if (d && usaEnvio(d.envio)) {
          try { localStorage.setItem(CHAVE_ENVIO, JSON.stringify(d.envio)); } catch (e) {}
          processaFila();
        }
      });
    }
    jsonp("noticias=1", function (d) { aplicaNoticias(d && d.casos); });
  }

  /* ---------------- início ---------------- */
  carregaRemoto();
  telaCapa();
})();
