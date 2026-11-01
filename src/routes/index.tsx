import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Navbar, CourseExplorer, Steps, InfoSections, Footer, EnrollDialog, btnPrimary, btnGhost } from "@/components/site";
import type { Course } from "@/lib/courses";

const HeroScene = lazy(() => import("@/components/HeroScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STUDY ROOM — Explore, Enroll & Excel" },
      { name: "description", content: "SSC, HSC, medical and engineering admission courses. Learn Beyond Limits — Achieve More." },
      { property: "og:title", content: "STUDY ROOM — Explore, Enroll & Excel" },
      { property: "og:description", content: "SSC, HSC and admission preparation courses at STUDY ROOM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [enroll, setEnroll] = useState<{ open: boolean; course?: Course | undefined }>({ open: false });
  const [lite, setLite] = useState(true);
  const [show3d, setShow3d] = useState(false);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLite(innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4);
    setShow3d(!reduced);
  }, []);
  const openEnroll = (course?: Course) => setEnroll({ open: true, course });

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar onEnroll={() => openEnroll()} />
      <section id="home" className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center justify-center px-4 md:px-8">
        <div className="absolute inset-0 -z-0">
          <ClientOnly fallback={null}>{show3d && <Suspense fallback={null}><HeroScene lite={lite} /></Suspense>}</ClientOnly>
        </div>
        <div className="pointer-events-none relative z-10 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 inline-block rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-accent">STUDY ROOM</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl font-extrabold leading-[1.05] sm:text-6xl md:text-8xl">
            Explore <span className="text-gradient">Courses</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5 flex items-center justify-center gap-3 text-lg text-muted-foreground md:text-2xl">
            <span className="h-px w-10 bg-border" /> Explore, Enroll & Excel <span className="h-px w-10 bg-border" />
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="pointer-events-auto mt-10 flex flex-wrap justify-center gap-3">
            <a href="#courses" className={btnPrimary}>Explore Courses <ArrowRight className="size-4" /></a>
            <button onClick={() => openEnroll()} className={`${btnGhost} glass`}>Join STUDY ROOM</button>
          </motion.div>
        </div>
      </section>
      <CourseExplorer onEnroll={openEnroll} />
      <Steps />
      <InfoSections />
      <Footer />
      <EnrollDialog key={enroll.course?.id ?? "none"} open={enroll.open} course={enroll.course} onOpenChange={(o) => setEnroll((s) => ({ ...s, open: o }))} />
    </div>
  );
}
