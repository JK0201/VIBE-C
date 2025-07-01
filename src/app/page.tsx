'use client';

import Header from '@/components/layout/Header';
import Hero from '@/components/home/Hero';
import CategoryNav from '@/components/home/CategoryNav';
import PopularComponents from '@/components/home/PopularComponents';
import CategoryModules from '@/components/home/CategoryModules';
import RecentRequests from '@/components/home/RecentRequests';
import HowItWorks from '@/components/home/HowItWorks';
import Trust from '@/components/home/Trust';
import CTA from '@/components/home/CTA';
import Footer from '@/components/layout/Footer';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
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