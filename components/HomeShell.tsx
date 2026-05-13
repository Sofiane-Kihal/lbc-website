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
import type { Project, PricingGroup, Subscription } from '@/lib/defaults';

export default function HomeShell({
  projects,
  pricing,
  subscriptions,
}: {
  projects: Project[];
  pricing: PricingGroup[];
  subscriptions: Subscription[];
}) {
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [quickPreset, setQuickPreset] = useState<{
    kind: 'subscription';
    name: string;
    price?: string;
  } | null>(null);

  const openIntake = () => setIntakeOpen(true);
  const closeIntake = () => setIntakeOpen(false);

  const chooseSubscription = (sub: Subscription) =>
    setQuickPreset({
      kind: 'subscription',
      name: sub.name,
      price: `${sub.price} HT ${sub.cadence}`,
    });
  const closeQuick = () => setQuickPreset(null);

  return (
    <>
      <ScrollProgress />
      <Navigation onOpenIntake={openIntake} />
      <main>
        <Hero onOpenIntake={openIntake} />
        <LogoMarquee variant="indigo" />
        <ProjectsGrid projects={projects} />
        <Services />
        <Marquee
          variant="noir"
          speed={50}
          items={[
            'On allie créa & perfo',
            "Pas d'effets sans stratégie",
            'Mesurer · Itérer · Performer',
            "L'œil qui pique, la data qui parle",
          ]}
        />
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
