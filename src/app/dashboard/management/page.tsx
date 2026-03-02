import { getCountries, getLastSyncLog } from '@/lib/api';
import SyncStatus from '@/components/SyncStatus';
import ManagementDataTable from '@/components/ManagementDataTable';

const ManagementPage = async () => {
  const [countries, lastSync] = await Promise.all([
    getCountries({ orderBy: 'name' }),
    getLastSyncLog(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Data Management</h2>
          <p className="text-slate-500 mt-1">Manage, update, and monitor synchronization of country data.</p>
        </div>
        <div className="w-full md:w-auto">
          <SyncStatus lastSyncAt={lastSync?.syncedAt || null} />
        </div>
      </div>

      <ManagementDataTable initialCountries={countries} />
    </div>
  );
};

export default ManagementPage;
