import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderBy = (searchParams.get('orderBy') ?? 'name') as 'name' | 'population' | 'createdAt';
    const region = searchParams.get('region');

    const countries = await prisma.country.findMany({
      where: region ? { region } : undefined,
      orderBy: { [orderBy]: 'asc' },
    });

    return NextResponse.json(countries);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cca3, name, capital, region, flagUrl, population } = body;

    if (!cca3 || !name || !region) {
      return NextResponse.json({ error: 'cca3, name, and region are required' }, { status: 400 });
    }

    const country = await prisma.country.create({
      data: {
        cca3: cca3.toUpperCase(),
        name,
        capital: capital || null,
        region,
        flagUrl: flagUrl || null,
        population: population ? parseInt(population, 10) : 0,
      },
    });

    return NextResponse.json(country, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'A country with this CCA3 code already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
