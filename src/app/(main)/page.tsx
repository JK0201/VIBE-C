'use client';

import Header from '@/components/layout/Header/Header';
import Hero from '@/components/main/Hero/Hero';
import CategoryNav from '@/components/main/CategoryNav/CategoryNav';
import PopularComponents from '@/components/main/PopularComponents/PopularComponents';
import CategoryModules from '@/components/main/CategoryModules/CategoryModules';
import RecentRequests from '@/components/main/RecentRequests/RecentRequests';
import HowItWorks from '@/components/main/HowItWorks/HowItWorks';
import Trust from '@/components/main/Trust/Trust';
import CTA from '@/components/main/CTA/CTA';
import Footer from '@/components/layout/Footer/Footer';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFBFC' }}>
      <Header />
      <Hero />
      <CategoryNav />
      <PopularComponents />
      <CategoryModules />
      <RecentRequests />
      <HowItWorks />
      <Trust />
      <CTA />
      
      <Footer />
    </div>
  );
}