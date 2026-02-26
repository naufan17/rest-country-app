import CountryGrid from '@/components/CountryGrid';

async function getCountries() {
  const res = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,flags,population');
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('API Error:', errorData);
    throw new Error(`Failed to fetch country data: ${res.status}`);
  }
  return res.json();
}

interface SimpleCountry {
  name: {
    common: string;
  };
}

export default async function Home() {
  const countries = await getCountries();
  
  // Sort by common name initially
  countries.sort((a: SimpleCountry, b: SimpleCountry) => a.name.common.localeCompare(b.name.common));

  return (
    <main className="min-h-screen bg-white">
      <CountryGrid countries={countries} />
    </main>
  );
}
