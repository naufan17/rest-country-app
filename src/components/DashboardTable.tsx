'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Country } from '@prisma/client';
import { Badge } from '@/components/ui/badge';

interface DashboardTableProps {
  countries: Country[];
}

const DashboardTable = ({ countries }: DashboardTableProps) => {
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [prevCountries, setPrevCountries] = useState(countries);
  const loaderRef = useRef<HTMLTableRowElement>(null);

  if (countries !== prevCountries) {
    setPrevCountries(countries);
    setVisibleCount(15);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoadingMore && visibleCount < countries.length) {
          setIsLoadingMore(true);

          setTimeout(() => {
            setVisibleCount((prev) => prev + 15);
            setIsLoadingMore(false);
          }, 500);
        }
      },
      {
        root: null,
        rootMargin: '20px',
        threshold: 1.0,
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [isLoadingMore, visibleCount, countries.length]);

  const displayedCountries = countries.slice(0, visibleCount);
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 font-semibold text-slate-900">Flag</th>
            <th className="px-6 py-4 font-semibold text-slate-900">Name</th>
            <th className="px-6 py-4 font-semibold text-slate-900">CCA3</th>
            <th className="px-6 py-4 font-semibold text-slate-900">Capital</th>
            <th className="px-6 py-4 font-semibold text-slate-900">Region</th>
            <th className="px-6 py-4 font-semibold text-slate-900 text-right">Population</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {displayedCountries.map((country) => (
            <tr key={country.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                {country.flagUrl ? (
                  <div className="relative w-10 h-6 rounded overflow-hidden shadow-sm border border-slate-100">
                    <Image
                      src={country.flagUrl}
                      alt={`${country.name} flag`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-6 bg-slate-100 rounded" />
                )}
              </td>
              <td className="px-6 py-4 font-medium text-slate-900">{country.name}</td>
              <td className="px-6 py-4">
                <code className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-600 font-mono">
                  {country.cca3}
                </code>
              </td>
              <td className="px-6 py-4 text-slate-600">{country.capital || '-'}</td>
              <td className="px-6 py-4">
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-medium">
                  {country.region || 'Unknown'}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right text-slate-600 font-tabular-nums">
                {country.population?.toLocaleString() || '0'}
              </td>
            </tr>
          ))}

          {isLoadingMore && (
            Array.from({ length: 3 }).map((_, idx) => (
              <tr key={`skeleton-${idx}`} className="animate-pulse bg-slate-50/30">
                <td className="px-6 py-4"><div className="w-10 h-6 bg-slate-200 rounded-md"></div></td>
                <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-200 rounded"></div></td>
                <td className="px-6 py-4"><div className="h-5 w-12 bg-slate-200 rounded-lg"></div></td>
                <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 rounded"></div></td>
                <td className="px-6 py-4"><div className="h-5 w-16 bg-slate-200 rounded-full"></div></td>
                <td className="px-6 py-4 text-right"><div className="h-4 w-20 bg-slate-200 rounded ml-auto"></div></td>
              </tr>
            ))
          )}

          {visibleCount < countries.length && !isLoadingMore && (
            <tr ref={loaderRef} className="h-10">
              <td colSpan={6} className="text-center opacity-0 pointer-events-none">Loader Placeholder</td>
            </tr>
          )}
          {countries.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                No country data available. Click Sync to fetch data.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
