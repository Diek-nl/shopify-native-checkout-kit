// shopify-native-checkout-kit · https://github.com/Diek-nl/shopify-native-checkout-kit
// Gebouwd door Diek Thunnissen, DIEK (https://diek.nl) · MIT

import '@shopify/ui-extensions/preact';
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { fetchComplementaryOffers, readSettings, type Offer } from './recommendations';
import { OfferCard, OfferList } from './OfferCard';

/**
 * Thank-you-target (elk plan behalve Starter): dezelfde kaart, maar de
 * order is al geplaatst, dus geen Toevoegen-knop. In plaats daarvan een
 * link naar het product. Hier mogen ook producten met meerdere varianten:
 * de klant kiest zijn maat op de productpagina.
 */
export default function () {
  render(<ThankYouUpsell />, document.body);
}

function ThankYouUpsell() {
  const [offers, setOffers] = useState<Offer[] | null>(null);

  const lines = shopify.lines.value;
  const { heading, maxOffers } = readSettings(shopify.settings.value);
  const cartProductIds = lines.map((line) => line.merchandise.product.id);
  const cartKey = cartProductIds.join('|');

  useEffect(() => {
    let cancelled = false;
    if (cartProductIds.length === 0) {
      setOffers([]);
      return;
    }
    (async () => {
      const all = await fetchComplementaryOffers(shopify.query, cartProductIds, maxOffers, shopify.shop.storefrontUrl);
      if (!cancelled) setOffers(all);
    })();
    return () => {
      cancelled = true;
    };
  }, [cartKey, maxOffers]);

  if (!offers || offers.length === 0) return null;

  return (
    <OfferList heading={heading}>
      {offers.map((offer) => (
        <OfferCard
          key={offer.productId}
          offer={offer}
          formatCurrency={(amount, currency) => shopify.i18n.formatCurrency(amount, { currency })}
          action={
            offer.url ? (
              <s-link href={offer.url} target="_blank">
                Bekijk
              </s-link>
            ) : (
              <s-stack />
            )
          }
        />
      ))}
    </OfferList>
  );
}
