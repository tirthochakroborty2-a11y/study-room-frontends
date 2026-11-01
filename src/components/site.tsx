import { useState, useRef, type ReactNode, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, GraduationCap, Stethoscope, Cog, Sparkles, CalendarDays, Users, Moon, Sun, Menu, X, Send, FolderOpen, FileText, Rocket, ArrowRight, Search, Mail, Phone, Lightbulb } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BATCHES, SUBJECTS, COURSES, filterCourses, formatFee, telegramLink, getCourses, type Course } from "@/lib/courses";

const ICONS = { book: BookOpen, cap: GraduationCap, steth: Stethoscope, gear: Cog, spark: Sparkles };

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60";
export const btnGhost = "inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent";

const NAV = [["Home", "#home"], ["Courses", "#courses"], ["About", "#about"], ["Support", "#support"]] as const;

export function Navbar({ onEnroll }: { onEnroll: () => void }) {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const toggle = () => { setLight(!light); document.documentElement.classList.toggle("light", !light); };
  return (
    <header className="sticky top-0 z-50 glass border-x-0 border-t-0">
      <nav className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:px-8">
        <a href="#home" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-primary shadow-glow"><Lightbulb className="size-5 text-primary-foreground" /></span>
          <span className="font-display text-lg font-bold">STUDY <span className="text-gradient">ROOM</span></span>
        </a>
        <div className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map(([l, h]) => <a key={l} href={h} className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">{l}</a>)}
        </div>
        <button onClick={toggle} aria-label="Toggle theme" className="ml-auto rounded-full border border-border p-2 md:ml-2">{light ? <Moon className="size-4" /> : <Sun className="size-4 text-gold" />}</button>
        <button onClick={onEnroll} className={`${btnPrimary} hidden !px-5 !py-2 md:inline-flex`}>Enroll Now</button>
        <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden md:hidden">
            <div className="flex flex-col gap-1 px-4 pb-4">
              {NAV.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 hover:bg-secondary">{l}</a>)}
              <button onClick={() => { setOpen(false); onEnroll(); }} className={btnPrimary}>Enroll Now</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${active ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow" : "border-border text-foreground hover:border-accent hover:text-accent"}`}>
      {children}
    </button>
  );
}

function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => ref.current && (ref.current.style.transform = "")}
      className="group h-full rounded-2xl glass p-5 transition-[transform,box-shadow] duration-200 hover:shadow-glow">
      {children}
    </div>
  );
}

function CourseCard({ c, onDetails, onEnroll }: { c: Course; onDetails: () => void; onEnroll: () => void }) {
  const Icon = ICONS[c.icon];
  return (
    <TiltCard>
      <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">{c.category}</span>
      <div className="my-5 grid place-items-center">
        <div className="grid size-20 place-items-center rounded-2xl bg-gradient-primary shadow-glow transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
          <Icon className="size-10 text-primary-foreground" />
        </div>
      </div>
      <h3 className="text-lg font-bold">{c.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{c.short}</p>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><CalendarDays className="size-3.5 text-accent" />{c.batch}</span>
        <span className="flex items-center gap-1"><Users className="size-3.5 text-accent" />{c.faculty}</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm"><span className="text-muted-foreground">Course fee</span><span className="font-display text-lg font-bold text-accent">{formatFee(c.fee)}</span></div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button onClick={onDetails} className={`${btnGhost} !py-2`}>Details</button>
        <button onClick={onEnroll} className={`${btnPrimary} !py-2`}>Enroll <ArrowRight className="size-4" /></button>
      </div>
    </TiltCard>
  );
}

export function CourseExplorer({ onEnroll }: { onEnroll: (c?: Course) => void }) {
  const [batch, setBatch] = useState<string>("All Batches");
  const [subject, setSubject] = useState<string>("All Subjects");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<Course | null>(null);
  const [courses] = useState(() => getCourses());
  const list = filterCourses(courses, batch, subject, q);
  return (
    <section id="courses" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 md:px-8">
      <Reveal className="text-center">
        <h2 className="text-4xl font-extrabold md:text-6xl">STUDY <span className="text-gradient">ROOM</span></h2>
        <p className="mt-3 text-muted-foreground">Filter by batch or subject, or search directly.</p>
      </Reveal>
      <Reveal delay={0.1} className="mx-auto mt-8 max-w-xl">
        <label className="flex items-center gap-3 rounded-full glass px-5 py-3 focus-within:ring-2 focus-within:ring-ring">
          <Search className="size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search course, batch or subject…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </label>
      </Reveal>
      <div className="mt-8 flex flex-wrap justify-center gap-2">{BATCHES.map((b) => <Chip key={b} active={batch === b} onClick={() => setBatch(b)}>{b}</Chip>)}</div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">{SUBJECTS.map((s) => <Chip key={s} active={subject === s} onClick={() => setSubject(s)}>{s}</Chip>)}</div>
      <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((c) => (
            <motion.div key={c.id} layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.3 }}>
              <CourseCard c={c} onDetails={() => setDetail(c)} onEnroll={() => onEnroll(c)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && (
        <div className="mt-10 text-center text-muted-foreground">No courses match these filters. <button className="text-accent underline" onClick={() => { setBatch("All Batches"); setSubject("All Subjects"); setQ(""); }}>Reset filters</button></div>
      )}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border/50 bg-popover/95 backdrop-blur-xl sm:max-w-2xl">
          {detail && (
            <>
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-primary rounded-t-lg" />
              <DialogHeader className="pt-1">
                <div className="mb-3 flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
                    {(() => { const Icon = ICONS[detail.icon]; return <Icon className="size-6 text-primary-foreground" />; })()}
                  </span>
                  <div>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">{detail.category}</span>
                    <DialogTitle className="mt-1 font-display text-2xl leading-tight">{detail.title}</DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-sm leading-relaxed">{detail.description}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                {[["Batch", detail.batch], ["Instructor", detail.faculty], ["Schedule", detail.schedule], ["Course fee", formatFee(detail.fee)]].map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-border/40 bg-secondary/60 p-4">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{k}</div>
                    <div className="mt-1 font-display text-base font-semibold">{v}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-border/40 bg-secondary/40 p-5">
                <h4 className="mb-3 flex items-center gap-2 font-semibold"><Sparkles className="size-4 text-accent" /> Curriculum</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {detail.curriculum.map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold">Subjects covered</h4>
                <div className="flex flex-wrap gap-2">
                  {detail.subjects.map((s) => (
                    <span key={s} className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">{s}</span>
                  ))}
                </div>
              </div>
              <button className={`${btnPrimary} w-full py-3.5 text-base`} onClick={() => { const c = detail; setDetail(null); onEnroll(c); }}>
                Enroll in this course <ArrowRight className="size-4" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export function Steps() {
  const steps = [
    [FolderOpen, "Choose a Category", "Select your preferred course, batch, or subject."],
    [FileText, "Explore Course Details", "Review course information, schedules, and fees."],
    [Rocket, "Continue to Enroll", "Submit your details and complete the enrollment process."],
  ] as const;
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <Reveal><h2 className="text-2xl font-bold md:text-3xl">How to enroll <span className="text-muted-foreground">· 3 steps</span></h2></Reveal>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map(([Icon, t, d], i) => (
          <Reveal key={t} delay={i * 0.12} className="relative">
            <div className="h-full rounded-2xl glass p-6">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-full border-2 border-accent font-display font-bold text-accent">0{i + 1}</span>
                <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}><Icon className="size-8 text-primary-glow" /></motion.span>
              </div>
              <h3 className="mt-4 font-bold">{t}</h3><p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
            {i < 2 && <ArrowRight className="absolute -right-5 top-1/2 hidden size-5 -translate-y-1/2 text-accent md:block" />}
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function EnrollDialog({ open, onOpenChange, course }: { open: boolean; onOpenChange: (o: boolean) => void; course?: Course | undefined }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sent" | "unconfigured">("idle");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const err: Record<string, string> = {};
    if (f.name.trim().length < 2) err.name = "Enter your full name";
    if (!/^(\+?880|0)1[3-9]\d{8}$/.test(f.phone.replace(/\s/g, ""))) err.phone = "Enter a valid Bangladeshi mobile number";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) err.email = "Enter a valid email";
    if (!f.institution.trim()) err.institution = "Enter your institution";
    if (f.payment !== "Pay Later" && !f.trx.trim()) err.trx = "Transaction ID is required for this payment method";
    setErrors(err);
    if (Object.keys(err).length) return;
    const msg = `🎓 STUDY ROOM Enrollment\n\n👤 Name: ${f.name}\n📱 Phone: ${f.phone}\n📧 Email: ${f.email}\n📚 Course: ${f.course}\n🗓️ Batch: ${f.batch}\n🏫 Institution: ${f.institution}\n💳 Payment: ${f.payment}\n🔖 TrxID: ${f.trx || "-"}\n\n— via studyroom website`;
    const link = telegramLink(msg);
    if (!link) { setStatus("unconfigured"); return; }
    window.open(link, "_blank", "noopener");
    setStatus("sent");
  };
  const field = "w-full rounded-xl border border-input bg-secondary/80 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";
  const label = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground";
  const Err = ({ k }: { k: string }) => errors[k] ? <p className="mt-1 text-xs text-destructive">{errors[k]}</p> : null;
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) { setStatus("idle"); setErrors({}); } }}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border/50 bg-popover/95 backdrop-blur-xl sm:max-w-md">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-primary rounded-t-lg" />
        <DialogHeader className="pt-2">
          <DialogTitle className="font-display text-2xl">
            <span className="text-gradient">Enroll</span> at STUDY ROOM
          </DialogTitle>
          <DialogDescription className="text-sm">
            Fill the form → details go straight to <span className="font-medium text-accent">@STUDY_ROOM_MY_bot</span>
          </DialogDescription>
        </DialogHeader>
        {status === "sent" ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-primary shadow-glow">
              <Send className="size-7 text-primary-foreground" />
            </div>
            <p className="mt-5 text-lg font-semibold">Telegram opened!</p>
            <p className="mt-1 text-sm text-muted-foreground">Just press <strong>Send</strong> in Telegram to complete enrollment.</p>
            <button onClick={() => onOpenChange(false)} className={`${btnGhost} mt-6`}>Close</button>
          </motion.div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-4 pt-1">
            <div>
              <label className={label}>Full Name</label>
              <input name="name" placeholder="Your full name" className={field} autoComplete="name" />
              <Err k="name" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Phone</label>
                <input name="phone" placeholder="01XXXXXXXXX" className={field} inputMode="tel" />
                <Err k="phone" />
              </div>
              <div>
                <label className={label}>Email</label>
                <input name="email" type="email" placeholder="you@email.com" className={field} />
                <Err k="email" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Course</label>
                <select name="course" defaultValue={course?.title ?? COURSES[0].title} className={field}>
                  {COURSES.map((c) => <option key={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>Batch</label>
                <select name="batch" defaultValue={course?.batches[0] ?? "HSC 27"} className={field}>
                  {BATCHES.slice(1).map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={label}>Institution</label>
              <input name="institution" placeholder="School / College name" className={field} />
              <Err k="institution" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={label}>Payment Method</label>
                <select name="payment" className={field} defaultValue="bKash">
                  <option>bKash</option>
                  <option>Nagad</option>
                  <option>Pay Later</option>
                </select>
              </div>
              <div>
                <label className={label}>Transaction ID</label>
                <input name="trx" placeholder="TrxID (if paid)" className={field} />
                <Err k="trx" />
              </div>
            </div>
            {status === "unconfigured" && (
              <p className="rounded-xl bg-destructive/15 p-3 text-xs text-destructive">
                Telegram bot not configured. Contact admin.
              </p>
            )}
            <button type="submit" className={`${btnPrimary} mt-1 w-full py-3.5 text-base`}>
              <Send className="size-4" /> Continue on Telegram
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              Secured connection to @STUDY_ROOM_MY_bot
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function InfoSections() {
  const why = [["Concept-first teaching", "Understand the why, not just the answer."], ["Structured study plans", "Clear weekly paths for every batch."], ["Regular assessments", "Model tests to track your progress."], ["Community support", "Ask doubts in our Telegram community."]];
  const faq = [["How do I enroll?", "Pick a course, press Enroll, fill the form and send it to us on Telegram."], ["Which payment methods are accepted?", "bKash, Nagad, or you can choose to pay later."], ["When are the course fees announced?", "Fees are shown as TBA until officially announced."], ["Are classes online?", "Placeholder — please update with the real class format."]];
  return (
    <>
      <section id="about" className="mx-auto grid max-w-7xl scroll-mt-20 gap-10 px-4 py-20 md:grid-cols-2 md:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">About</p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">Learn Beyond Limits — <span className="text-gradient">Achieve More.</span></h2>
          <p className="mt-4 text-muted-foreground">STUDY ROOM helps SSC, HSC and admission candidates prepare with focus and confidence. <em>(Placeholder — replace with your story.)</em></p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {why.map(([t, d], i) => <Reveal key={t} delay={i * 0.08}><div className="h-full rounded-2xl glass p-5"><h3 className="font-semibold">{t}</h3><p className="mt-1 text-sm text-muted-foreground">{d}</p></div></Reveal>)}
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <Reveal><h2 className="text-center text-3xl font-bold">Frequently asked questions</h2></Reveal>
        <Accordion type="single" collapsible className="mt-8 rounded-2xl glass px-5">
          {faq.map(([q, a]) => <AccordionItem key={q} value={q}><AccordionTrigger>{q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{a}</AccordionContent></AccordionItem>)}
        </Accordion>
      </section>
      <section id="support" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 md:px-8">
        <Reveal>
          <div className="grid gap-6 rounded-3xl glass p-8 md:grid-cols-2 md:p-12">
            <div>
              <h2 className="text-3xl font-bold">Support & community</h2>
              <p className="mt-2 text-muted-foreground">Questions about a course? Reach out — contact details below are placeholders.</p>
              <div className="mt-5 space-y-2 text-sm"><p className="flex items-center gap-2"><Phone className="size-4 text-accent" /> +880 1XXX-XXXXXX</p><p className="flex items-center gap-2"><Mail className="size-4 text-accent" /> hello@studyroom.example</p></div>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <a href="https://t.me/STUDY_ROOM_MY_bot" target="_blank" rel="noopener" className={btnPrimary}>
                <Send className="size-4" /> Chat with @STUDY_ROOM_MY_bot
              </a>
              <p className="text-center text-xs text-muted-foreground">Enrollments & support via Telegram bot</p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export function Footer() {
  return (
    <footer className="mt-10 border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-xl font-bold">STUDY <span className="text-gradient">ROOM</span></p>
          <p className="mt-2 text-sm text-muted-foreground">Learn Beyond Limits — Achieve More.</p>
          <a href="https://t.me/STUDY_ROOM_MY_bot" target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
            <Send className="size-3.5" /> @STUDY_ROOM_MY_bot
          </a>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold">Quick links</p>
          {NAV.map(([l, h]) => <a key={l} href={h} className="block py-1 text-muted-foreground hover:text-accent">{l}</a>)}
          <a href="/admin" className="block py-1 text-muted-foreground/50 hover:text-accent">Admin</a>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold">Categories</p>
          {["SSC", "HSC", "Medical Admission", "Engineering Admission"].map((x) => (
            <a key={x} href="#courses" className="block py-1 text-muted-foreground hover:text-accent">{x}</a>
          ))}
        </div>
      </div>
      <p className="pb-8 text-center text-xs tracking-[0.3em] text-muted-foreground">
        © {new Date().getFullYear()} STUDY ROOM · ACHIEVE MORE
      </p>
    </footer>
  );
}
