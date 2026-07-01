# AGENTS.md — KRONO landing page

Instruções para agentes de IA (Codex, etc.) que forem trabalhar neste repositório.
Leia isto antes de editar qualquer coisa.

## O que é
Landing page de venda da **KRONO** — plataforma de automações para transportadoras
rodoviárias de carga (carro-chefe: cotação/precificação de frete no automático: DRE,
margem e risco). Público: diretor/comercial de transportadora (B2B). CTA único =
**quiz de 3 passos → WhatsApp**. Nasceu dentro da WPC Logistics.

## Stack (NÃO adicionar build/framework)
- **Site 100% estático, sem build.** HTML + CSS + JS vanilla. Sem React/Vue/Tailwind/npm.
- **Zero CDN de JS.** Única dependência externa: Google Fonts (link no `<head>`). Lenis é
  **vendorizado** em `js/lenis.min.js`.
- Deploy: **GitHub Pages** (branch `main`, raiz). Todo push em `main` republica em ~1 min.
- Para pré-visualizar: basta abrir `index.html` no navegador (funciona via `file://`), ou
  servir a pasta com qualquer servidor estático.

## Estrutura
```
index.html        markup + JSON-LD (SEO/GEO) + meta/OG
css/styles.css    todo o CSS (design system + seções + motion + media queries)
js/lenis.min.js   scroll inercial (vendorizado — não editar)
js/main.js        Lenis, cursor custom, reveals (IntersectionObserver), parallax,
                  contadores, shader WebGL do CTA, quiz, animações do card DRE e do chat
assets/img/       fotos reais (hero-truck-poster, banner-road-poster, owner-portrait),
                  logos de parceiros (logo-*.png), texturas (nebula-texture, excel-caos),
                  favicon.png (símbolo do anel), krono-logo.png (wordmark), og_image.jpg
assets/video/     hero-truck.mp4, banner-road.mp4 (gerados por Veo)
robots.txt · sitemap.xml · llms.txt   (GEO/SEO — servidos na raiz)
```

## Design system (siga à risca)
Tokens em `:root` no topo de `css/styles.css`:
- **Cores:** fundo quase-preto `--bg:#06090F`; superfícies `--surface`/`--surface-2`;
  texto creme `--ink:#ECE5D4`, `--muted`, `--faint:#7E8696`; **dourado é o ÚNICO acento**
  (`--gold:#C8923F`, `--gold-bright:#E1AA4D`, `--gold-soft:#EBC57E`); apoio `--terra`, `--green`.
  Nunca usar branco puro (`#fff`) — use `--ink`.
- **Fontes:** `--font-display` = **Fraunces** (serif editorial, títulos, caixa normal — NÃO
  tudo-maiúsculo); `--font-body` = **Hanken Grotesk**; `--font-mono` = **IBM Plex Mono**
  (rótulos/números). Rótulos/kickers são mono maiúsculo pequeno.
- **⚠️ Fraunces — trava obrigatória:** todo elemento em Fraunces PRECISA de
  `font-variation-settings:"SOFT" 0,"WONK" 0; font-feature-settings:"liga" 1,"calt" 1,"dlig" 0;`
  senão o "f"/"g" saem com a cauda torta (bug conhecido). Já está aplicado em h1,h2,h3, .quote,
  .step .n, .qa summary — replicar em qualquer novo elemento display.
- **Estética:** cinematográfica dark, full-bleed, muito respiro, motion estrutural (guia o olho),
  disciplina de dourado. Referência: Active Theory.

## Convenções
- **Acessibilidade:** tudo respeita `@media (prefers-reduced-motion: reduce)`; `focus-visible`
  dourado; `<main id="conteudo">` + skip-link; `aria-hidden` só em decoração.
- **Responsivo:** mobile-first-friendly. Card DRE tem 2 versões: `.dre-card` (desktop,
  `position:absolute`, escondido ≤960px) e `.dre-inline` (mobile, `display:none` >960px). Se
  mudar os números do DRE, mude nos DOIS + no chat + no `main.js` (função `dreAnim`). A conta
  precisa fechar: Receita 3.728 − Custo 2.840 − Risco 278 = **Margem 610 (16%)**.
- **Vídeos:** `<video autoplay muted loop playsinline>`, poster JPEG leve, `preload="none"` +
  lazy para os de baixo da dobra; pausam fora da tela; respeitam `saveData`.
- **Perf:** imagens em JPEG/PNG otimizados (~<150KB posters). Sem `feTurbulence` full-screen
  (foi removido por custo de render). Cuidado com `backdrop-filter` (sempre com `-webkit-`).
- **Copy:** PT-BR coloquial ("pro/pra"), objetiva, pouca cara de template. Evitar travessões
  em excesso e tríades. Não inventar números/depoimentos.

## Estado atual
Blocos A, B e C do plano de melhoria já implementados e verificados. A varredura de 10 lentes
foi feita: as fissuras de severidade `quebra` e `visível` foram corrigidas (WONK do Fraunces,
bug do `window.open` duplo, matemática do DRE, contraste AA, Safari/backdrop, aria-hidden,
anti-travamento do card, etc.).

## Pendências conhecidas
1. **BLOQUEANTE — número do WhatsApp:** em `js/main.js`, `WA_NUMERO` ainda é o placeholder
   `5500000000000`. Todo o funil do quiz depende disso. Trocar antes de rodar tráfego.
2. **Nits cosméticos restantes da varredura** (nenhum quebra nada): CSS morto (`.ptracks`,
   `.btn.ghost`, filtro do retrato duplicado, `.partners` com padding duplo); unificar os ~8
   breakpoints em 3 tokens; `stroke-width` dos ícones de check (2/2.4/3 → um valor); escala de
   `border-radius` em tokens; chat de IA aparece vazio antes da sequência; loop do shader ocioso
   fora da tela; quebras de linha `.lines` rígidas em larguras intermediárias.

## Regras de convivência (trabalho em paralelo)
- **`git pull` antes de editar** e antes de `git push` (evita conflito com o outro agente).
- Mudanças grandes/experimentais: usar branch (`git checkout -b feat/...`) e abrir PR, não
  commitar direto em `main`.
- Não reintroduzir dependências de build/CDN. Não trocar a paleta nem as fontes sem pedir.
- Não versionar segredos. `GEO-SEO-PLAN.md` e `LP-IMPROVEMENT-PLAN.md` estão no `.gitignore`
  (docs internos) — o plano de melhoria e a varredura de nits estão resumidos acima.
