import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { Cases } from '@/components/Cases';
import { Stack } from '@/components/Stack';
import { Contact } from '@/components/Contact';

export default function Page() {
  return (
    <div className="space-y-28 sm:space-y-32 py-12 sm:py-16">
      <Hero />
      <Services />
      <Cases />
      <Stack />
      <Contact />
    </div>
  );
}

