'use client';
import Link from 'next/link';
import { useNavigation } from './NavigationContext';

export default function LoadingLink({ href, children, ...props }) {
  const { startLoading } = useNavigation();
  return (
    <Link
      href={href}
      onClick={() => startLoading()}
      {...props}
    >
      {children}
    </Link>
  );
}
