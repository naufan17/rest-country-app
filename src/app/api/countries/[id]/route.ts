import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ id: string }> };

export const PUT = async (request: Request, { params }: Params) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, capital, region, flagUrl, population } = body;

    const country = await prisma.country.update({
      where: { id: Number(id) },
      data: {
        name,
        capital: capital || null,
        region,
        flagUrl: flagUrl || null,
        population: population ? parseInt(population, 10) : 0,
      },
    });

    return NextResponse.json(country);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const DELETE = async (_request: Request, { params }: Params) => {
  try {
    const { id } = await params;
    await prisma.country.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Country deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
