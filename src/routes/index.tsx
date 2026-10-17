import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties } from "react";
import sealedBg from "@/assets/sealed-backdrop.jpg";
import heroBg from "@/assets/hero-backdrop.jpg";
import waxSeal from "@/assets/wax-seal.png";
import paper from "@/assets/paper-texture.jpg";
import { Corners, Divider, SectionHeading } from "@/components/Ornaments";
import { ScratchReveal } from "@/components/ScratchReveal";

const COUPLE = { a: "Aarav", b: "Anaya" };
const VENUE = "The Grand Pavilion";
const WEDDING = new Date("2027-02-14T16:00:00+05:30");
const EVENTS = [
  { name: "Mehndi", when: new Date("2027-02-13T18:00:00+05:30"), place: "The Garden Terrace" },
  { name: "Nikah", when: new Date("2027-02-14T16:00:00+05:30"), place: VENUE },
  { name: "Walima", when: new Date("2027-02-15T19:30:00+05:30"), place: VENUE },
];
const TZ = "Asia/Kolkata";
const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric" });
const fmtTime = (d: Date) => d.toLocaleTimeString("en-GB", { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aarav & Anaya — Nikah, 14 February 2027" },
      { name: "description", content: "You are warmly invited to the Nikah of Aarav & Anaya at The Grand Pavilion, 14 February 2027." },
      { property: "og:title", content: "Aarav & Anaya — Wedding Invitation" },
      { property: "og:description", content: "Join us at The Grand Pavilion on 14 February 2027." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

function useCountdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, WEDDING.getTime() - (now ?? WEDDING.getTime()));
  return [
    ["Days", Math.floor(diff / 864e5)],
    ["Hours", Math.floor(diff / 36e5) % 24],
    ["Minutes", Math.floor(diff / 6e4) % 60],
    ["Seconds", Math.floor(diff / 1e3) % 60],
  ] as const;
}

function useReveal(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [active]);
}

function Invitation() {
  const [stage, setStage] = useState<"sealed" | "opening" | "open">("sealed");
  useReveal(stage === "open");
  const open = () => {
    if (stage !== "sealed") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStage("opening");
    setTimeout(() => setStage("open"), reduce ? 0 : 1100);
  };
  const style = { "--paper-url": `url(${paper})` } as CSSProperties;

  return (
    <main style={style} className="paper-ground min-h-screen">
      {stage !== "open" && (
        <section
          className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-1000 ${stage === "opening" ? "scale-110 opacity-0" : ""}`}
        >
          <img src={sealedBg} alt="" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-transparent to-foreground/30" />
          <div className="absolute left-1/2 top-[49%] -translate-x-1/2 -translate-y-1/2">
            <span className="animate-pulse-ring absolute inset-0 rounded-full border border-paper-light/70" />
            <button onClick={open} aria-label="Open the invitation" className="seal-btn relative block w-[min(30vw,30vh,190px)] min-w-[110px]">
              <img src={waxSeal} alt="" width={816} height={816} className="w-full" />
              <span className="absolute inset-0 flex items-center justify-center font-display text-[clamp(1.1rem,5vw,2.2rem)] italic text-highlight [text-shadow:0_1px_0_var(--scratch-ink)]">
                {COUPLE.a[0]}&nbsp;&amp;&nbsp;{COUPLE.b[0]}
              </span>
            </button>
          </div>
          <p className="eyebrow absolute bottom-10 left-0 right-0 text-center text-paper-light [text-shadow:0_1px_8px_var(--foreground)]">
            Tap the seal to open
          </p>
        </section>
      )}

      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-20">
        <img src={heroBg} alt="" width={1536} height={1024} className={`absolute inset-0 h-full w-full object-cover ${stage === "open" ? "animate-slow-zoom" : ""}`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--paper-light)_0%,transparent_65%)] opacity-60" />
        {stage === "open" && (
          <div className="animate-rise relative text-center">
            <p className="eyebrow">Together with their families</p>
            <h1 className="mt-6 font-display text-[clamp(3.2rem,14vw,8rem)] font-light leading-[0.9] text-foreground">
              {COUPLE.a}
              <span className="my-2 block font-display text-[0.45em] italic text-highlight">&amp;</span>
              {COUPLE.b}
            </h1>
            <Divider className="mt-8" />
            <div className="card-paper mx-auto mt-8 max-w-xs px-8 py-6">
              <p className="eyebrow">Request the honour of your presence</p>
              <p className="mt-3 font-display text-2xl text-foreground">{fmtDate(WEDDING)}</p>
              <p className="mt-1 text-sm tracking-widest text-muted">{VENUE}</p>
            </div>
          </div>
        )}
      </section>

      {stage === "open" && <Sections />}
    </main>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="reveal card-paper mx-auto max-w-3xl px-6 py-16 sm:px-14 sm:py-20">
      <Corners />
      {children}
    </div>
  );
}

function Sections() {
  const count = useCountdown();
  const [rsvp, setRsvp] = useState<string | null>(null);
  return (
    <div className="space-y-16 px-4 py-20 sm:space-y-24 sm:px-8 sm:py-28">
      <Frame>
        <p className="text-center font-display text-xl italic leading-relaxed text-foreground sm:text-2xl">
          “And among His signs is that He created for you mates from among yourselves, that you may find tranquillity in them.”
        </p>
        <p className="eyebrow mt-6 text-center">Ar-Rum · 30:21</p>
      </Frame>

      <Frame>
        <SectionHeading eyebrow="Counting the moments" title="Until we say Qubool" />
        <div className="mt-12 grid grid-cols-4 gap-2 sm:gap-6">
          {count.map(([l, v]) => (
            <div key={l} className="border-y border-highlight/40 py-4 text-center">
              <div className="font-display text-3xl tabular-nums text-foreground sm:text-5xl">{String(v).padStart(2, "0")}</div>
              <div className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-muted">{l}</div>
            </div>
          ))}
        </div>
      </Frame>

      <Frame>
        <SectionHeading eyebrow="The celebrations" title="Order of Events" />
        <div className="mt-12 space-y-10">
          {EVENTS.map((e, i) => (
            <div key={e.name} className="text-center">
              <h3 className="font-display text-3xl text-accent">{e.name}</h3>
              <p className="mt-2 text-sm tracking-wide text-foreground">{fmtDate(e.when)}</p>
              <p className="text-sm text-muted">{fmtTime(e.when)} IST · {e.place}</p>
              {i < EVENTS.length - 1 && <Divider className="mt-10" />}
            </div>
          ))}
        </div>
      </Frame>

      <Frame>
        <SectionHeading eyebrow="A little secret" title="Scratch the Foil" />
        <p className="mt-6 text-center text-sm text-muted">Gently scratch to reveal the hour we begin.</p>
        <div className="mt-8">
          <ScratchReveal>
            <div className="text-center">
              <p className="eyebrow">The Nikah begins at</p>
              <p className="mt-2 font-display text-4xl text-foreground">{fmtTime(WEDDING)}</p>
            </div>
          </ScratchReveal>
        </div>
      </Frame>

      <Frame>
        <SectionHeading eyebrow="Where" title={VENUE} />
        <p className="mt-6 text-center text-sm leading-relaxed text-muted">Olive Courtyard, Garden Estate<br />Arrive by half past three for seating.</p>
        <div className="mt-8 text-center">
          <a href={`https://maps.google.com/?q=${encodeURIComponent(VENUE)}`} target="_blank" rel="noreferrer"
            className="inline-block border border-highlight px-8 py-3 text-xs uppercase tracking-[0.3em] text-accent transition-colors hover:bg-tint">
            View on map
          </a>
        </div>
      </Frame>

      <Frame>
        <SectionHeading eyebrow="Kindly reply" title="Will you join us?" />
        {rsvp ? (
          <p className="mt-10 text-center font-display text-2xl italic text-accent">{rsvp}</p>
        ) : (
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <button onClick={() => setRsvp("With joy — we can’t wait to see you.")} className="bg-accent px-8 py-3 text-xs uppercase tracking-[0.3em] text-paper-light transition-opacity hover:opacity-90">Joyfully accept</button>
            <button onClick={() => setRsvp("You will be missed — thank you for letting us know.")} className="border border-border px-8 py-3 text-xs uppercase tracking-[0.3em] text-muted hover:bg-tint">Regretfully decline</button>
          </div>
        )}
        <p className="eyebrow mt-8 text-center text-muted">Kindly respond by 14 January 2027</p>
      </Frame>

      <footer className="reveal pb-10 text-center">
        <Divider />
        <p className="mt-6 font-display text-3xl italic text-foreground">{COUPLE.a} &amp; {COUPLE.b}</p>
        <p className="eyebrow mt-2">14 · 02 · 2027</p>
      </footer>
    </div>
  );
}
