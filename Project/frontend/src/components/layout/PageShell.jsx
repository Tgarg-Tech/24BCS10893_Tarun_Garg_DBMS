import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function PageShell({ title, subtitle, actions, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f6f8]">
      <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="resolve-page-main flex-1 p-4 sm:p-6 lg:p-8 w-full mx-auto">
          {(title || actions) && (
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {title && <h1 className="resolve-title text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>}
                {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
              </div>
              {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

