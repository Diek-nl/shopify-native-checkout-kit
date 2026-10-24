# Voor AI-agents (Claude Code, Codex, Cursor)

Dit is een extension-only Shopify-app: vier Checkout UI Extensions, geen backend, geen database, geen access scopes. Lees eerst `README.md`, daar staat alles wat de shop-eigenaar moet weten.

## Wat je doet als iemand vraagt "installeer dit op mijn shop"

Werk de stappen uit de README af en vertel de gebruiker per stap wat er gaat gebeuren.

1. `npm install`
2. `npm run config:link`. Dit is interactief: de gebruiker moet inloggen bij Shopify, een organisatie kiezen en "Create this project as a new app" kiezen. Laat dat de gebruiker zelf doen in de terminal; jij kunt niet inloggen namens de gebruiker.
3. `npm run dev` om te testen (optioneel, de gebruiker kiest zijn shop). Stop dit proces weer voor de volgende stap.
4. `npm run deploy` en bevestigen met ja.
5. De rest gebeurt in de browser en kun jij niet doen. Geef de gebruiker deze lijst:
   - Partner Dashboard (partners.shopify.com) of Dev Dashboard → de app → **Distributie** → **Aangepaste distributie** → **Selecteren**.
   - Winkeldomein invullen (`jouwshop.myshopify.com`) → **Link genereren** → link openen → **Installeren**.
   - Shopify-admin → **Instellingen → Checkout → Aanpassen** → **App-blok toevoegen** → kies een van de vier blokken → slepen → rechts de instellingen invullen → **Opslaan**. USP's, Klantreviews en Upsell kunnen ook op het tabblad **Bedankt**.
   - Op een development store: distributie overslaan, op de app-pagina direct **Install app**.
   - Optioneel: `docs/app-icon.png` uploaden als app-icoon onder **Instellingen → App-icoon** op de app-pagina. Dat kan niet via de CLI of de toml, alleen in het dashboard.

Vereisten die je moet checken vóór je begint: Node 20 of nieuwer (`node -v`) en Shopify CLI (`npx shopify version`; wordt anders via npm mee-geïnstalleerd).

Wil de gebruiker maar één of twee blokken? Verwijder dan de andere mappen uit `extensions/` vóór `npm run deploy`. Een blok dat niet in de checkout-editor gesleept wordt, doet ook niets, dus verwijderen is niet verplicht.

## Regels

- `shopify.app.toml` is een template. `config:link` maakt `shopify.app.<naam>.toml` aan met de `client_id`; dat bestand staat in `.gitignore`. Commit het nooit, en zet nooit een `client_id` in `shopify.app.toml`.
- Voeg geen access scopes, backend, webhooks, metaobjects of externe netwerkcalls toe. Het hele punt van deze kit is dat hij niets bezit en nergens naartoe praat. Alle instellingen leven in de checkout-editor.
- Verander `uid` en `handle` in de `shopify.extension.toml`-bestanden niet na een eerste deploy; anders ziet Shopify het als een nieuwe extensie en verdwijnt het blok uit de checkout-editor.
- `npm run typecheck` moet slagen voordat je deployt.
- Wil de gebruiker automatische "related products" in plaats van handmatige complementaire producten: verander `COMPLEMENTARY` in `RELATED` in `extensions/checkout-upsell/src/recommendations.ts`. Dat is de enige code-aanpassing die je zonder overleg mag voorstellen.

## Structuur

```
shopify.app.toml                       app-config (template)
extensions/
  checkout-usps/                       USP-rij: tot vijf regels uit de editor
    src/UspsBlock.tsx
  checkout-upsell/                     upsell uit Search & Discovery
    src/recommendations.ts             Storefront-query, filteren, settings
    src/OfferCard.tsx                  de kaart (gedeeld)
    src/CheckoutUpsell.tsx             checkout: knop + applyCartLinesChange
    src/ThankYouUpsell.tsx             bedankpagina: link
  checkout-shipping-bar/               gratis-verzending-balk, drempel uit de editor
    src/ShippingBar.tsx
  checkout-testimonials/               tot drie klantreviews uit de editor
    src/TestimonialsBlock.tsx
```

Gebouwd door Diek Thunnissen, DIEK (https://diek.nl). Vragen of maatwerk: info@diek.nl.
