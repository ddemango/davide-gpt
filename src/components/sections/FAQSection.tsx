import { faqItems } from '@/lib/data';
import Accordion from '@/components/ui/Accordion';
import SectionWrapper from '@/components/ui/SectionWrapper';
import SectionHeader from '@/components/ui/SectionHeader';

export default function FAQSection() {
  return (
    <SectionWrapper dark id="faq">
      <SectionHeader
        eyebrow="FAQ"
        title={
          <>
            Questions?{' '}
            <span className="text-gradient">We've Got Answers</span>
          </>
        }
        description="Everything you need to know before diving in."
      />

      <div className="mx-auto max-w-3xl">
        <Accordion items={faqItems} />
      </div>
    </SectionWrapper>
  );
}
