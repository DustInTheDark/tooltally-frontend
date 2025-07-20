'use client'
import LoadingLink from './LoadingLink';
import Logo from './Logo';

export default function Header() {
  return (
    <header className="bg-brand-slate text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <LoadingLink href="/" className="flex items-center gap-2 text-white">
          <Logo />
        </LoadingLink>
      </div>
    </header>
  );
}