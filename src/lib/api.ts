import { Country, SyncLog } from '@prisma/client';

function baseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
}

export interface GetCountriesOptions {
  orderBy?: 'name' | 'population' | 'createdAt';
  region?: string;
}


export async function getCountries(options: GetCountriesOptions = {}): Promise<Country[]> {
  const { orderBy = 'name', region } = options;

  const url = new URL(`${baseUrl()}/api/countries`);
  url.searchParams.set('orderBy', orderBy);
  if (region) url.searchParams.set('region', region);

  const res = await fetch(url.toString(), {
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `GET /api/countries failed with status ${res.status}`);
  }

  return res.json();
}

export async function getLastSyncLog(): Promise<SyncLog | null> {
  const res = await fetch(`${baseUrl()}/api/sync-log`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `GET /api/sync-log failed with status ${res.status}`);
  }

  return res.json();
}
