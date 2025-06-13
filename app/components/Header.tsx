
'use client';

import React from 'react';

export default function Header() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dhyan</h1>
          <p className="text-sm text-muted">{currentDate}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted">Today's Focus</p>
          <p className="text-lg font-semibold text-primary">Stay Productive</p>
        </div>
      </div>
    </header>
  );
}
