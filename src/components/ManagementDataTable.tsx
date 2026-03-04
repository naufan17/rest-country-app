'use client';

import Image from 'next/image';
import { useState, useMemo, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Search, Filter, ArrowUpDown, Database, ChevronDown, Calendar, RefreshCcw, Plus, Pencil, Trash2 } from 'lucide-react';
import { Country } from '@prisma/client';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { Badge } from '@/components/ui/badge';
import CountryFormDialogs from '@/components/CountryFormDialogs';

interface ManagementDataTableProps {
  initialCountries: (Country & { currency?: string | null })[];
}

type SortField = 'name' | 'population' | 'cca3' | 'id' | 'createdAt' | 'updatedAt' | 'currency';
type SortOrder = 'asc' | 'desc';

const ManagementDataTable = ({ initialCountries }: ManagementDataTableProps) => {
  const [countries, setCountries] = useState(initialCountries);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLTableRowElement>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Country | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Country | null>(null);

  const regions = useMemo(() => {
    const uniqueRegions = new Set(countries.map((c) => c.region ?? 'Unknown'));
    return ['all', ...Array.from(uniqueRegions)].sort();
  }, [countries]);

  const filteredAndSortedCountries = useMemo(() => {
    const result = countries.filter((country) => {
      const sv = debouncedSearchTerm.toLowerCase();
      const matchesSearch =
        country.name.toLowerCase().includes(sv) ||
        country.cca3.toLowerCase().includes(sv) ||
        (country.capital?.toLowerCase() ?? '').includes(sv);
      const matchesRegion = selectedRegion === 'all' || (country.region ?? 'Unknown') === selectedRegion;
      return matchesSearch && matchesRegion;
    });

    result.sort((a, b) => {
      let valA = a[sortField as keyof Country];
      let valB = b[sortField as keyof Country];
      if (valA === null || valA === undefined) valA = '';
      if (valB === null || valB === undefined) valB = '';
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ?  1 : -1;
      return 0;
    });

    return result;
  }, [countries, debouncedSearchTerm, selectedRegion, sortField, sortOrder]);

  const displayedCountries = filteredAndSortedCountries.slice(0, visibleCount);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setVisibleCount(15);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoadingMore && visibleCount < filteredAndSortedCountries.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 15);
            setIsLoadingMore(false);
          }, 500);
        }
      },
      { root: null, rootMargin: '20px', threshold: 1.0 }
    );
    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);
    return () => { if (currentLoader) observer.unobserve(currentLoader); };
  }, [isLoadingMore, visibleCount, filteredAndSortedCountries.length]);

  const openCreate = () => {
    setCreateOpen(true);
  };

  const openEdit = (country: Country) => {
    setEditTarget(country);
  };

  const openDelete = (country: Country) => {
    setDeleteTarget(country);
  };
  
  const handleCreated = (created: Country) => {
    setCountries((prev) => [created, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleUpdated = (updated: Country) => {
    setCountries((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleted = (id: number) => {
    setCountries((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, code, or capital..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(15); }}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all w-full md:w-64"
              />
            </div>

            {/* Region Filter */}
            <div className="relative group">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <select
                value={selectedRegion}
                onChange={(e) => { setSelectedRegion(e.target.value); setVisibleCount(15); }}
                className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all cursor-pointer hover:bg-slate-50"
              >
                <option value="all">All Regions</option>
                {regions.filter((r) => r !== 'all').map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 font-bold">
              {filteredAndSortedCountries.length} Records found
            </span>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Country
            </button>
          </div>
        </div>

        {/* Table */}
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
                  <th className="px-6 py-4 font-semibold text-slate-500 text-[10px] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('name')}>
                    <div className="flex items-center gap-1.5">Name <ArrowUpDown className={cn('w-3 h-3', sortField === 'name' ? 'text-indigo-600' : 'text-slate-300')} /></div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-[10px] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('cca3')}>
                    <div className="flex items-center gap-1.5">CCA3 <ArrowUpDown className={cn('w-3 h-3', sortField === 'cca3' ? 'text-indigo-600' : 'text-slate-300')} /></div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-[10px]">Capital</th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-[10px] text-right cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('population')}>
                    <div className="flex items-center justify-end gap-1.5">Population <ArrowUpDown className={cn('w-3 h-3', sortField === 'population' ? 'text-indigo-600' : 'text-slate-300')} /></div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-[10px]">Region</th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-[10px] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('createdAt')}>
                    <div className="flex items-center gap-1.5">Created <ArrowUpDown className={cn('w-3 h-3', sortField === 'createdAt' ? 'text-indigo-600' : 'text-slate-300')} /></div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-[10px] cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('updatedAt')}>
                    <div className="flex items-center gap-1.5">Updated <ArrowUpDown className={cn('w-3 h-3', sortField === 'updatedAt' ? 'text-indigo-600' : 'text-slate-300')} /></div>
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-500 text-[10px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 animate-in fade-in duration-700">
                {displayedCountries.map((country) => (
                  <tr key={country.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-6 py-4">
                      {country.flagUrl ? (
                        <div className="relative w-10 h-6 rounded-md overflow-hidden shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                          <Image src={country.flagUrl} alt={`${country.name} flag`} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-6 bg-slate-100 rounded-md flex items-center justify-center text-slate-300 text-[10px]">N/A</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{country.name}</td>
                    <td className="px-6 py-4">
                      <code className="bg-slate-100 px-2 py-0.5 rounded-lg text-xs text-slate-600 font-mono border border-slate-200">{country.cca3}</code>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{country.capital || '-'}</td>
                    <td className="px-6 py-4 text-right text-slate-600 font-bold tracking-tight">
                      {country.population?.toLocaleString() ?? '0'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase shadow-inner">
                        {country.region ?? 'Unknown'}
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
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => openEdit(country)}
                          title="Edit country"
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors border border-amber-100 cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDelete(country)}
                          title="Delete country"
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors border border-rose-100 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Skeleton rows while loading more */}
                {isLoadingMore && Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="animate-pulse bg-slate-50/30">
                    {Array.from({ length: 9 }).map((_, ci) => (
                      <td key={ci} className="px-6 py-4">
                        <div className="h-4 bg-slate-200 rounded w-full max-w-[80px]" />
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Invisible sentinel for IntersectionObserver */}
                {visibleCount < filteredAndSortedCountries.length && !isLoadingMore && (
                  <tr ref={loaderRef} className="h-10">
                    <td colSpan={9} className="text-center opacity-0 pointer-events-none">Loader</td>
                  </tr>
                )}

                {/* Empty state */}
                {filteredAndSortedCountries.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-20 text-center text-slate-500 bg-slate-50/30">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-4 bg-white rounded-full border border-slate-200 shadow-sm animate-pulse">
                          <Database className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="font-semibold text-slate-400">No matching records discovered.</p>
                        <button
                          onClick={() => { setSearchTerm(''); setSelectedRegion('all'); setVisibleCount(15); }}
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

      <CountryFormDialogs
        createOpen={createOpen}
        onCreateClose={() => setCreateOpen(false)}
        editTarget={editTarget}
        onEditClose={() => setEditTarget(null)}
        deleteTarget={deleteTarget}
        onDeleteClose={() => setDeleteTarget(null)}
        onCreated={handleCreated}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
      />
    </>
  );
};

export default ManagementDataTable;
