"use client";

import { useState, useEffect } from "react";
import { Eye, X, Loader2, User, Calendar, DollarSign, Shield, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

interface MT5Account {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    profileImage: string;
  };
  telegramUsername: string;
  server: string;
  mt5Login: string;
  accountType: 'demo' | 'real';
  status: 'connected' | 'disconnected' | 'expired';
  startDate?: string;
  expirationDate?: string;
  subscriptionPlan?: string | null;
  subscriptionStartDate?: string | null;
  subscriptionExpiryDate?: string | null;
  balance: number;
  equity: number;
  currency: string;
  connectedAt: string;
  createdAt: string;
  canTrade: boolean;
}

export default function AdminMT5AccountsPage() {
  const [mt5Accounts, setMT5Accounts] = useState<MT5Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<MT5Account | null>(null);

  useEffect(() => {
    fetchMT5Accounts();
  }, []);

  const fetchMT5Accounts = async () => {
    try {
      const response = await fetch('/api/admin/mt5-accounts');
      const data = await response.json();
      if (response.ok) {
        setMT5Accounts(data.mt5Accounts);
      } else {
        toast.error('Failed to fetch MT5 accounts');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch MT5 accounts');
    } finally {
      setLoading(false);
    }
  };

  const toggleCanTrade = async (accountId: string) => {
    setActionLoading(accountId);
    try {
      const response = await fetch(`/api/admin/mt5-accounts/${accountId}/toggle-can-trade`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Trading ${data.canTrade ? 'enabled' : 'disabled'} successfully`);
        fetchMT5Accounts();
        if (selectedAccount && selectedAccount._id === accountId) {
          setSelectedAccount({ ...selectedAccount, canTrade: data.canTrade });
        }
      } else {
        toast.error(data.error || 'Failed to toggle trading status');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error('Failed to toggle trading status');
    } finally {
      setActionLoading(null);
    }
  };

  const viewDetails = (account: MT5Account) => {
    setSelectedAccount(account);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'disconnected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'expired':
        return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
      default:
        return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white text-neutral-950 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
            MT5 Accounts
          </h1>
          <p className="text-neutral-500 text-sm">
            Manage all connected MT5 trading accounts
          </p>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
          </div>
        ) : mt5Accounts.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            No MT5 accounts found
          </div>
        ) : (
          <div className="bg-neutral-950 border-2 border-black rounded-xl overflow-hidden shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950">
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      User
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      MT5 Login
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      Server
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      Type
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      Status
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      Balance
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      Can Trade
                    </th>
                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mt5Accounts.map((account) => (
                    <tr key={account._id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-neutral-800 overflow-hidden flex-shrink-0">
                            {account.userId?.profileImage ? (
                              <img
                                src={account.userId.profileImage}
                                alt={account.userId.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs font-bold rounded-full">
                                {account.userId?.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">{account.userId?.username || 'Unknown'}</span>
                            <span className="text-xs text-neutral-400">{account.userId?.email || 'Unknown'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-mono text-white">{account.mt5Login}</td>
                      <td className="p-4 text-sm text-white">{account.server}</td>
                      <td className="p-4">
                        <span className="text-[9px] px-2 py-1 font-black border rounded-full bg-blue-500/10 text-blue-500 border-blue-500/20">
                          {account.accountType.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[9px] px-2 py-1 font-black border rounded-full ${getStatusColor(account.status)}`}>
                          {account.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-mono text-emerald-400">
                        {account.currency} {account.balance.toLocaleString()}
                      </td>
                      <td className="p-4">
                        {account.canTrade ? (
                          <ToggleRight className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-red-500" />
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => viewDetails(account)}
                          className="cursor-pointer p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors rounded-xl"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Account Details Modal */}
      {showDetailsModal && selectedAccount && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="bg-neutral-950 border-2 border-black rounded-xl shadow-none w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 cursor-pointer text-neutral-400 hover:text-white z-10 p-2 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-neutral-800">
                <div className="w-16 h-16 rounded-xl bg-neutral-800 overflow-hidden flex-shrink-0">
                  {selectedAccount.userId?.profileImage ? (
                    <img
                      src={selectedAccount.userId.profileImage}
                      alt={selectedAccount.userId.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xl font-bold rounded-full">
                      {selectedAccount.userId?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                    {selectedAccount.userId?.username || 'Unknown'}
                  </h2>
                  <p className="text-sm text-neutral-400">{selectedAccount.userId?.email || 'Unknown'}</p>
                  <p className="text-xs text-neutral-500 mt-1">Telegram: @{selectedAccount.telegramUsername}</p>
                </div>
              </div>

              {/* Account Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-900 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wider">
                    <User className="w-4 h-4" />
                    MT5 Login
                  </div>
                  <p className="text-lg font-mono font-bold text-white">{selectedAccount.mt5Login}</p>
                </div>

                <div className="bg-neutral-900 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wider">
                    <Shield className="w-4 h-4" />
                    Server
                  </div>
                  <p className="text-sm font-bold text-white">{selectedAccount.server}</p>
                </div>

                <div className="bg-neutral-900 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wider">
                    <DollarSign className="w-4 h-4" />
                    Balance
                  </div>
                  <p className="text-lg font-mono font-bold text-emerald-400">
                    {selectedAccount.currency} {selectedAccount.balance.toLocaleString()}
                  </p>
                </div>

                <div className="bg-neutral-900 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wider">
                    <DollarSign className="w-4 h-4" />
                    Equity
                  </div>
                  <p className="text-lg font-mono font-bold text-white">
                    {selectedAccount.currency} {selectedAccount.equity.toLocaleString()}
                  </p>
                </div>

                <div className="bg-neutral-900 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wider">
                    <Calendar className="w-4 h-4" />
                    Account Type
                  </div>
                  <p className="text-sm font-bold text-white">{selectedAccount.accountType.toUpperCase()}</p>
                </div>

                <div className="bg-neutral-900 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wider">
                    <Shield className="w-4 h-4" />
                    Status
                  </div>
                  <span className={`text-[9px] px-2 py-1 font-black border rounded-full ${getStatusColor(selectedAccount.status)}`}>
                    {selectedAccount.status.toUpperCase()}
                  </span>
                </div>

                {selectedAccount.accountType === 'demo' && (
                  <>
                    <div className="bg-neutral-900 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wider">
                        <Calendar className="w-4 h-4" />
                        Start Date
                      </div>
                      <p className="text-sm text-white">{formatDate(selectedAccount.startDate)}</p>
                    </div>

                    <div className="bg-neutral-900 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wider">
                        <Calendar className="w-4 h-4" />
                        Expiration Date
                      </div>
                      <p className="text-sm text-white">{formatDate(selectedAccount.expirationDate)}</p>
                    </div>
                  </>
                )}

                {selectedAccount.accountType === 'real' && selectedAccount.subscriptionPlan && (
                  <>
                    <div className="bg-neutral-900 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wider">
                        <Shield className="w-4 h-4" />
                        Subscription Plan
                      </div>
                      <p className="text-sm font-bold text-white">{selectedAccount.subscriptionPlan}</p>
                    </div>

                    <div className="bg-neutral-900 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wider">
                        <Calendar className="w-4 h-4" />
                        Subscription Expiry
                      </div>
                      <p className="text-sm text-white">{formatDate(selectedAccount.subscriptionExpiryDate)}</p>
                    </div>
                  </>
                )}

                <div className="bg-neutral-900 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wider">
                    <Calendar className="w-4 h-4" />
                    Connected At
                  </div>
                  <p className="text-sm text-white">{formatDate(selectedAccount.connectedAt)}</p>
                </div>

                <div className="bg-neutral-900 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-wider">
                    <Calendar className="w-4 h-4" />
                    Created At
                  </div>
                  <p className="text-sm text-white">{formatDate(selectedAccount.createdAt)}</p>
                </div>
              </div>

              {/* Can Trade Toggle Action */}
              <div className="bg-neutral-900 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${selectedAccount.canTrade ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    {selectedAccount.canTrade ? (
                      <ToggleRight className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Trading Permission</p>
                    <p className="text-xs text-neutral-400">
                      {selectedAccount.canTrade ? 'This account can trade' : 'Trading is disabled for this account'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleCanTrade(selectedAccount._id)}
                  disabled={actionLoading === selectedAccount._id}
                  className="cursor-pointer px-6 py-3 font-black font-mono text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-2 bg-white hover:bg-neutral-200 text-neutral-950 disabled:opacity-50"
                >
                  {actionLoading === selectedAccount._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      {selectedAccount.canTrade ? 'Disable Trading' : 'Enable Trading'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
