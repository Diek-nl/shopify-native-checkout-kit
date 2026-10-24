// shopify-native-checkout-kit · https://github.com/Diek-nl/shopify-native-checkout-kit
// Gebouwd door Diek Thunnissen, DIEK (https://diek.nl) · MIT

import '@shopify/ui-extensions/preact';
import { render } from 'preact';

/**
 * Gratis-verzending-balk: live voortgang naar de drempel.
 *
 * - De drempel komt uit de instellingen in de checkout-editor. Geen drempel
 *   ingevuld, dan rendert het blok niets.
 * - shopify.cost.subtotalAmount is een signal: elke wijziging in de cart
 *   (aantal, upsell, kortingscode) rekent direct mee.
 * - De kassa is de waarheid: zodra er een verzendoptie gekozen is, bepaalt het
 *   bedrag dat Shopify rekent of de balk "gratis" zegt. €0 = gratis, ook als
 *   het subtotaal onder de drempel ligt (gratis-verzending-korting). Meer dan
 *   €0 = niet gehaald, ook als het subtotaal boven de drempel ligt (een
 *   kortingscode die het totaal onder de drempel duwt). Vóór die keuze rekent
 *   de balk met het subtotaal.
 * - Het subtotaal is vóór verzendkosten en belasting, zoals Shopify's eigen
 *   verzendvoorwaarde "op basis van orderprijs" het ook rekent.
 */

const DEFAULT_REMAINING = 'Nog {bedrag} tot gratis verzending';
const DEFAULT_REACHED = 'Je ontvangt gratis verzending';

function text(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export default function () {
  render(<ShippingBar />, document.body);
}

function ShippingBar() {
  const settings = shopify.settings.value;
  const threshold = Number(settings.threshold);
  const subtotal = shopify.cost.subtotalAmount.value;
  if (!Number.isFinite(threshold) || threshold <= 0 || !subtotal) return null;

  // undefined tot de klant een verzendoptie heeft gekozen.
  const shippingCost = shopify.cost.totalShippingAmount.value;
  const amount = Number(subtotal.amount);
  const reached = shippingCost ? Number(shippingCost.amount) === 0 : amount >= threshold;
  const remaining = reached ? 0 : Math.max(0, threshold - amount);

  if (reached && settings.hide_when_reached === true) return null;

  const remainingLabel = shopify.i18n.formatCurrency(remaining, { currency: subtotal.currencyCode });
  const message = reached
    ? text(settings.message_reached, DEFAULT_REACHED)
    : text(settings.message_remaining, DEFAULT_REMAINING).replace('{bedrag}', remainingLabel);

  return (
    <s-box background="subdued" borderRadius="base" padding="small-200">
      <s-stack gap="small-300">
        <s-stack direction="inline" gap="small-300" alignItems="center">
          <s-icon
            type={reached ? 'check-circle-filled' : 'delivery'}
            size="small"
            tone={reached ? 'success' : 'neutral'}
          />
          <s-text type="small">{message}</s-text>
        </s-stack>
        <s-progress
          value={reached ? threshold : Math.min(amount, threshold)}
          max={threshold}
          tone="auto"
          accessibilityLabel="Voortgang naar gratis verzending"
        />
      </s-stack>
    </s-box>
  );
}
