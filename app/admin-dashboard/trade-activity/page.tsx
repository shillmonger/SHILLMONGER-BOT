"use client";

import { useState, useEffect } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface TradeActivity {
  _id: string;
  user_id: string;
  master_order_ticket: number;
  user_order_ticket: number;
  user_entry_deal: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  entry: number;
  lot: number;
  sl: number;
  tp: number[];
  status: 'OPEN' | 'CLOSED' | 'RUNNING';
  created_at: string;
  profit?: number;
  closed_at?: string;
  updated_at?: string;
}

export default function TradeActivityPage() {
  const [tradeActivities, setTradeActivities] = useState<TradeActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingAll, setDeletingAll] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchTradeActivities();
  }, []);

  const fetchTradeActivities = async () => {
    try {
      const response = await fetch('/api/admin/trade-activity');
      const data = await response.json();
      if (response.ok) {
        setTradeActivities(data.tradeActivities);
      } else {
        toast.error('Failed to fetch trade activities');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch trade activities');
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
      const response = await fetch('/api/admin/trade-activity', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        fetchTradeActivities();
      } else {
        toast.error(data.error || 'Failed to delete trade activities');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete trade activities');
    } finally {
      setDeletingAll(false);
      setShowConfirmModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
      case 'RUNNING':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse';
      case 'CLOSED':
        return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BUY':
        return 'text-emerald-400';
      case 'SELL':
        return 'text-rose-400';
      default:
        return 'text-neutral-400';
    }
  };

  return (
    <div className="text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-black font-black uppercase tracking-tighter mb-2">
              Trade Activity
            </h1>
            <p className="text-neutral-400 text-sm">
              View and manage all user trade activities
            </p>
          </div>
          <button
            onClick={handleDeleteAll}
            disabled={loading || tradeActivities.length === 0 || deletingAll}
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
        ) : tradeActivities.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            No trade activities found
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-none overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950">
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      User ID
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Master Ticket
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      User Ticket
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Symbol
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Type
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Entry
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Lot
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      SL
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      TP
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Status
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Profit
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Created
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Closed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tradeActivities.map((trade) => (
                    <tr key={trade._id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                      <td className="p-4 text-sm font-mono">{trade.user_id}</td>
                      <td className="p-4 text-sm font-mono">{trade.master_order_ticket}</td>
                      <td className="p-4 text-sm font-mono">{trade.user_order_ticket || '—'}</td>
                      <td className="p-4 text-sm font-bold">{trade.symbol}</td>
                      <td className={`p-4 text-sm font-black ${getTypeColor(trade.type)}`}>{trade.type}</td>
                      <td className="p-4 text-sm font-mono">{trade.entry?.toFixed(2) || '—'}</td>
                      <td className="p-4 text-sm font-mono">{trade.lot?.toFixed(2) || '—'}</td>
                      <td className="p-4 text-sm font-mono">{trade.sl?.toFixed(2) || '—'}</td>
                      <td className="p-4 text-sm font-mono text-xs">{trade.tp?.join(', ') || '—'}</td>
                      <td className="p-4">
                        <span className={`text-[9px] px-2 py-1 font-black border ${getStatusColor(trade.status)}`}>
                          {trade.status}
                        </span>
                      </td>
                      <td className={`p-4 text-sm font-mono ${trade.profit != null && trade.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {trade.profit != null ? `${trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}` : '—'}
                      </td>
                      <td className="p-4 text-sm text-neutral-400">
                        {trade.created_at ? new Date(trade.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-4 text-sm text-neutral-400">
                        {trade.closed_at ? new Date(trade.closed_at).toLocaleDateString() : '—'}
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
                Are you sure you want to delete ALL trade activities? This action cannot be undone.
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
