import React from 'react';

export function Button({ className = '', asChild = false, ...props }) {
  const Comp = asChild ? 'span' : 'button';
  return (
    <Comp
      className={
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium ' +
        'bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed ' +
        className
      }
      {...props}
    />
  );
}
