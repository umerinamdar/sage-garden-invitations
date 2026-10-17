export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto flex w-full max-w-xs items-center gap-3 text-highlight ${className}`} aria-hidden>
      <span className="gold-rule flex-1" />
      <svg width="64" height="20" viewBox="0 0 64 20" fill="none" stroke="currentColor" strokeWidth="0.9">
        <path d="M32 3c2 4 2 10 0 14-2-4-2-10 0-14Z" fill="currentColor" fillOpacity=".25" />
        <path d="M30 10C24 4 16 4 8 10c8 6 16 6 22 0Z" />
        <path d="M34 10c6-6 14-6 22 0-8 6-16 6-22 0Z" />
        <circle cx="4" cy="10" r="1.3" fill="currentColor" />
        <circle cx="60" cy="10" r="1.3" fill="currentColor" />
      </svg>
      <span className="gold-rule flex-1" />
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <svg className={`absolute h-14 w-14 text-highlight sm:h-16 sm:w-16 ${className}`} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="0.9" aria-hidden>
      <path d="M4 60V12C4 7.6 7.6 4 12 4h48" />
      <path d="M10 60V18c0-4.4 3.6-8 8-8h42" strokeOpacity=".5" />
      <path d="M16 22c6-2 10-6 12-12M16 22c2 5 1 9-3 12M16 22c5 1 8 4 9 9" />
      <ellipse cx="27" cy="12" rx="4" ry="1.8" transform="rotate(-50 27 12)" fill="currentColor" fillOpacity=".3" />
      <ellipse cx="13" cy="34" rx="4" ry="1.8" transform="rotate(-70 13 34)" fill="currentColor" fillOpacity=".3" />
      <ellipse cx="25" cy="31" rx="4" ry="1.8" transform="rotate(40 25 31)" fill="currentColor" fillOpacity=".3" />
      <circle cx="16" cy="22" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function Corners() {
  return (
    <>
      <Corner className="left-3 top-3" />
      <Corner className="right-3 top-3 -scale-x-100" />
      <Corner className="bottom-3 left-3 -scale-y-100" />
      <Corner className="bottom-3 right-3 -scale-100" />
    </>
  );
}

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <p className="eyebrow">{eyebrow}</p>
      <span className="gold-rule mx-auto mt-4 block w-24" />
      <h2 className="mt-4 font-display text-4xl font-light italic text-foreground sm:text-5xl">{title}</h2>
      <span className="gold-rule mx-auto mt-4 block w-40" />
    </div>
  );
}
