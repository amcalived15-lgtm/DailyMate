import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  CheckCircle2,
  Trash2,
  ExternalLink,
  X,
  Calendar,
} from 'lucide-react';
import { UserProfile, AppNotification, ViewTab } from '../types/task';
import { useLanguage } from '../services/i18n';

interface HeaderProps {
  currentTab: ViewTab;
  currentDateText: string;
  profile: UserProfile;
  darkMode: boolean;
  notifications: AppNotification[];
  onToggleDarkMode: () => void;
  onNavigateTab: (tab: ViewTab) => void;
  onOpenCommandPalette: () => void;
  onClearNotifications: () => void;
  onMarkNotificationRead: (id: string) => void;
  onEditProfile: () => void;
  onOpenSplash: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  currentDateText,
  profile,
  darkMode,
  notifications,
  onToggleDarkMode,
  onNavigateTab,
  onOpenCommandPalette,
  onClearNotifications,
  onMarkNotificationRead,
  onEditProfile,
  onOpenSplash,
}) => {
  const { t } = useLanguage();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabTitles: Record<ViewTab, string> = {
    beranda: t('nav_beranda'),
    tugas: t('nav_tugas'),
    kalender: t('nav_kalender'),
    progress: t('nav_progress'),
    kategori: t('nav_kategori'),
    teman: t('teman_akuntabilitas'),
    pengaturan: t('nav_pengaturan'),
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b transition-colors bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-slate-200/80 dark:border-slate-800">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400 dark:text-slate-500 font-medium">{t('workspace')}</span>
        <span className="text-slate-300 dark:text-slate-600">›</span>
        <span className="font-semibold text-slate-800 dark:text-slate-100">
          {tabTitles[currentTab] || t('nav_beranda')}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500"
          title="⌘K"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span>{t('cari_aktivitas')}</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600 shadow-2xs">
            ⌘ K
          </kbd>
        </button>

        {/* Quick mobile search button */}
        <button
          onClick={onOpenCommandPalette}
          className="sm:hidden p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label={t('cari_aktivitas')}
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? t('mode_terang') : t('mode_gelap')}
          aria-label="Toggle Mode Gelap"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowProfileDropdown(false);
            }}
            className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={t('notifikasi_pengingat')}
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700/80 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                    {t('notifikasi_pengingat')}
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                      {unreadCount} {t('baru')}
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-[11px] text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    {t('hapus_semua')}
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                    {t('belum_ada_notif')}
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onMarkNotificationRead(notif.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        notif.read
                          ? 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-700/40 opacity-75'
                          : 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-xs text-slate-800 dark:text-slate-200">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifDropdown(false);
            }}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Menu Akun"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-800/60 shadow-xs shrink-0">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                profile.initials
              )}
            </div>
            <div className="hidden lg:flex flex-col text-left text-xs leading-tight">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {profile.name}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                {profile.accountType}
              </span>
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2.5 px-3 py-2 border-b border-slate-100 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    profile.initials
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                    {profile.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{profile.email}</p>
                </div>
              </div>

              <div className="mt-1 space-y-1">
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onEditProfile();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                >
                  {t('edit_profil_foto')}
                </button>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onToggleDarkMode();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors flex items-center justify-between"
                >
                  <span>{darkMode ? t('mode_terang') : t('mode_gelap')}</span>
                  {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onNavigateTab('pengaturan');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                >
                  {t('nav_pengaturan')}
                </button>
                <button
                  onClick={() => {
                    setShowProfileDropdown(false);
                    onOpenSplash();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors flex items-center justify-between"
                >
                  <span>{t('lihat_splash')}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
