import Link from 'next/link';
import DashboardTable from '@/components/DashboardTable';
import SyncStatus from '@/components/SyncStatus';
import { ArrowLeft, Globe, LayoutDashboard } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const countries = await prisma.country.findMany({
    orderBy: { name: 'asc' }
  });

  const lastSync = await prisma.syncLog.findFirst({
    orderBy: { syncedAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">RestCountries Explorer</h1>
          </div>
          <Link 
            href="/" 
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Management Console</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Data Dashboard</h2>
            <p className="text-slate-500 mt-1">Manage and monitor country data from the REST Countries API.</p>
          </div>
          <div className="w-full md:w-auto">
            <SyncStatus lastSyncAt={lastSync?.syncedAt || null} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Countries" value={countries.length} color="blue" />
          <StatCard title="Regions" value={new Set(countries.map((c: { region: string | null }) => c.region)).size} color="purple" />
          <StatCard title="Total Population" value={(countries.reduce((acc: number, c: { population: number | null }) => acc + (c.population || 0), 0) / 1000000000).toFixed(2) + 'B'} color="amber" />
          <StatCard title="Last Updated" value={countries.length > 0 ? 'Today' : 'Never'} color="emerald" />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Stored Countries</h3>
            <span className="text-xs bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-500 font-medium">
              {countries.length} records found
            </span>
          </div>
          <DashboardTable countries={countries} />
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: string | number, color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-indigo-100 group">
      <p className="text-sm font-medium text-slate-500 mb-1 group-hover:text-slate-600">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
      </div>
      <div className={`mt-3 h-1 w-12 rounded-full ${colorMap[color].split(' ')[2]}`} />
    </div>
  );
}
