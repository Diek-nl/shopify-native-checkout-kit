// shopify-native-checkout-kit · https://github.com/Diek-nl/shopify-native-checkout-kit
// Gebouwd door Diek Thunnissen, DIEK (https://diek.nl) · MIT

import '@shopify/ui-extensions/preact';
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { fetchComplementaryOffers, readSettings, type Offer } from './recommendations';
import { OfferCard, OfferList } from './OfferCard';

/**
 * Checkout-target (Shopify Plus): kaart met Toevoegen-knop.
 *
 * Leest de cart, vraagt de complementaire producten op en voegt op één tik
 * toe via applyCartLinesChange. Bewuste keuzes:
 *  - standaard alleen producten met één variant: in de checkout kun je geen
 *    maat kiezen, en de verkeerde maat toevoegen is erger dan geen upsell.
 *    De merchant kan dit omzetten (setting multi_variant), dan gaat de
 *    eerste variant erin;
 *  - `instructions.lines.canAddCartLine` wordt gecheckt: bij Apple/Google
 *    Pay mag de cart niet meer veranderen en rendert het blok niets;
 *  - na toevoegen verdwijnt de kaart niet stil maar wordt hij een bevestiging.
 */
export default function () {
  render(<CheckoutUpsell />, document.body);
}

function CheckoutUpsell() {
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Signals lezen in de render abonneert op wijzigingen.
  const lines = shopify.lines.value;
  const canAdd = shopify.instructions.value.lines.canAddCartLine;
  const { heading, buttonLabel, maxOffers, multiVariant } = readSettings(shopify.settings.value);

  const cartProductIds = lines.map((line) => line.merchandise.product.id);
  const cartKey = cartProductIds.join('|');

  useEffect(() => {
    let cancelled = false;
    if (cartProductIds.length === 0) {
      setOffers([]);
      return;
    }
    (async () => {
      // Eén extra ophalen zodat we na het filteren op single-variant nog
      // genoeg over hebben.
      const all = await fetchComplementaryOffers(shopify.query, cartProductIds, maxOffers + 2, shopify.shop.storefrontUrl);
      if (!cancelled) {
        setOffers(all.filter((o) => o.availableForSale && (multiVariant || o.singleVariant)).slice(0, maxOffers));
      }
    })();
    return () => {
      cancelled = true;
    };
    // cartKey vat de cart-inhoud samen; herladen bij elke wijziging.
  }, [cartKey, maxOffers, multiVariant]);

  if (!canAdd || !offers || offers.length === 0) return null;

  async function handleAdd(offer: Offer) {
    if (!offer.variantId) return;
    setBusy(offer.productId);
    setError(null);
    const result = await shopify.applyCartLinesChange({
      type: 'addCartLine',
      merchandiseId: offer.variantId,
      quantity: 1,
    });
    setBusy(null);
    if (result.type === 'error') {
      setError('Toevoegen lukte even niet. Probeer het opnieuw.');
    } else {
      setAdded((prev) => new Set(prev).add(offer.productId));
    }
  }

  return (
    <OfferList heading={heading}>
      {offers.map((offer) => (
        <OfferCard
          key={offer.productId}
          offer={offer}
          formatCurrency={(amount, currency) => shopify.i18n.formatCurrency(amount, { currency })}
          action={
            added.has(offer.productId) ? (
              <s-stack direction="inline" gap="small-300" alignItems="center">
                <s-icon type="check-circle-filled" size="small" tone="success" />
                <s-text type="small">Toegevoegd</s-text>
              </s-stack>
            ) : (
              <s-button loading={busy === offer.productId || undefined} onClick={() => handleAdd(offer)}>
                {buttonLabel}
              </s-button>
            )
          }
        />
      ))}
      {error ? <s-banner tone="critical">{error}</s-banner> : null}
    </OfferList>
  );
}
