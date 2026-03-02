'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Globe, Users, MapPin, Navigation, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/use-debounce';

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

const ITEMS_PER_PAGE = 12;

export default function CountryGrid({ countries }: { countries: Country[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filteredCountries = useMemo(() => {
    return countries.filter(c => 
      c.name.common.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      c.region.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [countries, debouncedSearchTerm]);

  const countriesToShow = useMemo(() => {
    return filteredCountries.slice(0, visibleCount);
  }, [filteredCountries, visibleCount]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredCountries.length) {
          setTimeout(() => {
            setVisibleCount(prev => prev + ITEMS_PER_PAGE);
          }, 400);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, filteredCountries.length]);

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
        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-10 group-focus-within:opacity-30 group-hover:opacity-20 transition duration-1000 group-hover:duration-300"></div>
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors z-10" />
          <Input 
            type="text" 
            placeholder="Search nations or regions..." 
            className="pl-14 pr-6 py-8 bg-white border-none backdrop-blur-xl rounded-2xl focus-visible:ring-0 focus:outline-none focus:ring-0 hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all duration-500 text-xl shadow-xl shadow-slate-200/50"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {countriesToShow.map((country, index) => (
          <Card 
            key={country.name.common} 
            className="group relative bg-white rounded-[2rem] overflow-hidden border-none shadow-2xl shadow-slate-200/40 hover:shadow-indigo-200/40 transition-all flex flex-col hover:-translate-y-3 animate-in fade-in zoom-in slide-in-from-bottom-5 duration-700 fill-mode-both"
            style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 100}ms` }}
          >
            {/* Flag Header */}
            <div className="h-56 relative overflow-hidden">
              <Image 
                src={country.flags.png} 
                alt={country.name.common} 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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

            </CardContent>
            
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-slate-900/5 rounded-[2rem] group-hover:ring-indigo-500/20 transition-all duration-500" />
          </Card>
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      {visibleCount < filteredCountries.length && (
        <div ref={loaderRef} className="flex justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm font-medium text-slate-400 animate-pulse">Discovering more nations...</p>
          </div>
        </div>
      )}

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

