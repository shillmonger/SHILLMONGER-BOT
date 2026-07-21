"use client";

import { useState, useEffect } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface CopyJob {
  _id: string;
  master_order_ticket: number;
  state: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  users_processed: number;
  users_failed: number;
  started_at: string;
  finished_at?: string;
}

export default function CopyJobsPage() {
  const [copyJobs, setCopyJobs] = useState<CopyJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingAll, setDeletingAll] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchCopyJobs();
  }, []);

  const fetchCopyJobs = async () => {
    try {
      const response = await fetch('/api/admin/copy-jobs');
      const data = await response.json();
      if (response.ok) {
        setCopyJobs(data.copyJobs);
      } else {
        toast.error('Failed to fetch copy jobs');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch copy jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = () => {
    setShowConfirmModal(true);
  };

  const confirmDeleteAll = async () => {
    setDeletingAll(true);
    try {
      const response = await fetch('/api/admin/copy-jobs', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        fetchCopyJobs();
      } else {
        toast.error(data.error || 'Failed to delete copy jobs');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete copy jobs');
    } finally {
      setDeletingAll(false);
      setShowConfirmModal(false);
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'IN_PROGRESS':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse';
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'FAILED':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
    }
  };

  return (
    <div className="text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-black font-black uppercase tracking-tighter mb-2">
              Copy Jobs
            </h1>
            <p className="text-neutral-400 text-sm">
              View and manage all copy job execution records
            </p>
          </div>
          <button
            onClick={handleDeleteAll}
            disabled={loading || copyJobs.length === 0 || deletingAll}
            className="cursor-pointer font-black font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-none transition-all duration-300 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white border border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deletingAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete All
              </>
            )}
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
          </div>
        ) : copyJobs.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            No copy jobs found
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-none overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950">
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Master Ticket
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      State
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Users Processed
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Users Failed
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Started At
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Finished At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {copyJobs.map((job) => (
                    <tr key={job._id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                      <td className="p-4 text-sm font-mono">{job.master_order_ticket}</td>
                      <td className="p-4">
                        <span className={`text-[9px] px-2 py-1 font-black border ${getStateColor(job.state)}`}>
                          {job.state}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-mono text-emerald-400">{job.users_processed}</td>
                      <td className="p-4 text-sm font-mono text-rose-400">{job.users_failed}</td>
                      <td className="p-4 text-sm text-neutral-400">
                        {new Date(job.started_at).toLocaleString()}
                      </td>
                      <td className="p-4 text-sm text-neutral-400">
                        {job.finished_at ? new Date(job.finished_at).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="bg-neutral-950 border-2 border-white rounded-none shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-black uppercase tracking-tighter">
                  Confirm Delete All
                </h2>
              </div>
              <p className="text-sm text-neutral-300">
                Are you sure you want to delete ALL copy jobs? This action cannot be undone.
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 cursor-pointer font-black font-mono text-xs uppercase tracking-wider py-3 rounded-none transition-all duration-300 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAll}
                  className="flex-1 cursor-pointer font-black font-mono text-xs uppercase tracking-wider py-3 rounded-none transition-all duration-300 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white border border-red-500"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
