// shopify-native-checkout-kit · https://github.com/Diek-nl/shopify-native-checkout-kit
// Gebouwd door Diek Thunnissen, DIEK (https://diek.nl) · MIT

// Ambient types: de side-effect import laadt de Polaris `s-*` JSX-augmentatie
// voor Preact; de ShopifyGlobal-augmentatie typeert wat dit blok gebruikt.
import '@shopify/ui-extensions/purchase.checkout.block.render';
import type { Api } from '@shopify/ui-extensions/purchase.checkout.block.render';

declare module '@shopify/ui-extensions/checkout' {
  interface ShopifyGlobal extends Pick<Api, 'settings'> {}
}

export {};
