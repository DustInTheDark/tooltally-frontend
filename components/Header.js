'use client';
import LoadingLink from './LoadingLink';
import Logo from './Logo';

/**
 * The Header component defines the site header and global navigation.
 * It has been updated to use the new colour palette and to include the site name.
 * A subtle gradient background ties the header into the brand colours.
 */
export default function Header() {
  return (
    <header className="bg-brand-slate bg-gradient-to-r from-brand-slate to-brand-blue text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Clicking on the logo returns you to the home page */}
        <LoadingLink href="/" className="flex items-center gap-2 text-white">
          <Logo />
          <span className="text-xl font-semibold">ToolTally</span>
        </LoadingLink>
        {/* Placeholder for future navigation items such as links to categories or about pages */}
        <nav className="hidden sm:flex gap-6 text-sm font-medium">
          {/* Additional nav links could go here */}
        </nav>
      </div>
    </header>
  );
}
