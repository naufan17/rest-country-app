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

export const POST = async () => {
  const CHUNK_SIZE = 25;

  try {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,flags,population,cca3');
    if (!res.ok) throw new Error('Failed to fetch from external API');
    
    const countries: CountryApiData[] = await res.json();

    for (let i = 0; i < countries.length; i += CHUNK_SIZE) {
      const chunk = countries.slice(i, i + CHUNK_SIZE);
      await prisma.$transaction(
        chunk.map((c) => 
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

    }

    await prisma.syncLog.create({
      data: {
        count: countries.length,
      }
    });
    
    return NextResponse.json({ 
      message: 'Synced successfully', 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('❌ Sync Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
