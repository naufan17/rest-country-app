'use client';

import { useState } from 'react';
import { RefreshCw, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface SyncStatusProps {
  lastSyncAt: Date | null;
}

const SyncStatus = ({ lastSyncAt }: SyncStatusProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      if (!res.ok) throw new Error('Sync failed');
      
      await res.json();
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('Failed to sync countries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-slate-900 mb-1">Data Synchronization</h3>
        <p className="text-xs text-slate-500 flex items-center">
          <Calendar className="w-3 h-3 mr-1.5" />
          Last synced: {lastSyncAt ? format(new Date(lastSyncAt), 'PPP p') : 'Never'}
        </p>
      </div>
      <Button
        onClick={handleSync}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95 w-full sm:w-auto cursor-pointer"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Syncing...' : 'Sync Now'}
      </Button>
    </div>
  );
};

export default SyncStatus;
