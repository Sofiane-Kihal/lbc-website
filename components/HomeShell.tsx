'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProjectsGrid from '@/components/ProjectsGrid';
import Services from '@/components/Services';
import Pricing from '@/components/Pricing';
import Subscriptions from '@/components/Subscriptions';
import Contact from '@/components/Contact';
import IntakeModal from '@/components/IntakeModal';
import QuickContactModal from '@/components/QuickContactModal';
import Marquee from '@/components/Marquee';
import LogoMarquee from '@/components/LogoMarquee';
import { ScrollProgress } from '@/components/MotionPrimitives';
import type { Project, PricingGroup, Subscription, Banners } from '@/lib/defaults';

export default function HomeShell({
  projects,
  pricing,
  subscriptions,
  banners,
}: {
  projects: Project[];
  pricing: PricingGroup[];
  subscriptions: Subscription[];
  banners: Banners;
}) {
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [quickPreset, setQuickPreset] = useState<{
    kind: 'subscription';
    id: string;
    name: string;
    price?: string;
    compact?: boolean;
    addon?: { id: string; name: string; price: string; cadence: string };
  } | null>(null);

  const openIntake = () => setIntakeOpen(true);
  const closeIntake = () => setIntakeOpen(false);

  const chooseSubscription = (sub: Subscription) =>
    setQuickPreset({
      kind: 'subscription',
      id: sub.id,
      name: sub.name,
      price: `${sub.price} HT ${sub.cadence}`,
      compact: sub.compact,
      addon: sub.addon
        ? {
            id: `${sub.id}-addon`,
            name: sub.addon.name,
            price: sub.addon.price,
            cadence: sub.cadence,
          }
        : undefined,
    });
  const closeQuick = () => setQuickPreset(null);

  return (
    <>
      <ScrollProgress />
      <Navigation onOpenIntake={openIntake} />
      <main>
        <Hero
          onOpenIntake={openIntake}
          featuredProject={projects.find((p) => p.featured) ?? projects[0]}
        />
        <LogoMarquee variant="noir" logos={banners.logos} />
        <ProjectsGrid projects={projects} />
        <Services />
        <Marquee variant="noir" speed={50} items={banners.slogans} />
        <Pricing groups={pricing} />
        <Subscriptions items={subscriptions} onChoose={chooseSubscription} />
        <Contact onOpenIntake={openIntake} />
      </main>
      <Footer />
      <IntakeModal open={intakeOpen} onClose={closeIntake} />
      <QuickContactModal
        open={!!quickPreset}
        onClose={closeQuick}
        preset={quickPreset}
      />
    </>
  );
}
