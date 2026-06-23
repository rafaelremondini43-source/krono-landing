# KRONO — Landing Page (v3.1 · editorial-cinematográfica)

Landing de venda da **KRONO** (automações para transportadoras). Quase-preto, dourado como
único acento, tipografia **editorial (Fraunces + Hanken Grotesk)**, cenas full-bleed, scroll
inercial, cursor custom, **vídeo Veo a partir das fotos reais**, **shader WebGL** no CTA e um
**quiz persuasivo** (3 passos) que leva pro WhatsApp com a resposta do lead.

## ⚠️ Único passo obrigatório: número do WhatsApp

Em `js/main.js`, troque o número (o quiz e o rodapé usam a mesma constante):

```js
var WA_NUMERO = '5500000000000';   // país + DDD + número, só dígitos. Ex.: 5511999998888
```

Os CTAs internos levam ao **quiz** (`#form`); o quiz e o link do rodapé abrem o WhatsApp já
com uma mensagem personalizada (nome, transportadora, volume e gargalo escolhidos).

## GEO / SEO

Plano completo em **`GEO-SEO-PLAN.md`**. Já implementado: JSON-LD (Organization +
SoftwareApplication + FAQPage), `robots.txt` (libera crawlers de IA), `sitemap.xml`,
`llms.txt`, title/meta/canonical/OG. Ao subir o domínio real, troque `https://krono.com.br/`
e registre no Google Search Console (passos no plano).

## Como abrir / publicar

- **Local:** abra `index.html` (ou sirva a pasta por um servidor estático).
- **Publicar:** suba a pasta inteira em Netlify / Vercel / Cloudflare Pages / GitHub Pages.

## Estrutura

```
index.html        nav · hero · parceiros · Excel×Krono · 4 passos · DRE · prova · banner · IA · FAQ · CTA · rodapé
css/styles.css    design system (quase-preto + dourado, Fraunces/Hanken Grotesk/Plex Mono) + shader + quiz
js/lenis.min.js   scroll inercial (vendorizado)
js/main.js        Lenis · cursor · reveals · parallax · contadores · shader WebGL · quiz · WhatsApp
robots.txt · sitemap.xml · llms.txt · GEO-SEO-PLAN.md   (GEO/SEO)
assets/img/       fotos reais (hero-truck, depot-dusk, owner-portrait) · logos (krono + parceiros) · og
assets/video/     hero-truck.mp4 · depot-dusk.mp4  (Veo, image-to-video das fotos reais)
```

## Movimento / cinematográfico

- **Hero:** vídeo do **caminhão** (Veo, a partir de `hero-truck.png`) full-bleed. Fallback: poster da foto.
- **Banner do meio:** vídeo do **pátio ao entardecer** (Veo, a partir de `depot-dusk.png`), lazy-load.
- **Scroll inercial** (Lenis), **cursor custom**, **reveals com clip-path** linha-a-linha, **parallax** das mídias,
  contadores nos stats, marquee dos parceiros.
- **Acessibilidade:** tudo respeita `prefers-reduced-motion` (desliga vídeo/scroll/cursor, mostra posters).

## Como os vídeos foram gerados (Veo image-to-video)

`C:\Users\Rafa\.claude\scripts\Generate-GeminiVideo.ps1` agora aceita `-Image` (anima uma foto):

```powershell
& "C:\Users\Rafa\.claude\scripts\Generate-GeminiVideo.ps1" `
  -Image "C:\Users\Rafa\krono-landing\assets\_veo_in\truck.jpg" `
  -Out   "C:\Users\Rafa\krono-landing\assets\video\hero-truck.mp4" `
  -Prompt "the truck drives forward, mist drifting, camera pushes in, cinematic" `
  -Model "veo-3.0-fast-generate-001"
```

> Dica: redimensione a foto para ~1280px (JPEG) antes — entradas grandes podem dar 400.

## Conteúdo / posicionamento

Base: a iteração `KRONO Landing v2` (a mais rica). Posicionamento: **automações para
transportadoras — começou no frete**. Prova real: nascida dentro da **WPC Logistics**,
depoimento de **Higor Vilela (CEO)**, stats 0s / 100% / 0, parceiros (OpenAI, Anthropic,
Microsoft, Stripe, Google Cloud, ESL, SAP B1, WPC, FGV, Insper, DRC).
Legal: Astroads AI LTDA · CNPJ 63.324.757/0001-50.

## Pendências sugeridas

- Definir o número real do WhatsApp.
- (Opcional) confirmar números/depoimento antes de rodar tráfego pago.
