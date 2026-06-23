/* ===========================================================================
   KRONO — Landing v3 · interações (ref. Active Theory)
   =========================================================================== */
(function () {
  'use strict';

  // ---- CONFIG: número do WhatsApp (TROQUE AQUI) ----
  var WA_NUMERO = '5500000000000';   // país + DDD + número, só dígitos. Ex.: 5511999998888
  var WA_TEXTO  = 'Olá! Quero o diagnóstico gratuito da Krono para a minha transportadora.';
  var WA_URL    = 'https://wa.me/' + WA_NUMERO + '?text=' + encodeURIComponent(WA_TEXTO);
  document.querySelectorAll('a.wa').forEach(function (a) { a.href = WA_URL; a.target = '_blank'; a.rel = 'noopener'; });

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);

  // ---- SMOOTH SCROLL (Lenis, se disponível) ----
  var lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true, smoothTouch: false });
    var lrid;
    (function raf(t) { lenis.raf(t); lrid = requestAnimationFrame(raf); })();
    window.__stopLenis = function () { cancelAnimationFrame(lrid); try { lenis.destroy(); } catch (e) {} };
  }
  // âncoras internas (#) com glide
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(el, { offset: -30 });
      else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  // ---- CURSOR CUSTOM ----
  var cur = document.querySelector('.cursor'), dot = document.querySelector('.cursor-dot');
  if (fine && !reduce && cur && dot) {
    var mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    var craf = null;
    function cloop() {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      cur.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px) translate(-50%,-50%)';
      if (Math.abs(mx - cx) > 0.1 || Math.abs(my - cy) > 0.1) craf = requestAnimationFrame(cloop);
      else craf = null;
    }
    addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      if (!craf) craf = requestAnimationFrame(cloop);
    }, { passive: true });
    document.querySelectorAll('a, button, summary, .btn').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('hovering'); });
    });
  } else if (cur) { cur.style.display = 'none'; if (dot) dot.style.display = 'none'; }

  // ---- REVEAL + LINHAS + CONTADORES ----
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      en.target.querySelectorAll('.count').forEach(startCount);
      if (en.target.classList.contains('count')) startCount(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -7% 0px' });
  document.querySelectorAll('.reveal, .lines, .count').forEach(function (el) { io.observe(el); });

  // stagger nas listas reveladas (steps, faq)
  ['.steps', '.faq'].forEach(function (sel) {
    var c = document.querySelector(sel); if (!c) return;
    [].slice.call(c.children).forEach(function (ch, i) {
      if (ch.classList && ch.classList.contains('reveal')) ch.style.transitionDelay = (i * 0.06) + 's';
    });
  });

  function startCount(el) {
    if (el.dataset.done) return; el.dataset.done = '1';
    var to = parseFloat(el.dataset.to || '0'), suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = fmt(to) + suf; return; }
    var dur = 1200, t0 = null;
    requestAnimationFrame(function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e) + suf;
      if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(to) + suf;
    });
  }
  function fmt(n) { return Math.round(n).toLocaleString('pt-BR'); }

  // ---- NAV compacta + PARALLAX ----
  var nav = document.getElementById('nav');
  var px = [].slice.call(document.querySelectorAll('[data-parallax]'));
  addEventListener('scroll', function () { nav.classList.toggle('small', window.scrollY > 30); }, { passive: true });
  nav.classList.toggle('small', window.scrollY > 30);

  function updateParallax() {
    for (var i = 0; i < px.length; i++) {
      var el = px[i], host = el.parentElement.getBoundingClientRect();
      var center = host.top + host.height / 2 - innerHeight / 2;
      var off = center * parseFloat(el.dataset.parallax) * -1;
      el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0) scale(1.08)';
    }
  }
  if (px.length && !reduce) {
    var pt = false;
    addEventListener('scroll', function () {
      if (!pt) { requestAnimationFrame(function () { updateParallax(); pt = false; }); pt = true; }
    }, { passive: true });
    addEventListener('resize', updateParallax, { passive: true });
    updateParallax();
  }

  // ---- HERO vídeo ----
  var hv = document.getElementById('heroVideo');
  if (hv) {
    if (reduce || saveData) { var s = hv.querySelector('source'); if (s) s.remove(); hv.removeAttribute('autoplay'); hv.load(); }
    else { var p = hv.play(); if (p && p.catch) p.catch(function () {}); }
  }

  // ---- VÍDEO cinematográfico lazy (pátio) ----
  var lv = document.querySelector('video[data-lazy]');
  if (lv && !reduce && !saveData) {
    var lio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var src = document.createElement('source');
        src.src = lv.dataset.lazy; src.type = 'video/mp4';
        lv.appendChild(src); lv.load();
        var pr = lv.play(); if (pr && pr.catch) pr.catch(function () {});
        lio.unobserve(lv);
      });
    }, { rootMargin: '300px' });
    lio.observe(lv);
  }

  // ---- pausar videos fora da tela (perf/bateria) ----
  if (!reduce && !saveData && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { if (en.target.querySelector('source') || en.target.src) { var pr = en.target.play(); if (pr && pr.catch) pr.catch(function () {}); } }
        else { try { en.target.pause(); } catch (e) {} }
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('video').forEach(function (v) { vio.observe(v); });
  }

  // ---- SHADER WebGL no fundo do CTA (nébula dourada, portado do v2) ----
  (function setupShader() {
    var host = document.querySelector('[data-shader]');
    if (!host || reduce) return;
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block';
    var gl;
    try { gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl'); } catch (e) {}
    if (!gl) return;
    host.appendChild(canvas);
    var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var fs = [
      'precision mediump float;',
      'uniform vec2 R;uniform float T;uniform vec3 A;',
      'mat2 m(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}',
      'float map(vec3 p){p.xz*=m(T*0.28);p.xy*=m(T*0.2);vec3 q=p*2.+T;return length(p+vec3(sin(T*0.5)))*log(length(p)+1.0)+sin(q.x+sin(q.z+sin(q.y)))*0.5-1.0;}',
      'void main(){',
      ' vec2 uv=gl_FragCoord.xy/min(R.x,R.y)-vec2(R.x/min(R.x,R.y)*0.5,0.5);',
      ' vec3 col=vec3(0.0);float d=2.5;',
      ' for(int i=0;i<=5;i++){',
      '  vec3 p=vec3(0.,0.,5.)+normalize(vec3(uv,-1.))*d;',
      '  float rz=map(p);',
      '  float f=clamp((rz-map(p+0.1))*0.5,-0.1,1.0);',
      '  vec3 base=vec3(0.03,0.10,0.19)+(A/255.0)*2.9*f;',
      '  col=col*base+smoothstep(2.5,0.0,rz)*0.85*base;',
      '  d+=min(rz,1.0);',
      ' }',
      ' gl_FragColor=vec4(col,1.0);',
      '}'
    ].join('\n');
    var sh = function (t, src) { var s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    var prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog); gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uR = gl.getUniformLocation(prog, 'R'), uT = gl.getUniformLocation(prog, 'T'), uA = gl.getUniformLocation(prog, 'A');
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var resize = function () { var w = host.clientWidth, h = host.clientHeight; canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr); gl.viewport(0, 0, canvas.width, canvas.height); };
    resize(); addEventListener('resize', resize, { passive: true });
    var vis = true;
    if ('IntersectionObserver' in window) { new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(host); }
    var GOLD = [200, 146, 63], t0 = performance.now(), FRAME = 1000 / 30, last = -Infinity, rid;
    var draw = function (now) {
      if (vis && now - last >= FRAME) {
        last = now;
        gl.uniform2f(uR, canvas.width, canvas.height);
        gl.uniform1f(uT, (now - t0) / 1000);
        gl.uniform3f(uA, GOLD[0], GOLD[1], GOLD[2]);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      rid = requestAnimationFrame(draw);
    };
    rid = requestAnimationFrame(draw);
    window.__stopShader = function () { cancelAnimationFrame(rid); };
  })();

  // ---- QUIZ persuasivo (micro-compromissos → WhatsApp com as respostas) ----
  (function setupQuiz() {
    var quiz = document.getElementById('quiz'); if (!quiz) return;
    var steps = [].slice.call(quiz.querySelectorAll('.q-step'));
    var bar = document.getElementById('quizBar'), count = document.getElementById('quizCount');
    var answers = {}, idx = 0;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    function show(i, doFocus) {
      steps.forEach(function (s, k) { s.classList.toggle('on', k === i); });
      idx = i;
      bar.style.width = Math.round(((i + 1) / steps.length) * 100) + '%';
      count.textContent = pad(i + 1) + ' / ' + pad(steps.length);
      if (i === steps.length - 1) renderAffirm();
      if (doFocus) {  // so move o foco em troca de passo iniciada pelo usuario, nunca no load
        var target = i === steps.length - 1 ? document.getElementById('qNome') : steps[i].querySelector('.opt');
        if (target) setTimeout(function () { try { target.focus(); } catch (e) {} }, 360);
      }
    }
    quiz.querySelectorAll('.opt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        answers[opt.dataset.q] = opt.dataset.v;
        opt.parentElement.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('sel'); });
        opt.classList.add('sel');
        setTimeout(function () { if (idx < steps.length - 1) show(idx + 1, true); }, 190);
      });
    });
    quiz.querySelectorAll('[data-back]').forEach(function (b) {
      b.addEventListener('click', function () { if (idx > 0) show(idx - 1, true); });
    });
    function renderAffirm() {
      var a = document.getElementById('quizAffirm'); if (!a) return;
      var g = answers.gargalo, msg;
      if (g === 'a cotação lenta') msg = 'Faz sentido. Com a KRONO a proposta sai antes do concorrente responder.';
      else if (g === 'a margem que aparece tarde') msg = 'A margem passa a aparecer antes de você dar o preço. Nada fecha no vermelho.';
      else if (g === 'o follow-up parado') msg = 'O follow-up corre sozinho. Proposta não esfria mais na caixa de entrada.';
      else if (g === 'tudo na mão, no Excel') msg = 'A conta sai do Excel e vira proposta em segundos.';
      else msg = 'Boa. Já dá pra ver onde recuperar tempo e margem.';
      a.innerHTML = '<svg width="15" viewBox="0 0 24 24" fill="none" stroke="#E1AA4D" stroke-width="2.5" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><span>' + msg + '</span>';
    }
    var send = document.getElementById('quizSend');
    var qNome = document.getElementById('qNome'), qEmpresa = document.getElementById('qEmpresa');
    var qErr = document.getElementById('quizErr'), qDone = document.getElementById('quizDone');
    function valido() { return qNome.value.trim().length >= 2 && qEmpresa.value.trim().length >= 2; }
    function syncBtn() { if (send) { var ok = valido(); send.classList.toggle('off', !ok); send.setAttribute('aria-disabled', ok ? 'false' : 'true'); } }
    [qNome, qEmpresa].forEach(function (inp) {
      if (inp) inp.addEventListener('input', function () { syncBtn(); if (qErr) qErr.hidden = true; });
    });
    syncBtn();
    if (send) send.addEventListener('click', function (e) {
      e.preventDefault();
      if (!valido()) {
        if (qErr) qErr.hidden = false;
        (qNome.value.trim().length < 2 ? qNome : qEmpresa).focus();
        return;
      }
      if (qErr) qErr.hidden = true;
      var nome = qNome.value.trim(), emp = qEmpresa.value.trim();
      var txt = 'Oi! Aqui é ' + nome + ' da ' + emp + '. Quero o diagnóstico gratuito da Krono.';
      if (answers.volume) txt += ' A gente faz ' + answers.volume + '.';
      if (answers.gargalo) txt += ' O que mais trava aqui hoje é ' + answers.gargalo + '.';
      var url = 'https://wa.me/' + WA_NUMERO + '?text=' + encodeURIComponent(txt);
      // analytics — no-op se GTM/GA4/Meta nao estiverem configurados
      try { window.dataLayer = window.dataLayer || []; window.dataLayer.push({ event: 'generate_lead', method: 'quiz_whatsapp', volume: answers.volume || '', gargalo: answers.gargalo || '' }); } catch (e2) {}
      try { if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { method: 'quiz_whatsapp' }); } catch (e3) {}
      try { if (typeof window.fbq === 'function') window.fbq('track', 'Lead'); } catch (e4) {}
      // estado de sucesso (via classe .done, sem inline style — reversivel)
      if (qDone) {
        var link = document.getElementById('quizWaLink'); if (link) link.href = url;
        var h = qDone.querySelector('h3'); if (h) h.textContent = 'Pronto, ' + nome + '!';
        quiz.classList.add('done');
        qDone.hidden = false;
      }
      window.open(url, '_blank', 'noopener');  // se o pop-up for bloqueado, o estado de sucesso mostra o link manual (#quizWaLink)
    });
    show(0);
  })();

  // ---- CTA flutuante (aparece apos o hero, some quando o form entra) ----
  (function floatCta() {
    var fc = document.getElementById('ctaFloat'); if (!fc) return;
    var hero = document.getElementById('topo'), form = document.getElementById('form');
    var pastHero = false, atForm = false;
    function upd() {
      var on = pastHero && !atForm;
      fc.classList.toggle('show', on);
      fc.setAttribute('aria-hidden', on ? 'false' : 'true');
      fc.tabIndex = on ? 0 : -1;
    }
    if (hero) new IntersectionObserver(function (es) { pastHero = !es[0].isIntersecting; upd(); }, { threshold: 0 }).observe(hero);
    if (form) new IntersectionObserver(function (es) { atForm = es[0].isIntersecting; upd(); }, { threshold: 0.05 }).observe(form);
  })();

  // ---- Card DRE do hero: encena o calculo (linhas em stagger + tag + margem) ----
  (function dreAnim() {
    var card = document.querySelector('.dre-card'); if (!card) return;
    if (getComputedStyle(card).display === 'none') return;  // card e desktop-only; evita observer ocioso no mobile
    var tag = card.querySelector('.tag'), mv = card.querySelector('.margin .v');
    if (!tag) return;
    var DOT = '<span class="d"></span> ';
    if (reduce) return;  // o HTML ja traz o estado final (8s, 16%); sem animacao, mostra ele
    var ran = false;
    new IntersectionObserver(function (es, obs) {
      if (!es[0].isIntersecting || ran) return; ran = true; obs.disconnect();
      card.classList.add('staged');
      tag.classList.add('calc'); tag.innerHTML = DOT + 'Calculando…';
      if (mv) mv.textContent = '0%';
      requestAnimationFrame(function () { card.classList.add('run'); });
      setTimeout(function () {
        tag.classList.remove('calc'); tag.innerHTML = DOT + 'Proposta gerada · 8s';
        var t0 = null;
        requestAnimationFrame(function step(ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / 700, 1), e = 1 - Math.pow(1 - p, 3);
          if (mv) mv.textContent = Math.round(16 * e) + '%';
          if (p < 1) requestAnimationFrame(step); else if (mv) mv.textContent = '16%';
        });
      }, 1150);
    }, { threshold: 0.3 }).observe(card);
  })();

  // ---- Chat de IA: encena a conversa (bolhas em sequencia + digitando) ----
  (function chatAnim() {
    var chat = document.querySelector('.chat'); if (!chat) return;
    var bubbles = [].slice.call(chat.querySelectorAll('.bubble'));
    var typing = chat.querySelector('.typing');
    if (reduce || !bubbles.length) { bubbles.forEach(function (b) { b.classList.add('show'); }); return; }
    chat.classList.add('seq');
    var ran = false;
    new IntersectionObserver(function (es, obs) {
      if (!es[0].isIntersecting || ran) return; ran = true; obs.disconnect();
      var steps = [
        function () { bubbles[0].classList.add('show'); after(850); },
        function () { if (typing) typing.classList.add('on'); after(1200); },
        function () { if (typing) typing.classList.remove('on'); if (bubbles[1]) bubbles[1].classList.add('show'); after(1000); },
        function () { if (typing) typing.classList.add('on'); after(1200); },
        function () { if (typing) typing.classList.remove('on'); if (bubbles[2]) bubbles[2].classList.add('show'); }
      ];
      var i = 0;
      function after(d) { i++; if (steps[i]) setTimeout(steps[i], d); }
      steps[0]();
    }, { threshold: 0.4 }).observe(chat);
  })();
})();
