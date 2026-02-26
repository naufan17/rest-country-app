import { prisma } from '@/lib/prisma';
import CountryGrid from '@/components/CountryGrid';
// import SyncButton from '@/components/SyncButton';

export default async function Home() {
  const dbCountries = await prisma.country.findMany({
    orderBy: { name: 'asc' }
  });

  const countries = dbCountries.map((c: { name: string; capital: string | null; region: string | null; flagUrl: string | null; population: number | null }) => ({
    name: { common: c.name, official: c.name },
    capital: c.capital ? [c.capital] : [],
    region: c.region || '',
    flags: { png: c.flagUrl || '', svg: '' },
    population: c.population || 0,
  }));

  return (
    <main className="min-h-screen bg-white">
      {/* <div className="max-w-6xl mx-auto px-4 pt-8 flex justify-end">
        <SyncButton />
      </div> */}
      {countries.length > 0 ? (
        <CountryGrid countries={countries} />
      ) : (
        <div className="max-w-6xl mx-auto py-20 px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">No Data Found</h2>
          <p className="text-slate-500 mb-8">Click the sync button above to fetch country data from the API and save it to the database.</p>
        </div>
      )}
    </main>
  );
}
