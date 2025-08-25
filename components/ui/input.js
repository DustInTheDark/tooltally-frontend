import React from 'react';

export function Input({ className = '', ...props }) {
  return (
    <input
      className={
        'w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm ' +
        'placeholder:text-slate-400 focus:outline-none focus:border-slate-900 ' +
        className
      }
      {...props}
    />
  );
}
