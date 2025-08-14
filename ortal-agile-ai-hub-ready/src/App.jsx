import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

// Centralized links
const LINKS = {
  linkedinProfile: "https://www.linkedin.com/in/ortal-lasry-3232252b6",
  linkedinProjects: "https://www.linkedin.com/in/ortal-lasry-3232252b6/details/projects/",
  github: "https://github.com/ortall0201",
  linktree: "https://linktr.ee/Ortal_Lasry",
  docsTranslator: "https://docs-translator.onrender.com/",
};

// Endpoint — can be overridden by window.__NOTION_ENDPOINT or localStorage('notion-endpoint')
const NOTION_ENDPOINT =
  typeof window !== "undefined"
    ? window.__NOTION_ENDPOINT || localStorage.getItem("notion-endpoint") || "/api/notion-intake"
    : "/api/notion-intake";

function SectionTitle({ children }) {
  return (
    <div className="mb-6">
      <div className="inline-flex items-center gap-2">
        <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-indigo-500 via-fuchsia-500 to-emerald-500" />
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-emerald-600">
          {children}
        </h2>
      </div>
    </div>
  );
}

function GlowCard({ className = "", children }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-emerald-500/10" aria-hidden />
      <div className="relative rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur px-5 py-5">
        {children}
      </div>
    </div>
  );
}

function GradientButton({ href, onClick, children, variant = "filled" }) {
  const base = "relative inline-flex items-center justify-center rounded-xl px-5 py-3 transition will-change-transform";
  if (variant === "filled") {
    return (
      <a href={href} onClick={onClick} className={`${base} text-white shadow hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-emerald-600`}>
        <span className="relative z-10">{children}</span>
      </a>
    );
  }
  return (
    <a href={href} onClick={onClick} className={`${base} border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/70`}>
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 rounded-xl pointer-events-none [mask-image:linear-gradient(#000,transparent)] bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-emerald-500/20" aria-hidden />
    </a>
  );
}

export default function App() {
  const [lang, setLang] = useState("he");
  const [theme, setTheme] = useState("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const setNotionEndpoint = () => {
    const current = (typeof window !== "undefined" && window.__NOTION_ENDPOINT) || localStorage.getItem("notion-endpoint") || "";
    const url = prompt(lang === "he" ? "הדביקי URL של ה-endpoint ל-Notion" : "Paste the Notion endpoint URL", current || "");
    if (url) {
      try {
        localStorage.setItem("notion-endpoint", url);
        alert(lang === "he" ? "נשמר. הטופס ישלח ל-Notion דרך ה-URL שהוגדר." : "Saved. The form will POST to the new URL.");
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("site-lang");
    const savedTheme = localStorage.getItem("site-theme");
    if (savedLang) setLang(savedLang);
    if (savedTheme) setTheme(savedTheme);
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
  }, []);
  useEffect(() => { localStorage.setItem("site-lang", lang); }, [lang]);
  useEffect(() => {
    localStorage.setItem("site-theme", theme);
    const root = document.documentElement; const body = document.body;
    if (theme === "dark") { root.classList.add("dark"); body.classList.add("dark"); }
    else { root.classList.remove("dark"); body.classList.remove("dark"); }
  }, [theme]);

  const copy = async (text) => { try { await navigator.clipboard.writeText(text); alert(lang === "he" ? "הועתק ללוח" : "Copied!"); } catch {} };

  const t = useMemo(() => {
    const he = {
      nav: { about: "עליי", services: "שירותים", projects: "פרויקטים", contact: "יצירת קשר" },
      hero: { badge: "טכני, אג׳ילי ובונה מערכות AI", title: "אורטל לסרי", subtitle: "Technical PM | Agile & AI-Oriented", ctaPrimary: "שיחת היכרות", ctaSecondary: "הורדת קו״ח" },
      projects: { title: "פרויקטים נבחרים", search: "חפש…", filterAll: "הכל", filters: { ai: "AI/LLM", pm: "Project", ops: "Ops" }, items: [
        { name: "RunMyDocker", tag: "MVP | DevOps UX", cat: "ops", desc: "פלטפורמה להרצת Docker למשתמשים לא-טכניים", link: "https://runmydocker.com" },
        { name: "docs-translator", tag: "GenAI • Translator", cat: "ai", desc: "אפליקציית תרגום מסמכים (Claude Code).", link: LINKS.docsTranslator },
      ] }
    };
    const en = {
      nav: { about: "About", services: "Services", projects: "Projects", contact: "Contact" },
      hero: { badge: "Technical, Agile & AI Builder", title: "Ortal Lasry", subtitle: "Technical PM | Agile & AI-Oriented", ctaPrimary: "Book a chat", ctaSecondary: "Download CV" },
      projects: { title: "Featured Projects", search: "Search…", filterAll: "All", filters: { ai: "AI/LLM", pm: "Project", ops: "Ops" }, items: [
        { name: "RunMyDocker", tag: "MVP | DevOps UX", cat: "ops", desc: "Docker for non-technical users", link: "https://runmydocker.com" },
        { name: "docs-translator", tag: "GenAI • Translator", cat: "ai", desc: "Document translator (Claude Code)", link: LINKS.docsTranslator },
      ] }
    };
    return lang === "he" ? he : en;
  }, [lang]);

  const projectList = useMemo(() => {
    return t.projects.items.filter(
      (p) => (activeTag === "all" || p.cat === activeTag) && (p.name.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase()))
    );
  }, [t, query, activeTag]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name"); const email = fd.get("email"); const msg = fd.get("message");
    setSubmitStatus("sending");
    try {
      const res = await fetch(NOTION_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, message: msg, source: "website" }) });
      if (!res.ok) throw new Error("bad status");
      setSubmitStatus("success"); e.currentTarget.reset(); return;
    } catch (err) {
      setSubmitStatus("error");
      const subject = encodeURIComponent(`Website inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\\nEmail: ${email}\\n\\n${msg}`);
      window.location.href = `mailto:ortalgr@gmail.com?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })} lang={lang === "he" ? "he" : "en"} dir={lang === "he" ? "rtl" : "ltr"} className="min-h-screen relative text-slate-900 dark:text-slate-100 bg-[radial-gradient(60rem_30rem_at_50%_-10%,rgba(99,102,241,0.20),transparent),radial-gradient(40rem_20rem_at_10%_0%,rgba(236,72,153,0.20),transparent)] dark:bg-[radial-gradient(60rem_30rem_at_50%_-10%,rgba(99,102,241,0.10),transparent),radial-gradient(40rem_20rem_at_10%_0%,rgba(236,72,153,0.10),transparent)]">
      <div className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-500" style={{ background: `radial-gradient(500px circle at ${cursor.x}px ${cursor.y}px, rgba(99,102,241,0.12), transparent 40%)` }} aria-hidden />

      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/50 border-b border-white/30 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#home" className="font-extrabold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-emerald-600">Ortal Agile AI Hub (Lovable)</a>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#about" className="hover:text-indigo-600">{t.nav.about}</a>
            <a href="#services" className="hover:text-indigo-600">{t.nav.services}</a>
            <a href="#projects" className="hover:text-indigo-600">{t.nav.projects}</a>
            <a href="#contact" className="hover:text-indigo-600">{t.nav.contact}</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "he" ? "en" : "he")} className="px-3 py-1 rounded-full border border-slate-300/70 dark:border-slate-700 text-xs hover:bg-slate-100/70 dark:hover:bg-slate-800/70">{lang === "he" ? "EN" : "HE"}</button>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-full border border-slate-300/70 dark:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/70" aria-label="Toggle theme">🌓</button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg border border-slate-300/70 dark:border-slate-700">☰</button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 pb-4">
            {Object.values(t.nav).map((label, i) => (
              <a key={i} href={["#about","#services","#projects","#contact"][i]} className="block py-2" onClick={() => setMobileOpen(false)}>{label}</a>
            ))}
          </div>
        )}
      </header>

      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-emerald-500 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 md:pb-24">
          <div className="grid md:grid-cols-2 items-center gap-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 text-xs px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 border border-emerald-300/60 dark:border-emerald-800">Lovable theme loaded ✓</div>
              <motion.span initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 backdrop-blur">{t.hero.badge}</motion.span>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-700 to-emerald-700 dark:from-white dark:via-indigo-300 dark:to-emerald-300">{t.hero.title}</motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="mt-3 text-slate-700 dark:text-slate-300 text-lg">{t.hero.subtitle}</motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="mt-6 flex gap-3">
                <GradientButton href="#contact">{t.hero.ctaPrimary}</GradientButton>
                <GradientButton href={LINKS.linktree} variant="outline">{t.hero.ctaSecondary}</GradientButton>
              </motion.div>
              <div className="mt-6 flex gap-4 text-sm opacity-80">
                <a className="underline" href={LINKS.linkedinProfile} target="_blank" rel="noreferrer noopener">LinkedIn</a>
                <a className="underline" href={LINKS.github} target="_blank" rel="noreferrer noopener">GitHub</a>
                <a className="underline" href={LINKS.linkedinProjects} target="_blank" rel="noreferrer noopener">LinkedIn Projects</a>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="relative">
              <div className="aspect-square w-full max-w-md mx-auto rounded-[2rem] p-[1px] bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-emerald-500 shadow-2xl">
                <div className="w-full h-full rounded-[1.9rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur grid place-items-center">
                  <div className="text-center p-6">
                    <div className="text-8xl">🤖</div>
                    <p className="mt-2 text-sm opacity-80">Agile • AI • Ops</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <SectionTitle>{t.projects.title}</SectionTitle>
            <div className="flex gap-2 items-center">
              <div className="flex gap-1">
                <button onClick={() => setActiveTag("all")} className={`px-3 py-1 rounded-full border ${activeTag === "all" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "border-slate-300 dark:border-slate-700"}`}>{t.projects.filterAll}</button>
                <button onClick={() => setActiveTag("ai")} className={`px-3 py-1 rounded-full border ${activeTag === "ai" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "border-slate-300 dark:border-slate-700"}`}>{t.projects.filters.ai}</button>
                <button onClick={() => setActiveTag("pm")} className={`px-3 py-1 rounded-full border ${activeTag === "pm" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "border-slate-300 dark:border-slate-700"}`}>{t.projects.filters.pm}</button>
                <button onClick={() => setActiveTag("ops")} className={`px-3 py-1 rounded-full border ${activeTag === "ops" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "border-slate-300 dark:border-slate-700"}`}>{t.projects.filters.ops}</button>
              </div>
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.projects.search} className="w-full max-w-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur" />
              <a href={LINKS.linkedinProjects} target="_blank" rel="noreferrer noopener" className="hidden md:inline-flex text-xs px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/70">LinkedIn Projects ↗</a>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectList.map((p, i) => (
              <motion.a key={i} href={p.link} target={p.link.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group block" whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
                <GlowCard>
                  <div className="h-40 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 grid place-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 opacity-60">
                      <path fill="currentColor" d="M4 4h16v12H5.17L4 17.17V4m0-2a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2H4m3 6h10v2H7V8m0 4h7v2H7v-2z" />
                    </svg>
                  </div>
                  <div className="pt-5">
                    <div className="text-xs inline-flex px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-800">{p.tag}</div>
                    <h3 className="mt-2 text-lg font-semibold group-hover:text-indigo-600">{p.name}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{p.desc}</p>
                  </div>
                </GlowCard>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle>{lang === "he" ? "יצירת קשר" : "Contact"}</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
            <GlowCard>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <label className="grid gap-1">
                    <span className="text-sm">{lang === "he" ? "שם" : "Name"}</span>
                    <input name="name" required className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur" />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-sm">{lang === "he" ? "אימייל" : "Email"}</span>
                    <input type="email" name="email" required className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur" />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-sm">{lang === "he" ? "הודעה" : "Message"}</span>
                    <textarea name="message" rows={5} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur" />
                  </label>
                  <button className="mt-2 px-5 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700" type="submit" disabled={submitStatus === "sending"}>
                    {submitStatus === "sending" ? (lang === "he" ? "שולחת…" : "Sending…") : (lang === "he" ? "שליחה" : "Send")}
                  </button>
                  {submitStatus === "success" && <div className="text-emerald-600 text-sm mt-1">{lang === "he" ? "נשמר ב‑Notion ✓" : "Saved to Notion ✓"}</div>}
                  {submitStatus === "error" && <div className="text-red-600 text-sm mt-1">{lang === "he" ? "שגיאה בשליחה" : "Submission error"}</div>}
                </div>
              </form>
            </GlowCard>
            <GlowCard>
              <div className="space-y-3">
                <a href={LINKS.linkedinProfile} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/70">
                  LinkedIn
                </a>
                <a href={LINKS.github} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/70">
                  GitHub
                </a>
                <a href={LINKS.linktree} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800/70">
                  Linktree / CV
                </a>
                <button onClick={() => {
                  const url = prompt(lang === "he" ? "הדביקי URL של ה-endpoint ל-Notion" : "Paste Notion endpoint URL", localStorage.getItem("notion-endpoint") || "");
                  if (url) { localStorage.setItem("notion-endpoint", url); alert(lang === "he" ? "נשמר" : "Saved"); }
                }} className="text-xs underline underline-offset-4 opacity-80">
                  {lang === "he" ? "הגדרת כתובת Notion endpoint" : "Set Notion endpoint"}
                </button>
              </div>
            </GlowCard>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-sm opacity-80">
        <p>© {new Date().getFullYear()} Ortal Lasry.</p>
      </footer>
    </div>
  );
}