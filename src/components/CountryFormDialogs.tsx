'use client';

import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Country } from '@prisma/client';
import { Save, Pencil, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';

const countrySchema = z.object({
  cca3: z.string().min(1, 'CCA3 is required').max(3, 'Max 3 chars').toUpperCase(),
  name: z.string().min(1, 'Name is required'),
  capital: z.string().optional(),
  region: z.string().min(1, 'Region is required'),
  flagUrl: z.union([z.string().url('Must be a valid URL'), z.literal('')]).optional(),
  population: z.coerce.number().min(0, 'Must be 0 or greater').optional(),
});

type CountryFormData = z.infer<typeof countrySchema>;
type CountryFormInput = z.input<typeof countrySchema>;

interface CountryFormDialogsProps {
  createOpen: boolean;
  onCreateClose: () => void;
  editTarget: Country | null;
  onEditClose: () => void;
  deleteTarget: Country | null;
  onDeleteClose: () => void;
  onCreated: (country: Country) => void;
  onUpdated: (country: Country) => void;
  onDeleted: (id: number) => void;
}

const ErrorBanner = ({ message }: { message: string }) => {
  if (!message) return null;
  return (
    <p className="mt-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 flex items-center gap-2">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      {message}
    </p>
  );
}

const CountryFormInner = ({
  data,
  isEdit,
  onSuccess,
  onClose,
  submitLabel,
  SubmitIcon,
}: {
  data?: Country | null;
  isEdit: boolean;
  onSuccess: (country: Country) => void;
  onClose: () => void;
  submitLabel: string;
  SubmitIcon: React.ElementType;
}) => {
  const router = useRouter();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CountryFormInput, unknown, CountryFormData>({
    resolver: zodResolver(countrySchema),
    defaultValues: {
      cca3: data?.cca3 ?? '',
      name: data?.name ?? '',
      capital: data?.capital ?? '',
      region: data?.region ?? '',
      flagUrl: data?.flagUrl ?? '',
      population: data?.population ?? 0,
    },
  });

  useEffect(() => {
    reset({
      cca3: data?.cca3 ?? '',
      name: data?.name ?? '',
      capital: data?.capital ?? '',
      region: data?.region ?? '',
      flagUrl: data?.flagUrl ?? '',
      population: data?.population ?? 0,
    });
  }, [data, reset]);

  const onSubmit = async (values: CountryFormData) => {
    setFormError('');

    try {
      const endpoint = isEdit && data ? `/api/countries/${data.id}` : '/api/countries';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const err = await res.json();
        setFormError(err.error ?? (isEdit ? 'Failed to update country.' : 'Failed to create country.'));
        return;
      }
      
      const savedCountry: Country = await res.json();
      onSuccess(savedCountry);
      onClose();
      router.refresh();
    } catch {
      setFormError('Network error. Please try again.');
    }
  };

  const FIELDS: { label: string; key: keyof CountryFormData; placeholder: string; type?: string }[] = [
    { label: 'CCA3 Code', key: 'cca3', placeholder: 'e.g. IDN', type: 'text' },
    { label: 'Country Name', key: 'name', placeholder: 'e.g. Indonesia' },
    { label: 'Capital', key: 'capital', placeholder: 'e.g. Jakarta' },
    { label: 'Region', key: 'region', placeholder: 'e.g. Asia' },
    { label: 'Flag URL', key: 'flagUrl', placeholder: 'https://…' },
    { label: 'Population', key: 'population', placeholder: 'e.g. 270000000', type: 'number' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogBody>
        <div className="space-y-4">
          {FIELDS.map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                {label}
              </label>
              <input
                type={type ?? 'text'}
                placeholder={placeholder}
                disabled={isEdit && key === 'cca3'}
                className={cn(
                  'w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500',
                  (isEdit && key === 'cca3') || isSubmitting
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300',
                  errors[key] && 'border-rose-500 focus:ring-rose-500/40 focus:border-rose-500'
                )}
                {...register(key)}
              />
              {errors[key] && (
                <p className="text-xs text-rose-500 mt-1">{errors[key]?.message}</p>
              )}
            </div>
          ))}
        </div>
        <ErrorBanner message={formError} />
      </DialogBody>
      <DialogFooter>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "flex items-center gap-2 px-5 py-2 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-60",
            isEdit ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"
          )}
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <SubmitIcon className="w-4 h-4" />}
          {isSubmitting ? (isEdit ? 'Updating…' : 'Saving…') : submitLabel}
        </button>
      </DialogFooter>
    </form>
  );
}

const CountryFormDialogs = ({
  createOpen,
  onCreateClose,
  editTarget,
  onEditClose,
  deleteTarget,
  onDeleteClose,
  onCreated,
  onUpdated,
  onDeleted,
}: CountryFormDialogsProps) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    setDeleteError('');
    try {
      const res = await fetch(`/api/countries/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        setDeleteError(err.error ?? 'Failed to delete country.');
        return;
      }
      onDeleted(deleteTarget.id);
      onDeleteClose();
      router.refresh();
    } catch {
      setDeleteError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={createOpen} onClose={onCreateClose} size="md">
        <DialogHeader
          title="Add New Country"
          description="Fill in the details below to add a new country to the database."
          onClose={onCreateClose}
        />
        {createOpen && (
          <CountryFormInner
            isEdit={false}
            onSuccess={onCreated}
            onClose={onCreateClose}
            submitLabel="Save Country"
            SubmitIcon={Save}
          />
        )}
      </Dialog>

      <Dialog open={!!editTarget} onClose={onEditClose} size="md">
        <DialogHeader
          title={`Edit — ${editTarget?.name ?? ''}`}
          description="Update the country details. CCA3 code cannot be changed."
          onClose={onEditClose}
        />
        {!!editTarget && (
          <CountryFormInner
            data={editTarget}
            isEdit={true}
            onSuccess={onUpdated}
            onClose={onEditClose}
            submitLabel="Update Country"
            SubmitIcon={Pencil}
          />
        )}
      </Dialog>

      <Dialog open={!!deleteTarget} onClose={onDeleteClose} size="sm">
        <DialogHeader title="Confirm Deletion" onClose={onDeleteClose} />
        <DialogBody className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="p-4 bg-rose-50 rounded-full border border-rose-100">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-base">
              Delete &quot;{deleteTarget?.name}&quot;?
            </p>
            <p className="text-slate-500 text-sm mt-1">
              This action is permanent and cannot be undone.
            </p>
          </div>
          <ErrorBanner message={deleteError} />
        </DialogBody>
        <DialogFooter>
          <button
            onClick={onDeleteClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {submitting ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default CountryFormDialogs;