import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, Search } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import PageShell from '../../components/layout/PageShell';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, PriorityBadge } from '../../components/complaint/StatusBadge';
import complaintService from '../../services/complaintService';
import { extractErrorMessage } from '../../services/apiClient';
import { formatDateTime } from '../../utils/formatDate';

export default function Track() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get('token') || '';
  const [trackingToken, setTrackingToken] = useState(initial);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const performTrack = async (token) => {
    if (!token?.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await complaintService.trackPublic(token.trim());
      setResult(data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Complaint not found'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initial) {
      performTrack(initial);
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trackingToken.trim()) return;
    setSearchParams({ token: trackingToken.trim() });
    performTrack(trackingToken.trim());
  };

  const trackerContent = (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-white to-emerald-50/60 px-6 py-7 sm:px-8">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-[17px] bg-brand-600 text-white shadow-md shadow-blue-200"><Search className="h-5 w-5" /></div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Find your latest update</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Enter the private tracking code you received when you submitted your complaint. Anyone with this code can view its status, so keep it safe.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-5 sm:flex-row sm:p-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={trackingToken}
              onChange={(e) => setTrackingToken(e.target.value)}
              placeholder="Paste your private tracking code"
              aria-label="Private tracking code"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            />
          </div>
          <Button type="submit" loading={loading} className="px-6 py-3">Track complaint</Button>
        </form>
      </div>

      {error && (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {result && (
        <div className="resolve-card space-y-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="font-mono text-lg font-bold text-brand-700">{result.complaintNumber}</div>
                <div className="text-xs text-slate-500">
                  Category: {result.categoryName || '—'} • Department: {result.departmentName || 'Pending routing'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={result.priority} />
                <StatusBadge status={result.status} />
                {result.escalated && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                    <AlertTriangle className="h-3.5 w-3.5" /> Escalated
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Submitted</div>
                <div className="font-medium text-slate-900">{formatDateTime(result.createdAt)}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs text-slate-500">SLA Target</div>
                <div className="font-medium text-slate-900">{formatDateTime(result.dueAt)}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="text-xs text-slate-500">Resolved</div>
                <div className="font-medium text-slate-900">{formatDateTime(result.resolvedAt)}</div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Status Milestones</h2>
              <ol className="space-y-3 border-l-2 border-slate-200 pl-4">
                {result.milestones?.map((m, idx) => (
                  <li key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-600 ring-4 ring-white" />
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium text-slate-900">{m.eventType.replace(/_/g, ' ')}</span>
                      {m.status && <StatusBadge status={m.status} />}
                    </div>
                    <div className="text-xs text-slate-500">{formatDateTime(m.timestamp)}</div>
                  </li>
                ))}
              </ol>
            </div>
        </div>
      )}
    </div>
  );

  if (user) {
    return <PageShell title="Public tracker" subtitle="Check status milestones with your private tracking code.">{trackerContent}</PageShell>;
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <Navbar />
      <main className="px-4 py-10 sm:py-14">{trackerContent}</main>
    </div>
  );
}

