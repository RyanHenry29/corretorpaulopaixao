---
name: corretor-paulopaixao-site
description: Site institucional do Corretor Paulo Paixão para o Residencial Maro em Guarulhos/SP
---

# Corretor Paulo Paixão — Site

## Sobre

Landing page institucional do corretor imobiliário **Paulo Paixão** (CRECI-SP), especialista em **Minha Casa Minha Vida**, para o empreendimento **Residencial Maro** em Guarulhos/SP.

- **Site ao vivo:** https://corretorpaulopaixao.lovable.app
- **Instagram:** @consultorpaixaosp
- **WhatsApp:** +55 11 98404-2039
- **Agendamento:** https://agendamento-cpp.vercel.app/schedule/paixao

## Tech Stack

- HTML5 semântico
- CSS3 puro (sem frameworks) com custom properties
- JavaScript vanilla (ES6+)
- Google Fonts: Cormorant Garamond (headings) + Outfit (body)
- Hospedado em Lovable.app

## Design System

### Cores

```css
--gold: #BF9A4A
--gold-light: #D4AF6A
--gold-pale: #F5EDD3
--gold-glow: rgba(191, 154, 74, 0.15)
--dark: #0C0C0B
--dark-2: #141413
--dark-3: #1E1D1B
--dark-4: #272622
--text: #EDE9E1
--text-muted: #8A8680
--text-dim: #5A5752
--green: #1E5C38
--green-light: #2D8050
--white: #F9F7F3
--border: rgba(191, 154, 74, 0.18)
--border-subtle: rgba(255, 255, 255, 0.06)
```

### Tipografia

- **Headings:** `'Cormorant Garamond', serif` — pesos 400, 600, 700
- **Body:** `'Outfit', sans-serif` — pesos 300, 400, 500, 600, 700
- **Eyebrow/Small text:** Outfit, uppercase, tracking largo, cor gold

### Layout

- Site de página única (single page) com scroll suave entre seções
- Grid de 2 colunas no Hero, About, Vantagens, Form
- Grid de 3 colunas em Tipologias e Depoimentos
- Stats strip horizontal entre Hero e About
- Breakpoint mobile: `max-width: 960px`

## Estrutura de Arquivos

```
corretorpaulopaixao/
├── index.html                    ← Landing page (montada via build)
├── src/
│   ├── css/
│   │   └── style.css             ← Design system, componentes, responsive
│   ├── js/
│   │   └── main.js               ← Nav scroll, smooth scroll, observer, form
│   ├── components/
│   │   ├── head.html             ← <head> com meta, fonts, CSS link
│   │   ├── whatsapp-float.html   ← Botão flutuante do WhatsApp
│   │   ├── nav.html              ← Navegação fixa
│   │   ├── hero.html             ← Hero section
│   │   ├── stats.html            ← Stats strip
│   │   ├── about.html            ← Sobre o empreendimento
│   │   ├── tipologias.html       ← Plantas e preços (3 cards)
│   │   ├── vantagens.html        ← Vantagens + MCMV + localização
│   │   ├── depoimentos.html      ← Depoimentos de clientes
│   │   ├── cta-banner.html       ← Banner de CTA
│   │   ├── corretor.html         ← Seção do corretor
│   │   ├── form.html             ← Formulário de agendamento
│   │   └── footer.html           ← Footer + bottom bar
│   ├── data/
│   │   └── site-data.js          ← Dados centralizados (contatos, preços, textos)
│   └── assets/                   ← Imagens locais (placeholders)
├── scripts/
│   └── build.js                  ← Monta index.html a partir dos componentes
├── index1.html                   ← Variação de design (referência)
└── .opencode/skills/
    └── corretor-paulopaixao-site/SKILL.md  ← Esta skill
```

### Como editar

1. Edite os arquivos em `src/components/` para alterar HTML de cada seção
2. Edite `src/css/style.css` para estilos
3. Edite `src/js/main.js` para comportamentos
4. Edite `src/data/site-data.js` para dados centralizados
5. Rode `node scripts/build.js` para regenerar o `index.html`
6. Abra `index.html` no navegador para testar

## Seções do Site

| # | Seção | ID | Conteúdo |
|---|-------|----|----------|
| 1 | Nav | `#nav` | Logo, links, CTA "Agendar Visita" |
| 2 | Hero | `#home` | Título, subtítulo, badges, CTA, price card, imagem de fundo |
| 3 | Stats | — | 4 colunas: dormitórios, área, subsídio, famílias |
| 4 | About | `#empreendimento` | Imagem com badge, descrição, 6 feature cards |
| 5 | Tipologias | `#tipologias` | 3 cards de planta (Studio, 2 Dorms, 2 Dorms+Suíte) |
| 6 | Vantagens | `#vantagens` | 4 vantagens numeradas + card MCMV + localização |
| 7 | Depoimentos | `#depoimentos` | 3 depoimentos em cards com estrelas |
| 8 | CTA Banner | — | Banner de CTA entre seções |
| 9 | Corretor | `#corretor` | Foto placeholder, nome, CRECI, bio, WhatsApp |
| 10 | Form | `#contato` | Formulário de agendamento → WhatsApp |
| 11 | Footer | — | Logo, links, contato |

## Padrões de Componentes

### Botões
- `.btn-primary` — fundo gold, uppercase, tracking, sem border-radius (1px)
- `.btn-secondary` — outline fino, hover gold
- `.whatsapp-btn` — fundo verde #25D366, hover mais escuro
- `.nav-cta` — gold, compacto

### Badges
- `.badge` — border gold sutil, ícone + texto, uppercase small

### Section Header
- `.section-eyebrow` — linha gold + texto uppercase pequeno
- `.section-title` — Cormorant Garamond, branco
- `.section-ornament` — linha gradiente gold de 50px

### Cards
- `.tipo-card` — tipologias, hover sobe 6px
- `.depo-card` — depoimentos com estrelas e avatar
- `.feature-item` — grid 2x2 com ícone
- `.mcmv-card` — fundo verde gradiente, lista de benefícios
- `.vantagem-item` — número + título + descrição

### Formulário
- `.form-wrap` — card com borda gold top
- `.form-group` — label uppercase + input dark
- `.form-submit` — botão full-width gold
- Submit envia dados via WhatsApp URL

## Comportamentos JS

1. **Nav scroll shrink** — reduz padding no scroll
2. **Smooth scroll** — todos `a[href^="#"]` com scrollIntoView
3. **Intersection Observer** — anima cards ao entrar na viewport
4. **Form → WhatsApp** — monta mensagem e abre wa.me

## WhatsApp Integration

Números de telefone:
- **Real:** +55 11 98404-2039
- **Placeholder:** +55 11 99999-9999

Formato do link: `https://wa.me/55XXXXXXXXXXX?text=...`

## Conteúdo Chave

### Residencial Maro
- **Endereço:** Rua Eng. Camilo Olivetti, s/nº - Guarulhos/SP
- **Em frente ao:** Shopping Internacional Guarulhos
- **Próximo:** Metrô Linha 13 Jade, Aeroporto Internacional de Guarulhos
- **Plantas:** Studio 27-30m² (R$180-238k), 2 Dorms 39-48m² (R$220-357k), 2 Dorms+Suíte 46-58m² (R$275-440k)
- **Diferenciais:** Piscina, academia, coworking, segurança 24h, espaço gourmet, pet place, mini mercado

### Minha Casa Minha Vida
- Subsídio de até R$ 55.000
- Taxa de juros a partir de 4,75% a.a.
- Entrada com FGTS (pode ser zero)
- Prazo de até 35 anos
- Renda familiar até R$ 8.000/mês

## Observações de Desenvolvimento

- Manter consistência com o design system gold/dark
- Sempre usar fontes Cormorant Garamond (headings) e Outfit (body)
- Manter animações sutis (fadeUp, opacity, translateY)
- Responsivo com breakpoint em 960px
- Todas as imagens são do Unsplash (placeholders)
- O formulário não tem backend — envia dados por WhatsApp
- OS links de WhatsApp e agendamento abrem em `target="_blank"`
