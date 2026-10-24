<a href="https://diek.nl"><picture><source media="(prefers-color-scheme: dark)" srcset="docs/diek-logo-white.svg"><img src="docs/diek-logo.svg" alt="DIEK" width="92" height="30"></picture></a>

# Vier checkout-blokken voor Shopify, zonder apps

[![Licentie: MIT](https://img.shields.io/badge/licentie-MIT-2ea44f)](LICENSE) [![Checkout UI Extensions 2026-07](https://img.shields.io/badge/Checkout_UI_Extensions-2026--07-5c6ac4)](https://shopify.dev/docs/api/checkout-ui-extensions) [![Geen backend](https://img.shields.io/badge/backend-geen-lightgrey)](#voor-developers) [![English](https://img.shields.io/badge/English-summary_below-blue)](#english-summary)

Gemaakt door [DIEK](https://diek.nl), full-stack Shopify (Plus) development uit Nijmegen. Gratis en open source, doe ermee wat je wilt.

USP's, een upsell, een gratis-verzending-balk en klantreviews. Je sleept ze in de checkout-editor, typt je teksten in en klaar. Geen abonnement, geen server, geen script in je thema.

**Inhoud:** [Wat is dit?](#wat-is-dit) · [Wat heb je nodig?](#wat-heb-je-nodig) · [Installeren](#installeren-in-vijf-stappen) · [Instellingen per blok](#de-instellingen-per-blok) · [Ik zie een blok niet](#ik-zie-een-blok-niet-wat-nu) · [Wat dit bewust niet doet](#wat-dit-bewust-niet-doet) · [Voor developers](#voor-developers) · [Over DIEK](#over-diek)

## Wat is dit?

Vier blokken die je in de Shopify checkout-editor sleept en daar invult. Verwijder de app en je checkout is weer precies zoals hij was.

| Blok | Wat het doet | Waar | Plan |
|---|---|---|---|
| **USP's** | Tot vijf zekerheden met een vinkje: "Gratis retourneren", "Morgen in huis" | Checkout en bedankpagina | Checkout: Plus. Bedankpagina: elk plan |
| **Upsell (Search & Discovery)** | Toont de complementaire producten die je al in Shopify's gratis Search & Discovery-app hebt ingesteld. Eén klik en het ligt erbij | Checkout en bedankpagina | Checkout: Plus. Bedankpagina: elk plan (met link) |
| **Gratis-verzending-balk** | "Nog €12,50 tot gratis verzending" met voortgangsbalk, rekent live mee met de cart | Checkout | Plus |
| **Klantreviews** | Tot drie reviews met sterren, draaien automatisch door | Checkout en bedankpagina | Checkout: Plus. Bedankpagina: elk plan |

Hier bestaan losse apps voor. Bij elkaar kosten die al snel een paar honderd euro per maand, ze laden extra scripts en bewaren jouw teksten op hun servers. Deze vier doen hetzelfde met wat Shopify al in huis heeft. Je typt je teksten in de checkout-editor, net als bij de rest van je checkout.

## Wat heb je nodig?

- Een Shopify-shop.
- Voor blokken **in de checkout** (bij het adres en de betaling): **Shopify Plus**. Dat is een regel van Shopify en geldt voor elke app die daar iets wil tonen.
- Voor blokken **op de bedankpagina**: elk plan vanaf Basic. USP's, Klantreviews en de Upsell werken daar.
- Iemand die één keer vijf minuten de installatie doet (zie hieronder). Daarna beheer je alles in de checkout-editor, zonder developer.

## Installeren in vijf stappen

Je hebt een computer nodig met [Node.js](https://nodejs.org) (versie 20 of nieuwer) en de [Shopify CLI](https://shopify.dev/docs/apps/build/cli-for-apps). Geen ervaring met de terminal? Laat een AI-agent het doen (zie hieronder), stuur dit aan je developer, of mail ons (onderaan).

**Liever een AI-agent laten installeren?** Open een terminal met [Claude Code](https://claude.com/claude-code) of [Codex](https://openai.com/codex) en plak dit:

```text
Clone https://github.com/Diek-nl/shopify-native-checkout-kit.git en installeer deze
Shopify-app op mijn shop. Volg README.md en AGENTS.md. Doe het terminalwerk zelf
(npm install, config:link, deploy), laat mij inloggen als dat nodig is, en geef me
daarna de klikstappen voor het Partner Dashboard en de checkout-editor.
```

De agent doet stap 1 tot en met 4. Stap 4b (de installatielink) en stap 5 (de blokken slepen en invullen) doe je zelf in de browser, de agent zegt je precies waar je moet klikken.

**1. Haal de code binnen**

```bash
git clone https://github.com/Diek-nl/shopify-native-checkout-kit.git
cd shopify-native-checkout-kit
npm install
```

**2. Koppel het aan je shop**

```bash
npm run config:link
```

Je wordt gevraagd om in te loggen bij Shopify, je organisatie te kiezen en een naam te geven. Kies "Create this project as a new app". Dit maakt een app aan in jouw eigen Shopify-account (het Dev Dashboard); hij komt niet in de App Store en niemand anders kan hem zien.

**3. Test hem eerst**

```bash
npm run dev
```

Kies je shop. Er opent een voorbeeldlink. Laat dit venster open staan zolang je test.

**4. Zet hem op de shop**

```bash
npm run deploy
```

Bevestig met ja. De code staat nu bij Shopify, maar nog niet op je shop. Daarvoor koppel je de app één keer als **aangepaste distributie** (custom distribution) aan je shop:

1. Ga naar je [Partner Dashboard](https://partners.shopify.com) (of het [Dev Dashboard](https://dev.shopify.com/dashboard), als je app daar staat) en open de app met de naam die je in stap 2 koos.
2. Klik links op **Distributie**, kies **Aangepaste distributie** en klik op **Selecteren**.
3. Vul het adres van je shop in (`jouwshop.myshopify.com`) en klik op **Link genereren**.
4. Open die link en klik op **Installeren**.

Wil je een icoon voor de app, zodat je de blokken in de checkout-editor meteen herkent? Upload dan `docs/app-icon.png` op dezelfde app-pagina onder **Instellingen → App-icoon** (1200 × 1200, staat klaar in deze repo). Of zet er je eigen logo neer, het is jouw app.

"Aangepaste distributie" is Shopify's naam voor een app die voor één shop is (of voor de shops binnen één Plus-organisatie). Je kunt die keuze later niet meer omzetten naar de App Store, maar dat is hier ook niet de bedoeling. Test je op een development store, dan kun je stap 1 tot en met 4 overslaan en op de app-pagina direct op **Install app** klikken.

**5. Zet de blokken op hun plek**

In je Shopify-admin: **Instellingen → Checkout → Aanpassen**. Klik links op **App-blok toevoegen** en kies een van de vier blokken (met de D van DIEK ervoor). Sleep hem waar je hem wilt en vul rechts de instellingen in. Doe hetzelfde op het tabblad **Bedankt** voor de bedankpagina. Klik op **Opslaan**.

Je hoeft niet alle vier te gebruiken. Een blok dat je niet sleept, doet niets.

## De instellingen per blok

Klik in de checkout-editor op een blok. Rechts zie je:

**USP's**

| Instelling | Standaard | Wat het doet |
|---|---|---|
| Kop | leeg | Een grijs regeltje boven de lijst, bijvoorbeeld "Waarom klanten bij ons bestellen" |
| Regel 1 tot 5 | leeg | Eén zekerheid per regel. Lege regels worden overgeslagen |
| Icoon | check | Het vinkje. Ook mogelijk: check-circle-filled, delivery, lock, return, star-filled |

**Upsell (Search & Discovery)**

| Instelling | Standaard | Wat het doet |
|---|---|---|
| Kop boven de kaart | Vaak samen gekocht | Het grijze regeltje boven het product |
| Knoptekst | Toevoegen | De tekst op de knop (alleen in de checkout) |
| Ook producten met meerdere varianten | uit | Een product met maten kun je in de checkout niet toevoegen, de klant kan daar geen maat kiezen. Aan = de eerste variant wordt toegevoegd. Op de bedankpagina speelt dit niet, daar gaat de klant via een link naar het product |
| Maximaal aantal aanbiedingen | 1 | 1 tot 3 kaarten. Eén werkt meestal het best |

De aanbevelingen zelf stel je in bij Products → open een product → Search & Discovery → Complementaire producten. Veel shops hebben dat al gedaan voor de productpagina.

**Gratis-verzending-balk**

| Instelling | Standaard | Wat het doet |
|---|---|---|
| Drempel | leeg | Hetzelfde bedrag als in Instellingen → Verzending. Zonder drempel toont de balk niets |
| Tekst onder de drempel | Nog {bedrag} tot gratis verzending | `{bedrag}` wordt het resterende bedrag |
| Tekst bij de drempel | Je ontvangt gratis verzending | |
| Verberg zodra gehaald | uit | Aan = de balk verdwijnt boven de drempel |

Tot de klant een verzendoptie kiest, rekent de balk met het subtotaal vóór verzending en belasting, net als Shopify's eigen verzendvoorwaarde. Daarna is de kassa de waarheid: rekent Shopify €0 (ook door een kortingscode voor gratis verzending), dan zegt de balk "gratis". Rekent Shopify wél verzendkosten, bijvoorbeeld omdat een kortingscode het totaal onder de drempel duwde, dan zegt de balk dat ook.

**Klantreviews**

| Instelling | Standaard | Wat het doet |
|---|---|---|
| Kop | Beoordeeld door onze klanten | |
| Label achter de naam | geverifieerde koper | Leeg = geen label |
| Review 1 tot 3: quote, naam, sterren | leeg, leeg, 5 | Een review zonder quote of naam wordt overgeslagen |

Eén review tegelijk, draait elke 6 seconden door. Klikt de klant op een pijltje, dan stopt het draaien.

## Ik zie een blok niet, wat nu?

- **Heb je het blok gesleept én opgeslagen** in de checkout-editor? Blokken zonder ingevulde inhoud tonen niets, zodat er nooit een leeg kader in je checkout staat.
- **Sta je in de checkout-stappen zonder Shopify Plus?** Daar kan het niet. Gebruik dan de bedankpagina.
- **Upsell: heeft het product in je mandje complementaire producten?** Zonder ingevulde lijst in Search & Discovery toont het blok niets. Ligt het aanbevolen product al in het mandje, is het uitverkocht, of heeft het meerdere varianten (zie instelling), dan wordt het overgeslagen.
- **Upsell: reken je af met Apple Pay of Google Pay?** Dan mag de winkelwagen niet meer veranderen en verbergt het blok zichzelf.
- **Verzendbalk: staat er een drempel ingevuld?** Zonder drempel geen balk.

## Wat dit bewust niet doet

- **Geen koppeling met een reviewplatform.** Je kiest zelf drie reviews en typt ze over. Dat is ook precies waarom het zonder abonnement kan.
- **Geen staffelkorting of automatische gratis verzending.** De balk toont alleen. De korting zelf zit in Instellingen → Verzending of Kortingen, waar hij hoort.
- **Geen "one-click" aanbieding ná het betalen.** Dat scherm werkt op Shopify niet bij iDEAL, Klarna, PayPal en de meeste andere betaalmethoden in Nederland.
- **Geen slimme AI.** De blokken tonen wat jij invult, in de volgorde die jij koos.

## Wat kost het?

Niets. Geen abonnement, geen kosten per order. De code is van jou zodra je hem hebt gedownload (MIT-licentie).

---

## Voor developers

Extension-only app, geen backend, geen scopes, geen metaobjects. Vier Checkout UI Extensions (Preact + Polaris web components `s-*`, API 2026-07). Alle inhoud komt uit `shopify.settings` (de instellingen in de checkout-editor); alleen de upsell doet een Storefront-query (`productRecommendations(intent: COMPLEMENTARY)`, `api_access = true`).

```
shopify.app.toml                       app-config (template; config:link vult client_id)
extensions/
  checkout-usps/src/UspsBlock.tsx                 checkout + thank-you
  checkout-upsell/src/                            checkout (knop) + thank-you (link)
    recommendations.ts · OfferCard.tsx · CheckoutUpsell.tsx · ThankYouUpsell.tsx
  checkout-shipping-bar/src/ShippingBar.tsx       checkout; leest cost.subtotalAmount en cost.totalShippingAmount als signals
  checkout-testimonials/src/TestimonialsBlock.tsx checkout + thank-you
```

`AGENTS.md` (en `CLAUDE.md`, die ernaar wijst) vertelt een AI-agent hoe hij installeert en wat hij niet mag aanraken. `npm run typecheck` draait `tsc` over alle extensies. De app is bedoeld als custom-distribution-app; `shopify.app.toml` is een template zonder `client_id`, `config:link` maakt een `shopify.app.<naam>.toml` aan die in `.gitignore` staat. Wil je maar een deel van de blokken, verwijder dan de andere mappen uit `extensions/` vóór de deploy.

De upsell staat ook los op [github.com/Diek-nl/shopify-native-checkout-upsell](https://github.com/Diek-nl/shopify-native-checkout-upsell).

## Over DIEK

<img src="docs/diek-thunnissen.png" alt="Diek Thunnissen" width="80" height="80" align="left" hspace="12">

Ik ben Diek Thunnissen, oprichter van [DIEK](https://diek.nl). We doen full-stack Shopify (Plus) development vanuit Nijmegen: bouwen (custom themes, metaobjects, Shopify Functions en maatwerkapps), migreren (data, SEO, URL's, klantaccounts en historische orders gecontroleerd naar Shopify), optimaliseren (snellere pagina's, betere koopflows, betrouwbare tracking) en doorontwikkelen (vaste ontwikkelcapaciteit voor roadmap en releases). 50+ Shopify-projecten opgeleverd.

Deze kit is de uitgeklede versie van wat we voor klanten in de checkout bouwen: upsells op eigen regels, bundels, staffelkortingen, pre-order-logica, upsells in dezelfde order op de bedankpagina, B2B-betaalmethodes. Allemaal op Shopify's eigen bouwblokken, zonder apps op het kritieke pad.

Wil je dit in jouw checkout laten zetten, of iets dat verder gaat? Mail [info@diek.nl](mailto:info@diek.nl), stuur een bericht via [diek.nl/contact](https://diek.nl/contact) of op [LinkedIn](https://www.linkedin.com/in/de-shopify-expert/).

## Licentie

MIT. Copyright 2026 Diek Thunnissen / DIEK.

---

## English summary

Four Shopify Checkout UI Extensions, no backend, no scopes, no subscription: a **USP list**, an **upsell card** fed by the complementary products you already set in Shopify's free Search & Discovery app, a **free-shipping progress bar** and a **customer reviews carousel**. Everything is configured in the checkout editor. Checkout-step blocks need Shopify Plus; the USP, reviews and upsell blocks also work on the thank-you page on every plan. Setup: `npm install`, `npm run config:link`, `npm run dev`, `npm run deploy`, then set the app to custom distribution in the Dev Dashboard, install it with the generated link and add the blocks in the checkout editor. MIT licensed, built by Diek Thunnissen at [DIEK](https://diek.nl), full-stack Shopify (Plus) development from Nijmegen, the Netherlands.
