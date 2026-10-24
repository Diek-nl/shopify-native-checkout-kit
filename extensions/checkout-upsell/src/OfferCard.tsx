// shopify-native-checkout-kit · https://github.com/Diek-nl/shopify-native-checkout-kit
// Gebouwd door Diek Thunnissen, DIEK (https://diek.nl) · MIT

import type { ComponentChildren } from 'preact';
import type { Offer } from './recommendations';

/**
 * De kaart zelf, gedeeld door de checkout- en de thank-you-module.
 * Rustig blok: thumbnail, titel, prijs, en rechts de actie die de
 * aanroeper meegeeft (knop in de checkout, link op de bedankpagina).
 */
export function OfferCard({
  offer,
  formatCurrency,
  action,
}: {
  offer: Offer;
  formatCurrency: (amount: number, currency: string) => string;
  action: ComponentChildren;
}) {
  return (
    <s-grid gridTemplateColumns="auto 1fr auto" gap="base" alignItems="center">
      {offer.imageUrl ? <s-product-thumbnail src={offer.imageUrl} alt={offer.title} size="base" /> : <s-stack />}
      <s-stack gap="small-500">
        <s-text type="strong">{offer.title}</s-text>
        <s-text>{formatCurrency(offer.amount, offer.currencyCode)}</s-text>
      </s-stack>
      {action}
    </s-grid>
  );
}

export function OfferList({ heading, children }: { heading: string; children: ComponentChildren }) {
  return (
    <s-box background="subdued" borderRadius="base" padding="base">
      <s-stack gap="base">
        <s-text type="small" color="subdued">
          {heading}
        </s-text>
        {children}
      </s-stack>
    </s-box>
  );
}
