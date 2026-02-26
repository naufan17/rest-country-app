import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CountryApiData {
  cca3: string;
  name: { common: string };
  capital?: string[];
  region: string;
  flags: { png: string };
  population: number;
}

export async function POST() {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,flags,population,cca3');
    if (!res.ok) throw new Error('Failed to fetch from external API');
    
    const countries: CountryApiData[] = await res.json();

    // Perform upserts in a transaction for better performance in SQLite
    await prisma.$transaction(
      countries.map((c) => 
        prisma.country.upsert({
          where: { cca3: c.cca3 },
          update: {
            name: c.name.common,
            capital: c.capital?.[0] || null,
            region: c.region,
            flagUrl: c.flags.png,
            population: c.population,
          },
          create: {
            cca3: c.cca3,
            name: c.name.common,
            capital: c.capital?.[0] || null,
            region: c.region,
            flagUrl: c.flags.png,
            population: c.population,
          },
        })
      )
    );

    return NextResponse.json({ message: 'Synced successfully', count: countries.length });
  } catch (error: any) {
    console.error('Sync Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
