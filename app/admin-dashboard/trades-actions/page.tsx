"use client";

import { useState, useEffect } from "react";
import { Loader2, X, AlertTriangle, XCircle, RefreshCw, Filter, User, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { toast } from "sonner";

interface OpenTrade {
  _id: string;
  master_order_ticket?: number;
  master_entry_deal?: number;
  user_order_ticket?: number;
  user_entry_deal?: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  entry: number;
  sl?: number;
  tp?: number[];
  lot: number;
  user_id?: string;
  account_info?: {
    mt5Login: number;
    server: string;
  };
  group_name?: string;
  created_at: string;
  status: 'OPEN' | 'CLOSED';
  profit?: number;
}

interface PendingOrder {
  ticket: number;
  user_id: string;
  mt5_login: number;
  server: string;
  symbol: string;
  type: number;
  type_str: string;
  volume: number;
  price: number;
  sl?: number;
  tp?: number;
  comment?: string;
  time_setup: number;
  expiration?: number;
}

export default function TradesActionsPage() {
  const [activeTab, setActiveTab] = useState<'open-trades' | 'pending-orders' | 'emergency'>('open-trades');
  const [openTrades, setOpenTrades] = useState<{ master_trades: OpenTrade[], trade_activities: OpenTrade[] }>({
    master_trades: [],
    trade_activities: []
  });
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'close-all' | 'cancel-all' | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch open trades
      const tradesResponse = await fetch('/api/admin/trades/open');
      const tradesData = await tradesResponse.json();
      if (tradesResponse.ok) {
        setOpenTrades(tradesData);
      } else {
        toast.error('Failed to fetch open trades');
      }

      // Fetch pending orders
      const pendingResponse = await fetch('/api/admin/trades/pending');
      const pendingData = await pendingResponse.json();
      if (pendingResponse.ok) {
        setPendingOrders(pendingData.pending_orders || []);
      } else {
        toast.error('Failed to fetch pending orders');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch trade data');
    } finally {
      setLoading(false);
    }
  };

  const closeTrade = async (ticket: number, userId?: string) => {
    setActionLoading(`close-${ticket}`);
    try {
      const response = await fetch('/api/admin/trades/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket, user_id: userId }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.error || 'Failed to close trade');
      }
    } catch (error) {
      console.error('Close trade error:', error);
      toast.error('Failed to close trade');
    } finally {
      setActionLoading(null);
    }
  };

  const cancelPendingOrder = async (ticket: number, userId?: string) => {
    setActionLoading(`cancel-${ticket}`);
    try {
      const response = await fetch('/api/admin/trades/cancel-pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket, user_id: userId }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      toast.error('Failed to cancel order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCloseAll = async () => {
    setConfirmAction('close-all');
    setShowConfirmModal(true);
  };

  const handleCancelAllPending = async () => {
    setConfirmAction('cancel-all');
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (confirmAction === 'close-all') {
      setActionLoading('close-all');
      try {
        const response = await fetch('/api/admin/trades/close-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_id: selectedUser === 'all' ? null : selectedUser,
            symbol: selectedSymbol === 'all' ? null : selectedSymbol 
          }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success(data.message);
          fetchData();
        } else {
          toast.error(data.error || 'Failed to close all trades');
        }
      } catch (error) {
        console.error('Close all error:', error);
        toast.error('Failed to close all trades');
      } finally {
        setActionLoading(null);
      }
    } else if (confirmAction === 'cancel-all') {
      setActionLoading('cancel-all');
      try {
        const response = await fetch('/api/admin/trades/cancel-all-pending', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            user_id: selectedUser === 'all' ? null : selectedUser,
            symbol: selectedSymbol === 'all' ? null : selectedSymbol 
          }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success(data.message);
          fetchData();
        } else {
          toast.error(data.error || 'Failed to cancel all orders');
        }
      } catch (error) {
        console.error('Cancel all error:', error);
        toast.error('Failed to cancel all orders');
      } finally {
        setActionLoading(null);
      }
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
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

  const getOrderTypeColor = (typeStr: string) => {
    if (typeStr.includes('BUY')) return 'text-emerald-400';
    if (typeStr.includes('SELL')) return 'text-rose-400';
    return 'text-neutral-400';
  };

  const getUniqueUsers = () => {
    const users = new Set<string>();
    openTrades.trade_activities.forEach(t => t.user_id && users.add(t.user_id));
    pendingOrders.forEach(o => o.user_id && users.add(o.user_id));
    return Array.from(users);
  };

  const getUniqueSymbols = () => {
    const symbols = new Set<string>();
    openTrades.master_trades.forEach(t => symbols.add(t.symbol));
    openTrades.trade_activities.forEach(t => symbols.add(t.symbol));
    pendingOrders.forEach(o => symbols.add(o.symbol));
    return Array.from(symbols);
  };

  const filteredTrades = () => {
    let trades = [...openTrades.master_trades, ...openTrades.trade_activities];
    if (selectedUser !== 'all') {
      trades = trades.filter(t => t.user_id === selectedUser);
    }
    if (selectedSymbol !== 'all') {
      trades = trades.filter(t => t.symbol === selectedSymbol);
    }
    return trades;
  };

  const filteredPendingOrders = () => {
    let orders = [...pendingOrders];
    if (selectedUser !== 'all') {
      orders = orders.filter(o => o.user_id === selectedUser);
    }
    if (selectedSymbol !== 'all') {
      orders = orders.filter(o => o.symbol === selectedSymbol);
    }
    return orders;
  };

  return (
    <div className="bg-white text-neutral-950 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
            Trades Actions
          </h1>
          <p className="text-neutral-500 text-sm">
            Monitor and manage open trades and pending orders across all accounts
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('open-trades')}
            className={`px-4 py-3 font-mono text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'open-trades'
                ? 'text-black border-b-2 border-black'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Open Trades
          </button>
          <button
            onClick={() => setActiveTab('pending-orders')}
            className={`px-4 py-3 font-mono text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'pending-orders'
                ? 'text-black border-b-2 border-black'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Pending Orders
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-4 py-3 font-mono text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'emergency'
                ? 'text-black border-b-2 border-black'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Emergency Controls
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400" />
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono"
            >
              <option value="all">All Users</option>
              {getUniqueUsers().map(userId => (
                <option key={userId} value={userId}>User {userId}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono"
            >
              <option value="all">All Symbols</option>
              {getUniqueSymbols().map(symbol => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchData}
            className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
          </div>
        ) : (
          <>
            {/* Open Trades Tab */}
            {activeTab === 'open-trades' && (
              <div className="bg-neutral-950 border-2 border-black rounded-xl overflow-hidden shadow-none">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-800 bg-neutral-950">
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Account
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Ticket
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Symbol
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Type
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Lot
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Entry
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          SL
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          TP
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Profit
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTrades().map((trade) => (
                        <tr key={trade._id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-neutral-400" />
                              <span className="text-sm font-mono text-white">
                                {trade.account_info ? `${trade.account_info.mt5Login}` : 'Master'}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-mono text-white">
                            {trade.user_order_ticket || trade.master_order_ticket || '—'}
                          </td>
                          <td className="p-4 text-sm font-bold text-white">{trade.symbol}</td>
                          <td className={`p-4 text-sm font-black ${getTypeColor(trade.type)}`}>
                            {trade.type}
                          </td>
                          <td className="p-4 text-sm font-mono text-white">{trade.lot?.toFixed(2) || '—'}</td>
                          <td className="p-4 text-sm font-mono text-white">{trade.entry?.toFixed(2) || '—'}</td>
                          <td className="p-4 text-sm font-mono text-white">{trade.sl?.toFixed(2) || '—'}</td>
                          <td className="p-4 text-sm font-mono text-xs text-white">
                            {trade.tp?.length ? trade.tp.map(t => t.toFixed(2)).join(', ') : '—'}
                          </td>
                          <td className={`p-4 text-sm font-mono ${trade.profit != null && trade.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {trade.profit != null ? `${trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}` : '—'}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => closeTrade(trade.user_order_ticket || trade.master_order_ticket || 0, trade.user_id)}
                              disabled={actionLoading === `close-${trade.user_order_ticket || trade.master_order_ticket}`}
                              className="cursor-pointer p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 transition-colors rounded-lg disabled:opacity-50"
                            >
                              {actionLoading === `close-${trade.user_order_ticket || trade.master_order_ticket}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredTrades().length === 0 && (
                  <div className="text-center py-12 text-neutral-500">
                    No open trades found
                  </div>
                )}
              </div>
            )}

            {/* Pending Orders Tab */}
            {activeTab === 'pending-orders' && (
              <div className="bg-neutral-950 border-2 border-black rounded-xl overflow-hidden shadow-none">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-800 bg-neutral-950">
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Account
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Ticket
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Symbol
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Type
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Volume
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Price
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          SL
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          TP
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Expiration
                        </th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPendingOrders().map((order) => (
                        <tr key={order.ticket} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-neutral-400" />
                              <span className="text-sm font-mono text-white">{order.mt5_login}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-mono text-white">{order.ticket}</td>
                          <td className="p-4 text-sm font-bold text-white">{order.symbol}</td>
                          <td className={`p-4 text-sm font-black ${getOrderTypeColor(order.type_str)}`}>
                            {order.type_str}
                          </td>
                          <td className="p-4 text-sm font-mono text-white">{order.volume?.toFixed(2) || '—'}</td>
                          <td className="p-4 text-sm font-mono text-white">{order.price?.toFixed(2) || '—'}</td>
                          <td className="p-4 text-sm font-mono text-white">{order.sl?.toFixed(2) || '—'}</td>
                          <td className="p-4 text-sm font-mono text-white">{order.tp?.toFixed(2) || '—'}</td>
                          <td className="p-4 text-sm text-neutral-400">
                            {order.expiration ? new Date(order.expiration * 1000).toLocaleString() : 'GTC'}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => cancelPendingOrder(order.ticket, order.user_id)}
                              disabled={actionLoading === `cancel-${order.ticket}`}
                              className="cursor-pointer p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 transition-colors rounded-lg disabled:opacity-50"
                            >
                              {actionLoading === `cancel-${order.ticket}` ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredPendingOrders().length === 0 && (
                  <div className="text-center py-12 text-neutral-500">
                    No pending orders found
                  </div>
                )}
                {filteredPendingOrders().length > 0 && (
                  <div className="p-4 border-t border-neutral-800">
                    <button
                      onClick={handleCancelAllPending}
                      disabled={actionLoading === 'cancel-all'}
                      className="cursor-pointer font-black font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50"
                    >
                      {actionLoading === 'cancel-all' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Cancel All Pending
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Emergency Controls Tab */}
            {activeTab === 'emergency' && (
              <div className="space-y-6">
                <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <h2 className="text-xl font-black uppercase tracking-tighter text-red-500">
                      Emergency Controls
                    </h2>
                  </div>
                  <p className="text-sm text-neutral-400 mb-6">
                    These actions will immediately close all trades or cancel all pending orders across all accounts (or filtered by your selection). Use with caution.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-500/20 rounded-xl">
                          <XCircle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">Close All Open Trades</h3>
                          <p className="text-xs text-neutral-400">
                            {filteredTrades().length} open trades will be closed
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleCloseAll}
                        disabled={actionLoading === 'close-all' || filteredTrades().length === 0}
                        className="w-full cursor-pointer font-black font-mono text-xs uppercase tracking-wider py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === 'close-all' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Closing...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Close All Trades
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-500/20 rounded-xl">
                          <Clock className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">Cancel All Pending Orders</h3>
                          <p className="text-xs text-neutral-400">
                            {filteredPendingOrders().length} pending orders will be cancelled
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleCancelAllPending}
                        disabled={actionLoading === 'cancel-all' || filteredPendingOrders().length === 0}
                        className="w-full cursor-pointer font-black font-mono text-xs uppercase tracking-wider py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === 'cancel-all' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            Cancel All Pending
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm text-neutral-400 uppercase tracking-wider">Open Trades</span>
                    </div>
                    <p className="text-3xl font-black text-white">{filteredTrades().length}</p>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-amber-500" />
                      <span className="text-sm text-neutral-400 uppercase tracking-wider">Pending Orders</span>
                    </div>
                    <p className="text-3xl font-black text-white">{filteredPendingOrders().length}</p>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-neutral-400 uppercase tracking-wider">Active Accounts</span>
                    </div>
                    <p className="text-3xl font-black text-white">{getUniqueUsers().length}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="bg-neutral-950 border-2 border-black rounded-xl shadow-none w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 cursor-pointer text-neutral-400 hover:text-white z-10 p-2 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">
                  Confirm {confirmAction === 'close-all' ? 'Close All' : 'Cancel All'}
                </h2>
              </div>
              <p className="text-sm text-neutral-300">
                {confirmAction === 'close-all' 
                  ? `Are you sure you want to close ALL open trades? This will close ${filteredTrades().length} trades across ${selectedUser === 'all' ? 'all accounts' : 'selected account'}. This action cannot be undone.`
                  : `Are you sure you want to cancel ALL pending orders? This will cancel ${filteredPendingOrders().length} orders across ${selectedUser === 'all' ? 'all accounts' : 'selected account'}. This action cannot be undone.`
                }
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 cursor-pointer font-black font-mono text-xs uppercase tracking-wider py-3 rounded-xl transition-all duration-300 flex items-center justify-center bg-neutral-800 hover:bg-neutral-700 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className="flex-1 cursor-pointer font-black font-mono text-xs uppercase tracking-wider py-3 rounded-xl transition-all duration-300 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white"
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
