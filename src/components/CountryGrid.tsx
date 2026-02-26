'use client';

import { useState } from 'react';
import { Search, Globe } from 'lucide-react';

interface Country {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  region: string;
  flags: {
    png: string;
    svg: string;
  };
  population: number;
}

export default function CountryGrid({ countries }: { countries: Country[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = countries.filter(c => 
    c.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.region.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 20); // Limit to top 20 for performance and UI

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore the World
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Discover details about countries from across the globe.
          </p>
        </div>
      </div>

      <div className="relative mb-10 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search by name or region..." 
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-lg shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredCountries.map((country) => (
          <div key={country.name.common} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="h-44 relative bg-slate-100">
              <img 
                src={country.flags.png} 
                alt={country.name.common} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-xl font-bold text-slate-800 leading-tight">
                  {country.name.common}
                </h3>
                <span className="shrink-0 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                  {country.region}
                </span>
              </div>
              
              <p className="text-slate-400 text-sm line-clamp-1 mb-4">
                {country.name.official}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Capital</span>
                  <span className="font-semibold text-slate-700">{country.capital?.[0] || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Population</span>
                  <span className="font-semibold text-slate-700">{country.population.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50">
                <button className="w-full py-2.5 px-4 rounded-xl bg-slate-50 text-slate-600 font-semibold text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-xl font-medium">No countries found matching your search.</p>
        </div>
      )}
    </div>
  );
}
