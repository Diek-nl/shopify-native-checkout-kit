// shopify-native-checkout-kit · https://github.com/Diek-nl/shopify-native-checkout-kit
// Gebouwd door Diek Thunnissen, DIEK (https://diek.nl) · MIT

import '@shopify/ui-extensions/preact';
import { render } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

/**
 * Klantreviews als rustige carousel: één review tegelijk, auto-rotatie elke
 * 6 seconden, pijltjes en teller. Handmatig bladeren stopt de rotatie.
 *
 * De drie reviews komen uit de instellingen in de checkout-editor. Een review
 * zonder quote of naam wordt overgeslagen; zonder enige review rendert het
 * blok niets.
 */

interface Testimonial {
  quote: string;
  author: string;
  rating: number;
}

const ROTATE_MS = 6000;
const DEFAULT_HEADING = 'Beoordeeld door onze klanten';
const DEFAULT_VERIFIED = 'geverifieerde koper';

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function readTestimonials(settings: Record<string, unknown>): Testimonial[] {
  const out: Testimonial[] = [];
  for (const i of [1, 2, 3]) {
    const quote = text(settings[`quote_${i}`]);
    const author = text(settings[`author_${i}`]);
    if (!quote || !author) continue;
    const raw = Number(settings[`rating_${i}`]);
    const rating = Number.isFinite(raw) && raw >= 1 ? Math.min(5, Math.round(raw)) : 5;
    out.push({ quote, author, rating });
  }
  return out;
}

function Stars({ count }: { count: number }) {
  return (
    <s-stack direction="inline" gap="small-500">
      {Array.from({ length: count }, (_, i) => (
        <s-icon key={i} type="star-filled" size="small-100" />
      ))}
    </s-stack>
  );
}

export default function () {
  render(<TestimonialsBlock />, document.body);
}

function TestimonialsBlock() {
  const settings = shopify.settings.value;
  const testimonials = readTestimonials(settings);
  const heading = text(settings.heading) || DEFAULT_HEADING;
  // Leeg veld = geen label; niet ingevuld (undefined) = standaardlabel.
  const verified = settings.verified_label === undefined ? DEFAULT_VERIFIED : text(settings.verified_label);

  const [index, setIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const total = testimonials.length;
  const totalRef = useRef(0);
  totalRef.current = total;

  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      if (totalRef.current > 1) setIndex((i) => (i + 1) % totalRef.current);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [autoRotate]);

  if (total === 0) return null;

  const current = testimonials[index % total];

  function go(step: number) {
    setAutoRotate(false);
    setIndex((i) => (i + step + total) % total);
  }

  return (
    <s-box background="subdued" borderRadius="base" padding="base">
      <s-stack gap="small-200">
        <s-stack direction="inline" gap="small-300" alignItems="center" justifyContent="space-between">
          <s-stack direction="inline" gap="small-300" alignItems="center">
            <s-icon type="check-circle-filled" size="small" tone="success" />
            <s-text type="small" color="subdued">
              {heading}
            </s-text>
          </s-stack>
          {total > 1 ? (
            <s-stack direction="inline" gap="small-300" alignItems="center">
              <s-button variant="secondary" accessibilityLabel="Vorige review" onClick={() => go(-1)}>
                <s-icon type="chevron-left" size="small" />
              </s-button>
              <s-text type="small" color="subdued">
                {(index % total) + 1}/{total}
              </s-text>
              <s-button variant="secondary" accessibilityLabel="Volgende review" onClick={() => go(1)}>
                <s-icon type="chevron-right" size="small" />
              </s-button>
            </s-stack>
          ) : null}
        </s-stack>
        <s-stack gap="small-300" minBlockSize="88px">
          <Stars count={current.rating} />
          <s-text type="emphasis">“{current.quote}”</s-text>
          <s-text type="small" color="subdued">
            {verified ? `${current.author} · ${verified}` : current.author}
          </s-text>
        </s-stack>
      </s-stack>
    </s-box>
  );
}
