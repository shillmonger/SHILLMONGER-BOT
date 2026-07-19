"use client";

import { useState, useEffect } from "react";
import { Check, X, Trash2, Eye, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Subscription {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    profileImage: string;
  };
  planType: string;
  amount: number;
  accountSize: string;
  duration: string;
  lotSize: string;
  maxTrades: number;
  targetLabel: string;
  tradingVolume: string;
  screenshotUrl: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  startDate: string;
  expirationDate: string;
  createdAt: string;
}

export default function AdminSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<{ id: string; action: 'approve' | 'reject' | 'delete' } | null>(null);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/admin/subscriptions');
      const data = await response.json();
      if (response.ok) {
        setSubscriptions(data.subscriptions);
      } else {
        toast.error('Failed to fetch subscriptions');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (id: string, action: 'approve' | 'reject' | 'delete') => {
    setSelectedAction({ id, action });
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    if (!selectedAction) return;

    setActionLoading(selectedAction.id);
    const { id, action } = selectedAction;

    try {
      let url = '';
      if (action === 'approve') {
        url = `/api/admin/subscriptions/${id}/approve`;
      } else if (action === 'reject') {
        url = `/api/admin/subscriptions/${id}/reject`;
      } else if (action === 'delete') {
        url = `/api/admin/subscriptions/${id}`;
      }

      const response = await fetch(url, {
        method: action === 'delete' ? 'DELETE' : 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Subscription ${action}d successfully`);
        fetchSubscriptions();
      } else {
        toast.error(data.error || `Failed to ${action} subscription`);
      }
    } catch (error) {
      console.error('Action error:', error);
      toast.error(`Failed to ${action} subscription`);
    } finally {
      setActionLoading(null);
      setShowConfirmModal(false);
      setSelectedAction(null);
    }
  };

  const viewScreenshot = (url: string) => {
    setSelectedScreenshot(url);
    setShowScreenshotModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'expired':
        return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
    }
  };

  return (
    <div className="text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-black font-black uppercase tracking-tighter mb-2">
            Subscription
          </h1>
          <p className="text-neutral-400 text-sm">
            Manage and review all subscription requests
          </p>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            No subscriptions found
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-none overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950">
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      User
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Plan
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Amount
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Account Size
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Duration
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Status
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Start Date
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Expires
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Screenshot
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub._id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-none bg-neutral-800 overflow-hidden flex-shrink-0">
                            {sub.userId?.profileImage ? (
                              <img
                                src={sub.userId.profileImage}
                                alt={sub.userId.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs font-bold">
                                {sub.userId?.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">{sub.userId?.username || 'Unknown'}</span>
                            <span className="text-xs text-neutral-400">{sub.userId?.email || 'Unknown'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-bold">{sub.planType}</td>
                      <td className="p-4 text-sm font-mono text-emerald-400">${sub.amount}</td>
                      <td className="p-4 text-sm">{sub.accountSize}</td>
                      <td className="p-4 text-sm">{sub.duration}</td>
                      <td className="p-4">
                        <span className={`text-[9px] px-2 py-1 font-black border ${getStatusColor(sub.status)}`}>
                          {sub.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-neutral-400">
                        {new Date(sub.startDate).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-neutral-400">
                        {new Date(sub.expirationDate).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => viewScreenshot(sub.screenshotUrl)}
                          className="cursor-pointer p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {sub.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleAction(sub._id, 'approve')}
                                disabled={actionLoading === sub._id}
                                className="cursor-pointer p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 transition-colors disabled:opacity-50"
                              >
                                {actionLoading === sub._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleAction(sub._id, 'reject')}
                                disabled={actionLoading === sub._id}
                                className="cursor-pointer p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-colors disabled:opacity-50"
                              >
                                {actionLoading === sub._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleAction(sub._id, 'delete')}
                            disabled={actionLoading === sub._id}
                            className="cursor-pointer p-2 bg-neutral-500/10 hover:bg-neutral-500/20 text-neutral-400 border border-neutral-500/20 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === sub._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
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
      {showConfirmModal && selectedAction && (
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
                  Confirm Action
                </h2>
              </div>
              <p className="text-sm text-neutral-300">
                Are you sure you want to {selectedAction.action} this subscription?
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 cursor-pointer font-black font-mono text-xs uppercase tracking-wider py-3 rounded-none transition-all duration-300 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className="flex-1 cursor-pointer font-black font-mono text-xs uppercase tracking-wider py-3 rounded-none transition-all duration-300 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white border border-red-500"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Modal */}
      {showScreenshotModal && selectedScreenshot && (
        <div
          className="fixed inset-0 z-500 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowScreenshotModal(false)}
        >
          <div
            className="bg-neutral-950 border-2 border-white rounded-none shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] w-full max-w-4xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowScreenshotModal(false)}
              className="absolute top-3 right-3 cursor-pointer text-neutral-400 hover:text-white z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="p-4">
              <img
                src={selectedScreenshot}
                alt="Transfer Screenshot"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
