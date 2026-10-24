// shopify-native-checkout-kit · https://github.com/Diek-nl/shopify-native-checkout-kit
// Gebouwd door Diek Thunnissen, DIEK (https://diek.nl) · MIT

import '@shopify/ui-extensions/preact';
import { render } from 'preact';

/**
 * USP-blok: tot vijf regels zekerheden met een vinkje ervoor.
 *
 * Alles komt uit de instellingen in de checkout-editor (shopify.settings is
 * een signal: wijzigt de merchant een regel in de editor, dan rendert het
 * blok direct opnieuw). Lege regels worden overgeslagen; zijn alle regels
 * leeg, dan rendert het blok niets. Nooit een leeg kader in de checkout.
 */

const ICONS = ['check', 'check-circle-filled', 'delivery', 'lock', 'return', 'star-filled'] as const;
type IconType = (typeof ICONS)[number];

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export default function () {
  render(<UspsBlock />, document.body);
}

function UspsBlock() {
  const settings = shopify.settings.value;
  const heading = text(settings.heading);
  const iconSetting = text(settings.icon) as IconType;
  const icon: IconType = ICONS.includes(iconSetting) ? iconSetting : 'check';
  const usps = ['usp_1', 'usp_2', 'usp_3', 'usp_4', 'usp_5']
    .map((key) => text(settings[key]))
    .filter((line) => line.length > 0);

  if (usps.length === 0) return null;

  return (
    <s-stack gap="small-200">
      {heading ? (
        <s-text type="small" color="subdued">
          {heading}
        </s-text>
      ) : null}
      {usps.map((usp) => (
        <s-stack key={usp} direction="inline" gap="small-300" alignItems="center">
          <s-icon type={icon} size="small" tone="success" />
          <s-text type="small">{usp}</s-text>
        </s-stack>
      ))}
    </s-stack>
  );
}
