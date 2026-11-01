import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, LogOut, BookOpen, Users, Settings, Save, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { COURSES, type Course, formatFee } from "@/lib/courses";
import { btnPrimary, btnGhost } from "@/components/site";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — STUDY ROOM" }],
  }),
  component: AdminPage,
});

const ADMIN_PASS = "studyroom2026"; // change this password later
const STORAGE_KEY = "studyroom_admin_courses";

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const ok = sessionStorage.getItem("studyroom_admin") === "1";
    setAuthed(ok);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCourses(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) {
      sessionStorage.setItem("studyroom_admin", "1");
      setAuthed(true);
      setError("");
    } else {
      setError("Wrong password");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("studyroom_admin");
    setAuthed(false);
    setPass("");
  };

  const saveCourses = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateFee = (id: string, fee: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, fee: fee.trim() === "" || fee === "TBA" ? null : Number(fee) } : c
      )
    );
  };

  const updateField = (id: string, field: keyof Course, value: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm rounded-3xl border border-border/50 bg-card/80 p-8 backdrop-blur-xl shadow-glow"
        >
          <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-gradient-primary shadow-glow mx-auto">
            <Lock className="size-7 text-primary-foreground" />
          </div>
          <h1 className="text-center font-display text-2xl font-bold">Admin Login</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">STUDY ROOM Control Panel</p>
          <form onSubmit={login} className="mt-8 space-y-4">
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-input bg-secondary px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-accent/40"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
            <button type="submit" className={`${btnPrimary} w-full py-3`}>
              Enter Dashboard
            </button>
          </form>
          <Link to="/" className="mt-6 block text-center text-sm text-muted-foreground hover:text-accent">
            ← Back to website
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-primary">
              <Settings className="size-4 text-primary-foreground" />
            </span>
            <div>
              <p className="font-display font-bold">STUDY ROOM Admin</p>
              <p className="text-xs text-muted-foreground">Manage courses & fees</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className={`${btnGhost} !px-4 !py-2 text-xs`}>View Site</Link>
            <button onClick={logout} className={`${btnGhost} !px-4 !py-2 text-xs`}>
              <LogOut className="size-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Courses</h1>
            <p className="text-sm text-muted-foreground">Edit fees, titles & schedules. Changes save to this browser.</p>
          </div>
          <button onClick={saveCourses} className={`${btnPrimary} !px-5`}>
            <Save className="size-4" /> {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>

        <div className="grid gap-4">
          {courses.map((c) => (
            <motion.div
              key={c.id}
              layout
              className="rounded-2xl border border-border/40 bg-card/60 p-5 backdrop-blur-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-secondary">
                    <BookOpen className="size-5 text-accent" />
                  </span>
                  <div>
                    <input
                      value={c.title}
                      onChange={(e) => updateField(c.id, "title", e.target.value)}
                      className="bg-transparent font-display text-lg font-bold outline-none focus:text-accent"
                    />
                    <p className="text-xs text-muted-foreground">{c.category} · {c.batch}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Fee (৳)</span>
                  <input
                    type="text"
                    value={c.fee == null ? "" : String(c.fee)}
                    onChange={(e) => updateFee(c.id, e.target.value)}
                    placeholder="TBA"
                    className="w-28 rounded-lg border border-input bg-secondary px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Schedule</label>
                  <input
                    value={c.schedule}
                    onChange={(e) => updateField(c.id, "schedule", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Faculty</label>
                  <input
                    value={c.faculty}
                    onChange={(e) => updateField(c.id, "faculty", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Short description</label>
                <input
                  value={c.short}
                  onChange={(e) => updateField(c.id, "short", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
          <Users className="mx-auto mb-2 size-6 text-accent" />
          <p>Enrollments are received live on Telegram: <strong className="text-foreground">@STUDY_ROOM_MY_bot</strong></p>
          <p className="mt-1">Open the bot chat to see new enrollment messages.</p>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Default password: <code className="rounded bg-secondary px-1.5 py-0.5">studyroom2026</code> — change it in <code>src/routes/admin.tsx</code>
        </p>
      </main>
    </div>
  );
}
