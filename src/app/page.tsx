'use client';

import Hero from '@/components/Hero';
import Apps from '@/components/Apps';
import Stickers from '@/components/Stickers';
import Footer from '@/components/Footer';
import { usePageLoader } from '@/hooks/usePageLoader';
import { useFadeInSelector } from '@/hooks/useFadeInSelector';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function Home() {
  usePageLoader();
  useFadeInSelector('.fade-in');
  useHeaderScroll();

  return (
    <>
      <div className="loader"></div>
      <Hero />
      <Apps />
      <Stickers />
      <Footer />
    </>
  );
}
