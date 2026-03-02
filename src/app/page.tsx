import Link from 'next/link';
import { LayoutDashboard, Globe } from 'lucide-react';
import { getCountries } from '@/lib/api';
import CountryGrid from '@/components/CountryGrid';

const Home = async () => {
  const dbCountries = await getCountries();

  const countries = dbCountries.map((c: { 
    name: string; 
    capital: string | null; 
    region: string | null; 
    flagUrl: string | null; 
    population: number | null 
  }) => ({
    name: { common: c.name, official: c.name },
    capital: c.capital ? [c.capital] : [],
    region: c.region || '',
    flags: { png: c.flagUrl || '', svg: '' },
    population: c.population || 0,
  }));

  return (
    <main className="min-h-screen bg-slate-50/30">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">RestCountries Explorer</h1>
          </div>
          <Link 
            href="/dashboard" 
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Admin Dashboard
          </Link>
        </div>
      </header>

      <div className="py-8">
        {countries.length > 0 
        ?  <CountryGrid countries={countries} />
        : (
          <div className="max-w-6xl mx-auto py-20 px-4 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">No Data Found</h2>
            <p className="text-slate-500 mb-8">Click the sync button above to fetch country data from the API and save it to the database.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
