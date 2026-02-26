'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Search, Globe, Users, MapPin, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  ).slice(0, 20); 

  return (
    <div className="max-w-7xl mx-auto py-16 px-6 space-y-16">
      <div className="flex flex-col items-center text-center space-y-4">
        <Badge variant="outline" className="px-4 py-1 border-indigo-200 text-indigo-600 bg-indigo-50/50 rounded-full text-sm font-semibold tracking-wide uppercase">
          Global Directory
        </Badge>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
          Explore the <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">World</span>
        </h1>
        <p className="text-slate-500 max-w-2xl text-lg md:text-xl font-medium">
          A beautifully curated collection of nations, providing you with key insights into every corner of our planet.
        </p>
      </div>

      <div className="max-w-2xl mx-auto relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors z-10" />
          <Input 
            type="text" 
            placeholder="Search nations or regions..." 
            className="pl-14 pr-6 py-8 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl focus:ring-0 focus:border-indigo-500 transition-all text-xl shadow-xl shadow-slate-200/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredCountries.map((country) => (
          <Card key={country.name.common} className="group relative bg-white rounded-[2rem] overflow-hidden border-none shadow-2xl shadow-slate-200/40 hover:shadow-indigo-200/40 transition-all duration-500 flex flex-col hover:-translate-y-3">
            {/* Flag Header */}
            <div className="h-56 relative overflow-hidden">
              <Image 
                src={country.flags.png} 
                alt={country.name.common} 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
              
              <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <Badge className="bg-white/20 backdrop-blur-md border-white/30 text-white rounded-full px-3">
                  {country.region}
                </Badge>
              </div>

              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
                  {country.name.common}
                </h3>
                <p className="text-white/80 text-xs font-medium uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {country.region}
                </p>
              </div>
            </div>
            
            <CardContent className="p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center gap-4 group/item">
                  <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-500 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Official Name</p>
                    <p className="text-sm font-semibold text-slate-700 line-clamp-1">{country.name.official}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Navigation className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Capital</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 truncate pl-5">
                      {country.capital?.[0] || '—'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Population</span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 pl-5">
                      {country.population.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                 <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Learn More</span>
                 <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                   <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                     <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                   </svg>
                 </div>
              </div>
            </CardContent>
            
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-slate-900/5 rounded-[2rem] group-hover:ring-indigo-500/20 transition-all duration-500" />
          </Card>
        ))}
      </div>

      {!filteredCountries.length && (
        <Card className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200">
          <CardContent>
            <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-xl font-medium">No countries found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
