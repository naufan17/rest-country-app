'use client';

import Image from 'next/image';
import { Country } from '@prisma/client';
import { Badge } from '@/components/ui/badge';

interface DashboardTableProps {
  countries: Country[];
}

export default function DashboardTable({ countries }: DashboardTableProps) {
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
          {countries.map((country) => (
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
}
