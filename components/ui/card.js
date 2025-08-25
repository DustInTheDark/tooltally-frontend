import React from 'react';

export function Card({ className = '', ...props }) {
  return (
    <div
      className={
        'rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 ' + className
      }
      {...props}
    />
  );
}

export function CardHeader({ className = '', ...props }) {
  return <div className={'p-4 ' + className} {...props} />;
}

export function CardTitle({ className = '', ...props }) {
  return (
    <h3 className={'text-lg font-semibold text-slate-900 ' + className} {...props} />
  );
}

export function CardContent({ className = '', ...props }) {
  return <div className={'p-4 ' + className} {...props} />;
}
