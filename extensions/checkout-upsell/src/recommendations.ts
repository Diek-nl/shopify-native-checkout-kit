// shopify-native-checkout-kit · https://github.com/Diek-nl/shopify-native-checkout-kit
// Gebouwd door Diek Thunnissen, DIEK (https://diek.nl) · MIT

/**
 * Complementaire producten uit Shopify's eigen Search & Discovery-app.
 *
 * De merchant stelt per product in welke producten erbij horen
 * (Products → Search & Discovery → Recommendations → Complementary).
 * Shopify bewaart dat en geeft het terug via de Storefront API:
 *
 *   productRecommendations(productId: ID!, intent: COMPLEMENTARY)
 *
 * Geen eigen data, geen metaobject, geen app-backend. Verwijder je deze
 * extensie, dan staan de aanbevelingen nog gewoon in de admin.
 */

export interface Offer {
  productId: string;
  title: string;
  url: string | null;
  imageUrl: string | null;
  variantId: string | null;
  singleVariant: boolean;
  availableForSale: boolean;
  amount: number;
  currencyCode: string;
}

const COMPLEMENTARY_QUERY = `#graphql
  query Complementary($productId: ID!) {
    productRecommendations(productId: $productId, intent: COMPLEMENTARY) {
      id
      title
      handle
      onlineStoreUrl
      availableForSale
      featuredImage { url(transform: { maxWidth: 160, maxHeight: 160, crop: CENTER }) }
      variantsCount { count }
      variants(first: 1) {
        nodes {
          id
          availableForSale
          price { amount currencyCode }
        }
      }
    }
  }
`;

interface RecommendedProduct {
  id: string;
  title: string;
  handle: string;
  onlineStoreUrl: string | null;
  availableForSale: boolean;
  featuredImage: { url: string } | null;
  variantsCount: { count: number } | null;
  variants: {
    nodes: Array<{
      id: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
    }>;
  };
}

type QueryFn = (
  query: string,
  options?: { variables?: Record<string, unknown> },
) => Promise<{ data?: unknown; errors?: unknown[] }>;

// Hoeveel cart-producten we bevragen. Elke query is één Storefront-call;
// de eerste paar regels in de cart zijn bijna altijd de relevante.
const MAX_SOURCE_PRODUCTS = 3;

/**
 * Haalt complementaire producten op voor de producten in de cart en filtert
 * wat al in de cart ligt en wat niet te koop is. Volgorde = volgorde van de
 * cart, daarbinnen de volgorde die de merchant in Search & Discovery koos.
 */
export async function fetchComplementaryOffers(
  query: QueryFn,
  cartProductIds: string[],
  limit: number,
  storefrontUrl?: string,
): Promise<Offer[]> {
  const inCart = new Set(cartProductIds);
  const sources = Array.from(inCart).slice(0, MAX_SOURCE_PRODUCTS);

  const results = await Promise.all(
    sources.map(async (productId) => {
      try {
        const { data } = (await query(COMPLEMENTARY_QUERY, { variables: { productId } })) as {
          data?: { productRecommendations: RecommendedProduct[] | null };
        };
        return data?.productRecommendations ?? [];
      } catch {
        // Eén mislukte query mag de kaart niet slopen: dan gewoon geen aanbod
        // uit dit product.
        return [];
      }
    }),
  );

  const seen = new Set<string>();
  const offers: Offer[] = [];

  for (const product of results.flat()) {
    if (seen.has(product.id) || inCart.has(product.id)) continue;
    seen.add(product.id);
    const variant = product.variants.nodes[0];
    if (!variant || !product.availableForSale) continue;
    offers.push({
      productId: product.id,
      title: product.title,
      // onlineStoreUrl is null op een shop met wachtwoord (dev stores); dan
      // zelf de PDP-url bouwen uit de storefront-url en de handle.
      url:
        product.onlineStoreUrl ??
        (storefrontUrl ? `${storefrontUrl.replace(/\/$/, '')}/products/${product.handle}` : null),
      imageUrl: product.featuredImage?.url ?? null,
      variantId: variant.id,
      singleVariant: (product.variantsCount?.count ?? 1) === 1,
      availableForSale: variant.availableForSale,
      amount: Number(variant.price.amount),
      currencyCode: variant.price.currencyCode,
    });
    if (offers.length >= limit) break;
  }

  return offers;
}

/** Instellingen uit de checkout-editor, met nette defaults. */
export function readSettings(settings: Record<string, string | number | boolean | undefined>) {
  const heading = typeof settings.heading === 'string' && settings.heading.trim() ? settings.heading : 'Vaak samen gekocht';
  const buttonLabel =
    typeof settings.button_label === 'string' && settings.button_label.trim() ? settings.button_label : 'Toevoegen';
  const raw = Number(settings.max_offers);
  const maxOffers = Number.isFinite(raw) && raw >= 1 ? Math.min(3, Math.floor(raw)) : 1;
  const multiVariant = settings.multi_variant === true;
  return { heading, buttonLabel, maxOffers, multiVariant };
}
