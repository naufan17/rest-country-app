'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Country } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Search, Filter, ArrowUpDown, Database, ChevronDown, CheckCircle2, XCircle, Calendar, RefreshCcw, Coins } from 'lucide-react';

interface ManagementDataTableProps {
  initialCountries: (Country & { currency?: string | null })[];
}

type SortField = 'name' | 'population' | 'cca3' | 'id' | 'independent' | 'createdAt' | 'updatedAt' | 'currency';
type SortOrder = 'asc' | 'desc';

export default function ManagementDataTable({ initialCountries }: ManagementDataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Extract regions for filter
  const regions = useMemo(() => {
    const uniqueRegions = new Set(initialCountries.map(c => c.region || 'Unknown'));
    return ['all', ...Array.from(uniqueRegions)].sort();
  }, [initialCountries]);

  // Filtering and Sorting logic
  const filteredAndSortedCountries = useMemo(() => {
    const result = initialCountries.filter(country => {
      const searchValue = searchTerm.toLowerCase();
      const matchesSearch = 
        country.name.toLowerCase().includes(searchValue) ||
        country.cca3.toLowerCase().includes(searchValue) ||
        (country.capital?.toLowerCase() || '').includes(searchValue);
      
      const matchesRegion = selectedRegion === 'all' || (country.region || 'Unknown') === selectedRegion;
      
      return matchesSearch && matchesRegion;
    });

    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (valA === null || valA === undefined) valA = '';
      if (valB === null || valB === undefined) valB = '';

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [initialCountries, searchTerm, selectedRegion, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, code, or capital..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all w-full md:w-64"
            />
          </div>

          {/* Region Filter */}
          <div className="relative group">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer hover:bg-slate-50"
            >
              <option value="all">All Regions</option>
              {regions.filter(r => r !== 'all').map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 font-bold">
            {filteredAndSortedCountries.length} Records found
          </span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in zoom-in duration-500">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
              <Database className="w-4 h-4 text-slate-600" />
            </div>
            <h3 className="font-bold text-slate-900 tracking-tight">Active Database Records</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold text-slate-500 text-[10px]">Flag</th>
                <th 
                  className="px-6 py-4 font-semibold text-slate-500 text-[10px] cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-1.5">
                    Name
                    <ArrowUpDown className={cn("w-3 h-3", sortField === 'name' ? "text-indigo-600" : "text-slate-300")} />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 font-semibold text-slate-500 text-[10px] cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => toggleSort('cca3')}
                >
                  <div className="flex items-center gap-1.5">
                    CCA3
                    <ArrowUpDown className={cn("w-3 h-3", sortField === 'cca3' ? "text-indigo-600" : "text-slate-300")} />
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-[10px]">Capital</th>
                <th 
                  className="px-6 py-4 font-semibold text-slate-500 text-[10px] text-right cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => toggleSort('population')}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    Population
                    <ArrowUpDown className={cn("w-3 h-3", sortField === 'population' ? "text-indigo-600" : "text-slate-300")} />
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-[10px]">Region</th>
                <th 
                  className="px-6 py-4 font-semibold text-slate-500 text-[10px] cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => toggleSort('createdAt')}
                >
                  <div className="flex items-center gap-1.5">
                    Created
                    <ArrowUpDown className={cn("w-3 h-3", sortField === 'createdAt' ? "text-indigo-600" : "text-slate-300")} />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 font-semibold text-slate-500 text-[10px] cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => toggleSort('updatedAt')}
                >
                  <div className="flex items-center gap-1.5">
                    Taken
                    <ArrowUpDown className={cn("w-3 h-3", sortField === 'updatedAt' ? "text-indigo-600" : "text-slate-300")} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 animate-in fade-in duration-700">
              {filteredAndSortedCountries.map((country) => (
                <tr key={country.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-6 py-4">
                    {country.flagUrl ? (
                      <div className="relative w-10 h-6 rounded-md overflow-hidden shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={country.flagUrl}
                          alt={`${country.name} flag`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-6 bg-slate-100 rounded-md" />
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{country.name}</td>
                  <td className="px-6 py-4">
                    <code className="bg-slate-100 px-2 py-0.5 rounded-lg text-xs text-slate-600 font-mono border border-slate-200">
                      {country.cca3}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{country.capital || '-'}</td>
                  <td className="px-6 py-4 text-right text-slate-600 font-bold tracking-tight">
                    {country.population?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase shadow-inner">
                      {country.region || 'Unknown'}
                    </Badge>
                  </td>                 
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium whitespace-nowrap">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {format(new Date(country.createdAt), 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium whitespace-nowrap">
                      <RefreshCcw className="w-3.5 h-3.5 text-amber-400" />
                      {format(new Date(country.updatedAt), 'HH:mm:ss')}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAndSortedCountries.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-20 text-center text-slate-500 bg-slate-50/30">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-4 bg-white rounded-full border border-slate-200 shadow-sm animate-pulse">
                        <Database className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-400">No matching records discovered.</p>
                      <button 
                        onClick={() => {setSearchTerm(''); setSelectedRegion('all');}}
                        className="text-indigo-600 font-bold text-xs hover:underline mt-2"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
