"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Bell,
  CheckCircle,
  LogOut,
  Plus,
  Trash2,
  Trash,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Link from "next/link";


interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface UserData {
  name: string;
  email: string;
  profileImage?: string;
  fullName?: string;
}

interface Account {
  id: string;
  email: string;
  fullName?: string;
  username?: string;
  isActive: boolean;
  profileImage?: string;
  isCurrentUser: boolean;
  addedAt?: string;
}

export default function UserHeader({
  sidebarOpen,
  setSidebarOpen,
}: HeaderProps) {

  // User state
  const [user, setUser] = useState<UserData>({
    name: "Loading...",
    email: "",
    profileImage: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Notification state
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationLoading, setNotificationLoading] = useState(true);

  // Dropdown states
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Account management state
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountNotifications, setAccountNotifications] = useState<
    Record<string, number>
  >({});

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "remove" | "clear";
    accountId?: string;
    accountName?: string;
  }>({ isOpen: false, type: "remove" });
  const [isRemoving, setIsRemoving] = useState(false);

  const defaultProfileImage = "https://github.com/shadcn.png";

  // Helper formatting function
  const formatTimeAgo = (date: any) => {
    try {
      let dateObj: Date;

      if (typeof date === "string") {
        dateObj = new Date(date);
      } else if (date && typeof date === "object") {
        if (date.$date) {
          dateObj = new Date(date.$date);
        } else if (date instanceof Date) {
          dateObj = date;
        } else {
          dateObj = new Date(date);
        }
      } else {
        dateObj = new Date(date);
      }

      if (isNaN(dateObj.getTime())) {
        return "Just now";
      }

      const now = new Date();
      const diffInMs = now.getTime() - dateObj.getTime();

      if (diffInMs < 0) {
        return "Just now";
      }

      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
      } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
      } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
      } else {
        return "Just now";
      }
    } catch (error) {
      console.error("Error formatting time ago:", error);
      return "Just now";
    }
  };

  // Remove single account handler
  const handleRemoveAccount = (accountId: string, accountName: string) => {
    setConfirmModal({
      isOpen: true,
      type: "remove",
      accountId,
      accountName,
    });
  };

  // Clear inactive accounts handler
  const handleClearAccounts = () => {
    const inactiveAccounts = accounts.filter((account) => !account.isActive);
    if (inactiveAccounts.length === 0) {
      toast.info("No inactive accounts to clear");
      return;
    }
    setConfirmModal({
      isOpen: true,
      type: "clear",
    });
  };

  // Confirm operation handler
  const handleConfirmAction = async () => {
    setIsRemoving(true);

    try {
      if (confirmModal.type === "remove" && confirmModal.accountId) {
        const response = await fetch("/api/auth/remove-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accountId: confirmModal.accountId }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success("Account removed successfully");
          fetchAccounts();
        } else {
          toast.error(data.error || "Failed to remove account");
        }
      } else if (confirmModal.type === "clear") {
        const response = await fetch("/api/auth/remove-accounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data.success) {
          toast.success("All inactive accounts removed successfully");
          fetchAccounts();
        } else {
          toast.error(data.error || "Failed to clear accounts");
        }
      }
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error("An error occurred while performing the action");
    } finally {
      setIsRemoving(false);
      setConfirmModal({ isOpen: false, type: "remove" });
    }
  };

  // Switch Account handler
  const handleSwitchAccount = async (accountId: string) => {
    try {
      const response = await fetch("/api/auth/switch-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `Switched to ${data.account?.fullName || data.account?.username || "Selected Account"}`
        );
        setIsDropdownOpen(false);
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to switch account");
      }
    } catch (error) {
      console.error("Error switching account:", error);
      toast.error("An error occurred while switching accounts");
    }
  };

  // Fetch notification counts for connected inactive accounts
  const fetchAccountNotifications = async (accountsList: Account[]) => {
    const notifications: Record<string, number> = {};

    for (const account of accountsList) {
      if (account.isActive) continue;

      try {
        const urls = [
          `/api/user-dashboard/deposit?userId=${account.id}`,
          "/api/withdraw",
          "/api/investments",
          "/api/user-dashboard/gift/history",
          `/api/user-dashboard/gift-card?userId=${account.id}`,
        ];

        // Fetch concurrently to avoid waterfalls
        const results = await Promise.allSettled(urls.map((url) => fetch(url)));

        const [depositsRes, withdrawalsRes, investmentsRes, giftsRes, giftCardsRes] =
          await Promise.all(
            results.map(async (res) => {
              if (res.status === "fulfilled" && res.value.ok) {
                try {
                  return await res.value.json();
                } catch {
                  return null;
                }
              }
              return null;
            })
          );

        const allNotifications: any[] = [];

        // Deposits
        if (depositsRes?.success && depositsRes?.deposits) {
          depositsRes.deposits.forEach((deposit: any) => {
            allNotifications.push({
              id: `deposit-${deposit._id}`,
              isRead: deposit.status === "approved",
            });
          });
        }

        // Withdrawals
        if (withdrawalsRes?.withdrawals) {
          withdrawalsRes.withdrawals.forEach((withdrawal: any) => {
            allNotifications.push({
              id: `withdrawal-${withdrawal._id}`,
              isRead: withdrawal.status === "approved",
            });
          });
        }

        // Investments
        if (investmentsRes?.investments) {
          investmentsRes.investments.forEach((investment: any) => {
            allNotifications.push({
              id: `investment-${investment._id}`,
              isRead: investment.status === "completed",
            });

            if (investment.profitHistory?.length > 0) {
              investment.profitHistory.forEach((profit: any) => {
                allNotifications.push({
                  id: `roi-${investment._id}-${profit.timestamp}`,
                  isRead: false,
                });
              });
            }
          });
        }

        // Gifts
        if (giftsRes?.success && giftsRes?.gifts) {
          giftsRes.gifts.forEach((gift: any) => {
            allNotifications.push({
              id: `gift-${gift._id}`,
              isRead: false,
            });
          });
        }

        // Gift cards
        if (giftCardsRes?.success && giftCardsRes?.giftCards) {
          giftCardsRes.giftCards.forEach((giftCard: any) => {
            allNotifications.push({
              id: `giftcard-${giftCard._id}`,
              isRead: giftCard.status === "approved",
            });
          });
        }

        const unreadCount = allNotifications.filter((n) => !n.isRead).length;
        notifications[account.id] = unreadCount;
      } catch (error) {
        console.error(`Error fetching notifications for account ${account.id}:`, error);
        notifications[account.id] = 0;
      }
    }

    setAccountNotifications(notifications);
  };

  // Fetch accounts data
  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/auth/accounts");
      const data = await response.json();

      if (data.success) {
        setAccounts(data.accounts || []);
        await fetchAccountNotifications(data.accounts || []);
      } else {
        console.error("Failed to fetch accounts:", data.error);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setAccountsLoading(false);
    }
  };

  // Fetch current user notifications
  const fetchNotificationCount = async (userId: string) => {
    try {
      const urls = [
        `/api/user-dashboard/deposit?userId=${userId}`,
        "/api/withdraw",
        "/api/investments",
        "/api/user-dashboard/gift/history",
        `/api/user-dashboard/gift-card?userId=${userId}`,
      ];

      // Perform API fetches in parallel for top-tier performance
      const results = await Promise.allSettled(urls.map((url) => fetch(url)));

      const [depositsResult, withdrawalsResult, investmentsResult, giftsResult, giftCardsResult] =
        await Promise.all(
          results.map(async (res) => {
            if (res.status === "fulfilled" && res.value.ok) {
              try {
                return await res.value.json();
              } catch {
                return null;
              }
            }
            return null;
          })
        );

      let unreadCount = 0;

      // Unread deposits
      if (depositsResult?.success && depositsResult?.deposits) {
        unreadCount += depositsResult.deposits.filter(
          (d: any) => d.status !== "approved"
        ).length;
      }

      // Unread withdrawals
      if (withdrawalsResult?.withdrawals) {
        unreadCount += withdrawalsResult.withdrawals.filter(
          (w: any) => w.status !== "approved"
        ).length;
      }

      // ROI notifications & active investments
      if (investmentsResult?.investments) {
        investmentsResult.investments.forEach((investment: any) => {
          if (investment.profitHistory?.length > 0) {
            unreadCount += investment.profitHistory.length;
          }
          if (investment.status === "active") {
            unreadCount += 1;
          }
        });
      }

      // Unread gifts
      if (giftsResult?.success && giftsResult?.gifts) {
        unreadCount += giftsResult.gifts.length;
      }

      // Unread gift cards
      if (giftCardsResult?.success && giftCardsResult?.giftCards) {
        unreadCount += giftCardsResult.giftCards.filter(
          (gc: any) => gc.status !== "approved"
        ).length;
      }

      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  // Fetch initial user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user/info");
        const data = await response.json();

        if (data.success && data.user) {
          const userData = data.user;
          setUser({
            name: userData.username || "User",
            email: userData.email || "",
            profileImage: userData.profileImage || "",
          });

          await fetchNotificationCount(userData._id);
        } else {
          console.error("Failed to fetch user data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      } finally {
        setIsLoading(false);
        setNotificationLoading(false);
      }
    };

    fetchData();
    fetchAccounts();
  }, []);

  // Dropdown click-outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="h-15 lg:h-15 border-b border-border flex items-center justify-between gap-4 px-4 sm:px-10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-6 w-6 animate-in fade-in zoom-in duration-300" />
            ) : (
              <Menu className="h-6 w-6 animate-in fade-in zoom-in duration-300" />
            )}
          </button>

          <div className="space-y-0.5">
            <p className="text-[8px] md:text-xs text-muted-foreground font-medium uppercase tracking-widest hidden xs:block">
              Member Experience
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Bell */}
          <Link
            href="/user-dashboard/notifications"
            className="p-2 hover:bg-secondary rounded-full relative cursor-pointer"
          >
            <Bell className="h-5 w-5" />

            {!notificationLoading && notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center border-2 border-background leading-none">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 pl-4 border-l border-border transition-colors cursor-pointer"
            >
              <div className="text-right hidden lg:block">
                <p className="text-xs font-black uppercase tracking-tight leading-none text-foreground">
                  {isLoading ? "Loading..." : user.name}
                </p>
                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">
                  {isLoading ? "" : user.email}
                </p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-foreground/20 rounded-xl p-0.5">
                <AvatarImage
                  src={user.profileImage || defaultProfileImage}
                  className="rounded-lg object-cover"
                />
                <AvatarFallback className="rounded-lg font-bold">
                  {isLoading ? "" : user.name.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full w-[260px] sm:w-80 overflow-hidden rounded-xl lg:rounded-2xl border border-border bg-background p-2 shadow-xl z-50">
                <div className="p-2">
                  <div className="mb-2 py-1">
                    <h3 className="text-[12px] font-black uppercase tracking-tighter leading-none text-muted-foreground">
                      User Profiles
                    </h3>
                    <p className="mt-1 text-[9px] font-medium uppercase tracking-tighter text-muted-foreground leading-none">
                      Switch between your connected accounts
                    </p>
                  </div>

                  {/* Profile Items */}
                  <div className="space-y-1">
                    {accountsLoading ? (
                      <>
                        <div className="flex items-center gap-3 p-3">
                          <div className="h-10 w-10 rounded-lg bg-secondary animate-pulse"></div>
                          <div className="flex-1 space-y-1">
                            <div className="h-3 w-3/4 rounded bg-secondary animate-pulse"></div>
                            <div className="h-2 w-1/2 rounded bg-secondary animate-pulse"></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3">
                          <div className="h-10 w-10 rounded-lg bg-secondary animate-pulse"></div>
                          <div className="flex-1 space-y-1">
                            <div className="h-3 w-2/3 rounded bg-secondary animate-pulse"></div>
                            <div className="h-2 w-1/3 rounded bg-secondary animate-pulse"></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      accounts.map((account) => (
                        <div
                          key={account.id}
                          onClick={() =>
                            !account.isActive && handleSwitchAccount(account.id)
                          }
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                            account.isActive
                              ? "border border-primary/20 bg-primary/10"
                              : "cursor-pointer hover:bg-secondary"
                          }`}
                        >
                          <Avatar className="h-10 w-10 rounded-lg shrink-0">
                            <AvatarImage
                              src={account.profileImage || defaultProfileImage}
                              className="rounded-lg object-cover"
                            />
                            <AvatarFallback className="rounded-lg text-sm font-bold">
                              {(account.fullName || account.username || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex flex-1 items-center justify-between min-w-0">
                            <div className="flex flex-col justify-center leading-[1] gap-[5px] min-w-0">
                              <span className="truncate text-[10px] font-black uppercase tracking-tight text-foreground">
                                {account.fullName || account.username || "Unknown User"}
                              </span>
                              <span className="truncate text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">
                                @{account.email || (account.username ? account.username.split("@")[0] : "user")}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {account.isActive ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveAccount(
                                      account.id,
                                      account.fullName || account.username || "Unknown User"
                                    );
                                  }}
                                  className="p-1 hover:bg-red-50 cursor-pointer rounded transition-colors group"
                                  title="Remove account"
                                >
                                  <Trash2 className="h-3 w-3 text-red-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Account Management Actions */}
                <div className="p-2">
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-secondary cursor-pointer"
                    >
                      <Plus className="h-4 w-4 shrink-0" />
                      <span className="text-[11px] font-black uppercase tracking-tight leading-none text-foreground">
                        Add an existing account
                      </span>
                    </button>

                    <button
                      onClick={handleClearAccounts}
                      className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-red-50 cursor-pointer group"
                    >
                      <Trash className="h-4 w-4 shrink-0 text-red-500 group-hover:text-red-600" />
                      <span className="text-[11px] font-black uppercase tracking-tight leading-none text-red-500 group-hover:text-red-600">
                        Clear existing accounts
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        window.location.href = "/auth-page/login";
                      }}
                      className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-secondary cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 shrink-0 text-red-500" />
                      <span className="text-[11px] font-black uppercase tracking-tight leading-none text-red-500">
                        Log out @{isLoading ? "" : user.email.split("@")[0]}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}