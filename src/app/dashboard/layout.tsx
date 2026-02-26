'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, BarChart3, ArrowLeft, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Data Management', href: '/dashboard/management', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Link href="/" className="hover:opacity-80 transition-all flex items-center gap-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 leading-tight">Admin Console</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">RestCountries Project</p>
                </div>
             </Link>
          </div>
          <Link 
            href="/" 
            className="text-sm font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Exit Dashboard
          </Link>
        </div>
      </header>

      {/* Navigation Sub-header */}
      <div className="bg-white border-b border-slate-200 sticky top-18 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center -mb-px">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-all duration-300 relative",
                                isActive 
                                    ? "border-indigo-600 text-indigo-600" 
                                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                            )}
                        >
                            <item.icon className={cn("w-4 h-4", isActive ? "text-indigo-600" : "text-slate-400")} />
                            {item.label}
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 animate-in fade-in zoom-in duration-300" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        {children}
      </main>
    </div>
  );
}
