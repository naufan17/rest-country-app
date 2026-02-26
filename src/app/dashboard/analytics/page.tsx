import React from 'react';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import { Country } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { TrendingUp, Users, Globe, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  trend?: string;
  color: 'indigo' | 'emerald' | 'amber' | 'purple';
}

export default async function AnalyticsPage() {
  const countries: Country[] = await prisma.country.findMany();

  // Prepare data for Region Distribution Chart
  const regions: string[] = [...new Set(countries.map((c: Country) => c.region || 'Unknown'))];
  const regionData = regions.map((region: string) => ({
    name: region,
    value: countries.filter((c: Country) => (c.region || 'Unknown') === region).length
  })).sort((a, b) => b.value - a.value);

  // Prepare data for Top 10 Population Chart
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
}

function StatCard({ title, value, icon: Icon, description, trend, color }: StatCardProps) {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2 rounded-xl border", colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">{value}</h4>
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  );
}