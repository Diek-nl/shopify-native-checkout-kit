// shopify-native-checkout-kit · https://github.com/Diek-nl/shopify-native-checkout-kit
// Gebouwd door Diek Thunnissen, DIEK (https://diek.nl) · MIT

// Ambient types voor beide targets van dit blok:
//  - de side-effect import laadt de Polaris `s-*` JSX-augmentatie voor Preact;
//  - de ShopifyGlobal-augmentatie typeert wat de modules gebruiken op de
//    globale `shopify`. `applyCartLinesChange` bestaat alleen op de
//    checkout-target; de thank-you-module gebruikt hem niet.
import '@shopify/ui-extensions/purchase.checkout.block.render';
import type { Api } from '@shopify/ui-extensions/purchase.checkout.block.render';

declare module '@shopify/ui-extensions/checkout' {
  interface ShopifyGlobal
    extends Pick<
      Api,
      'query' | 'lines' | 'instructions' | 'applyCartLinesChange' | 'i18n' | 'settings' | 'shop'
    > {}
}

export {};
