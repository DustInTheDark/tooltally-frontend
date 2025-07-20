'use client'

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span role="img" aria-label="wrench">🔧</span>
      <span>
        <span className="font-bold text-brand-blue">Tool</span>
        <span className="font-bold text-brand-slate">Tally</span>
      </span>
    </div>
  );
}