import { TrendingUp, Users, Globe, Map } from 'lucide-react';
import { Country } from '@prisma/client';
import { getCountries } from '@/lib/api';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import StatCard from '@/components/StatCard';

const AnalyticsPage = async () => {
  const countries: Country[] = await getCountries();

  const regions: string[] = [...new Set(countries.map((c: Country) => c.region || 'Unknown'))];
  const regionData = regions.map((region: string) => ({
    name: region,
    value: countries.filter((c: Country) => (c.region || 'Unknown') === region).length
  })).sort((a, b) => b.value - a.value);

  const populationData = countries
    .sort((a: Country, b: Country) => (b.population || 0) - (a.population || 0))
    .slice(0, 10)
    .map((c: Country) => ({
      name: c.name,
      population: c.population || 0
    }));

  const totalPopulation = countries.reduce((acc: number, c: Country) => acc + (c.population || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics Overview</h2>
        <p className="text-slate-500 mt-1">Global demographic and geographical distributions.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Countries" 
          value={countries.length} 
          icon={Globe}
          description="Stored in database"
          color="indigo" 
        />
        <StatCard 
          title="Total Population" 
          value={(totalPopulation / 1000000000).toFixed(2) + 'B'} 
          icon={Users}
          description="Global total"
          color="emerald" 
        />
        <StatCard 
          title="Unique Regions" 
          value={regions.length} 
          icon={Map}
          description="Geographical areas"
          color="amber" 
        />
        <StatCard 
          title="Avg. Pop / Country" 
          value={(totalPopulation / countries.length / 1000000).toFixed(1) + 'M'} 
          icon={TrendingUp}
          description="Average size"
          color="purple" 
        />
      </div>
      <AnalyticsCharts regionData={regionData} populationData={populationData} />
    </div>
  );
};

export default AnalyticsPage;