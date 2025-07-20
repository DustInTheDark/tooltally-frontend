'use client'

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span role="img" aria-label="wrench">🔧</span>
      <span>
        <span className="font-bold text-[#0074E4]">Tool</span>
        <span className="font-bold text-[#2E3A59]">Tally</span>
      </span>
    </div>
  );
}
