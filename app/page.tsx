import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Cases } from '@/components/Cases';
import { Stack } from '@/components/Stack';
import { SecurityObservability } from '@/components/SecurityObservability';
import { Contact } from '@/components/Contact';

// Cache estático: revalidar cada hora (3600s)
export const revalidate = 3600;

export default function Page() {
  return (
    <div className="space-y-28 sm:space-y-32 py-12 sm:py-16">
      <Hero />
      <div className="my-8 sm:my-12 border-t border-white/10 w-full" />
      <Services />
      <div className="my-8 sm:my-12 border-t border-white/10 w-full" />
      <Cases />
      <div className="my-8 sm:my-12 border-t border-white/10 w-full" />
      <Stack />
      <div className="my-8 sm:my-12 border-t border-white/10 w-full" />
      <SecurityObservability />
      <div className="my-8 sm:my-12 border-t border-white/10 w-full" />
      <Contact />
    </div>
  );
}

