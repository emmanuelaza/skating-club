import type { Metadata } from 'next';
import { PricingPlans, type PublicPlan } from '@/components/public/PricingPlans';
import { FAQAccordion } from '@/components/public/FAQAccordion';
import { Section, SectionHeading, PageHero } from '@/components/public/Section';
import { getMembershipPlans, getAllFAQs, getSiteConfig } from '@/sanity/lib/queries';

export const revalidate = 60;

function benefits(features: unknown): string[] {
  return Array.isArray(features) ? features.filter((item): item is string => typeof item === 'string') : [];
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const name = config?.name ?? 'Skating Club';
  return {
    title: `Planes · ${name}`,
    description: 'Planes de membresía y precios.',
  };
}

export default async function PlanesPage() {
  const [plansData, faqs] = await Promise.all([getMembershipPlans(), getAllFAQs()]);

  const plans: PublicPlan[] = plansData.map((plan, index) => ({
    id: plan.id,
    name: plan.name,
    description: (plan as { description?: string }).description ?? '',
    priceCop: plan.price_cop,
    interval: plan.interval === 'year' ? 'year' : 'month',
    features: benefits(plan.features),
    recommended: plansData.length >= 3 && index === 1,
  }));

  const planFaqs = faqs.filter((faq) => faq.category === 'planes');

  return (
    <>
      <PageHero title="Planes" subtitle="Elige el plan que mejor se adapta a tu ritmo. Sin permanencia." />

      <Section>
        {plans.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Pronto publicaremos nuestros planes.
          </p>
        ) : (
          <PricingPlans plans={plans} />
        )}
      </Section>

      {planFaqs.length > 0 ? (
        <Section alt>
          <SectionHeading title="Preguntas sobre planes" />
          <div className="mx-auto max-w-3xl">
            <FAQAccordion
              items={planFaqs.map((faq) => ({ id: faq._id, question: faq.question, answer: faq.answer }))}
            />
          </div>
        </Section>
      ) : null}
    </>
  );
}
