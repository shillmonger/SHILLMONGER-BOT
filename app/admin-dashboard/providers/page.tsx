"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Send,
  RefreshCw,
  Check,
  X,
  Loader2,
  Users,
  AlertCircle,
  Search
} from "lucide-react";
import { toast } from "sonner";

interface TelegramGroup {
  id: string;
  name: string;
  profile_image?: string;
}

interface SavedProvider {
  _id: string;
  groupId: string;
  groupName: string;
  profileImage: string;
  isActive: boolean;
}

export default function ProvidersPage() {
  const [greeting, setGreeting] = useState("Welcome");
  const [currentTime, setCurrentTime] = useState("");
  const [telegramGroups, setTelegramGroups] = useState<TelegramGroup[]>([]);
  const [savedProviders, setSavedProviders] = useState<SavedProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [botApiUrl, setBotApiUrl] = useState(process.env.NEXT_PUBLIC_BOT_API_URL || "http://localhost:8000");

  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting("Good Morning");
    else if (hrs < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    setCurrentTime(new Date().toLocaleDateString("en-US", options));

    // Load saved providers
    fetchSavedProviders();
  }, []);

  const fetchSavedProviders = async () => {
    setIsLoadingProviders(true);
    try {
      const response = await fetch('/api/admin/providers');
      const data = await response.json();
      if (response.ok) {
        setSavedProviders(data.providers);
      }
    } catch (error) {
      console.error('Error fetching saved providers:', error);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  const fetchTelegramGroups = async () => {
    setIsFetching(true);
    try {
      const response = await fetch('/api/admin/providers/fetch-groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ botApiUrl }),
      });

      const data = await response.json();
      console.log('Frontend received data:', data);

      if (response.ok) {
        const groups = data.groups || [];
        setTelegramGroups(groups);
        toast.success(`Fetched ${groups.length} Telegram groups`);
      } else {
        toast.error(data.error || 'Failed to fetch groups');
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to fetch groups from bot');
    } finally {
      setIsFetching(false);
    }
  };

  const saveProvider = async (group: TelegramGroup) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/providers/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId: group.id,
          groupName: group.name,
          profileImage: group.profile_image || '',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Provider saved successfully');
        // Remove from telegram groups list
        setTelegramGroups(telegramGroups.filter(g => g.id !== group.id));
        // Refresh saved providers
        await fetchSavedProviders();
      } else {
        toast.error(data.error || 'Failed to save provider');
      }
    } catch (error) {
      console.error('Error saving provider:', error);
      toast.error('Failed to save provider');
    } finally {
      setIsLoading(false);
    }
  };

  const removeProvider = async (groupId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/providers/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Provider removed successfully');
        // Refresh saved providers
        await fetchSavedProviders();
      } else {
        toast.error(data.error || 'Failed to remove provider');
      }
    } catch (error) {
      console.error('Error removing provider:', error);
      toast.error('Failed to remove provider');
    } finally {
      setIsLoading(false);
    }
  };

  const isProviderSaved = (groupId: string) => {
    return savedProviders.some(p => p.groupId === groupId);
  };

  const getSavedProvider = (groupId: string) => {
    return savedProviders.find(p => p.groupId === groupId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-950 font-sans">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-7xl space-y-8">
          
          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-2 border-black pb-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">
                {greeting}, Admin
              </p>
              <h1 className="text-4xl md:text-3xl font-mono font-black uppercase text-neutral-950 mb-2">
                Telegram Providers
              </h1>
            </div>
            <div className="bg-neutral-950 text-white border-2 border-black px-4 py-2 text-right shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
                System Time
              </span>
              <span className="text-xs font-mono font-bold">
                {currentTime || "July 18, 2026"}
              </span>
            </div>
          </div>

          {/* Bot Configuration */}
          <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="px-6 space-y-6">
              <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-tighter">
                  Bot Configuration
                </h2>
                <Send className="h-4 w-4 text-neutral-400" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-neutral-900/60 border border-neutral-800/80">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                      Bot API URL
                    </p>
                    <p className="text-sm font-mono text-neutral-50">{botApiUrl}</p>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Connected
                  </span>
                </div>


<div className="w-full flex flex-col sm:flex-row gap-4">
  {/* Fetch Groups Button */}
  <Button
    onClick={fetchTelegramGroups}
    disabled={isFetching}
    className="flex-1 h-12 bg-neutral-50 text-neutral-950 rounded-none font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] cursor-pointer"
  >
    {isFetching ? (
      <>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Fetching Groups...
      </>
    ) : (
      <>
        <RefreshCw className="w-4 h-4 mr-2" />
        Fetch TG Groups / Channels
      </>
    )}
  </Button>

  {/* Open Telegram Button */}
  <Button
    onClick={() => window.open("tg://", "_self")}
    className="flex-1 h-12 bg-[#229ED9] text-white rounded-none font-black text-xs uppercase tracking-widest hover:bg-[#1d8cc2] transition-colors shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] cursor-pointer"
  >
    <Send className="w-4 h-4 mr-2" />
    Open Telegram
  </Button>
</div>
              </div>
            </CardContent>
          </Card>

          {/* Available Telegram Groups */}
          {telegramGroups.length > 0 && (
            <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="px-6 space-y-6">
                <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-tighter">
                    Available Telegram Groups/Channels
                  </h2>
                  <Users className="h-4 w-4 text-neutral-400" />
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by group name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-neutral-900 border-2 border-neutral-800 text-white pl-10 pr-4 py-3 text-sm font-mono focus:outline-none focus:border-neutral-50 transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  {telegramGroups
                    .filter(group => 
                      group.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((group) => {
                    const saved = isProviderSaved(group.id);
                    return (
                      <div 
                        key={group.id}
                        className="flex items-center justify-between p-4 bg-neutral-900/60 border border-neutral-800/80"
                      >
                        <div className="flex items-center gap-4">
                          {group.profile_image ? (
                            <img 
                              src={group.profile_image} 
                              alt={group.name}
                              className="w-10 h-10 rounded-none object-cover border border-neutral-700"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                              <Users className="w-5 h-5 text-neutral-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-neutral-50">{group.name}</p>
                            <p className="text-[10px] font-mono text-neutral-400">ID: {group.id}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {saved ? (
                            <Button
                              disabled={true}
                              className="bg-blue-500/20 rounded-none text-blue-300 border border-blue-500/30 font-black text-[10px] uppercase tracking-widest px-4 py-2"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Saved
                            </Button>
                          ) : (
                            <Button
                              onClick={() => saveProvider(group)}
                              disabled={isLoading}
                              className="bg-emerald-500/10 rounded-none text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 font-black text-[10px] uppercase tracking-widest px-4 py-2"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                          )}
                          <Button
                            onClick={() => saved ? removeProvider(group.id) : setTelegramGroups(telegramGroups.filter(g => g.id !== group.id))}
                            disabled={isLoading}
                            className="bg-red-500/10 rounded-none text-red-400 border border-red-500/20 hover:bg-red-500/20 font-black text-[10px] uppercase tracking-widest px-4 py-2"
                          >
                            <X className="w-4 h-4 mr-1" />
                            {saved ? 'Remove' : 'Remove'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saved Providers */}
          <Card className="rounded-none bg-neutral-950 text-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardContent className="px-6 space-y-6">
              <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-tighter">
                  Saved Providers
                </h2>
                <Users className="h-4 w-4 text-emerald-400" />
              </div>
              
              {isLoadingProviders ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-neutral-400 animate-spin mb-4" />
                  <p className="text-sm font-bold text-neutral-400">Loading providers...</p>
                </div>
              ) : savedProviders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-neutral-800">
                  <AlertCircle className="w-12 h-12 text-neutral-600 mb-4" />
                  <p className="text-sm font-bold text-neutral-400">No providers saved yet</p>
                  <p className="text-[10px] text-neutral-500 mt-1">Fetch and save Telegram groups to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedProviders.map((provider) => (
                    <div 
                      key={provider._id}
                      className="flex items-center justify-between p-4 bg-neutral-900/60 border border-neutral-800/80"
                    >
                      <div className="flex items-center gap-4">
                        {provider.profileImage ? (
                          <img 
                            src={provider.profileImage} 
                            alt={provider.groupName}
                            className="w-10 h-10 rounded-none object-cover border border-neutral-700"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                            <Users className="w-5 h-5 text-neutral-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-neutral-50">{provider.groupName}</p>
                          <p className="text-[10px] font-mono text-neutral-400">ID: {provider.groupId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 border ${
                          provider.isActive 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          {provider.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <Button
                          onClick={() => removeProvider(provider.groupId)}
                          disabled={isLoading}
                          className="bg-red-500/10 text-red-400 border rounded-none border-red-500/20 hover:bg-red-500/20 font-black text-[10px] uppercase tracking-widest px-4 py-2"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
