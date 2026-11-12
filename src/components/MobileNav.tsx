import React, { useState } from 'react';
import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  TrendingUp,
  LayoutTemplate,
  Folder,
  Settings,
  X,
  Sun,
  Moon,
  Users,
} from 'lucide-react';
import { ViewTab } from '../types/task';
import { useLanguage } from '../services/i18n';

interface MobileNavProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  pendingTaskCount: number;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  pendingTaskCount,
  darkMode,
  onToggleDarkMode,
}) => {
  const { t } = useLanguage();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const mainTabs = [
    { id: 'beranda' as ViewTab, label: t('nav_beranda'), icon: LayoutGrid },
    {
      id: 'tugas' as ViewTab,
      label: t('nav_tugas'),
      icon: CheckSquare,
      badge: pendingTaskCount > 0 ? pendingTaskCount : null,
    },
    { id: 'kalender' as ViewTab, label: t('nav_kalender'), icon: Calendar },
    { id: 'progress' as ViewTab, label: t('nav_progress'), icon: TrendingUp },
  ];

  const isMoreActive = currentTab === 'kategori' || currentTab === 'pengaturan' || currentTab === 'teman';

  return (
    <>
      {/* More Menu Drawer */}
      {showMoreMenu && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                {t('nav_lainnya')}
              </span>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 py-2">
              <button
                onClick={() => {
                  onSelectTab('kategori');
                  setShowMoreMenu(false);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  currentTab === 'kategori'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Folder className="w-5 h-5 mb-1.5" />
                <span className="text-[10px] font-semibold">{t('nav_kategori')}</span>
              </button>
              <button
                onClick={() => {
                  onSelectTab('teman');
                  setShowMoreMenu(false);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  currentTab === 'teman'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Users className="w-5 h-5 mb-1.5" />
                <span className="text-[10px] font-semibold">{t('nav_teman')}</span>
              </button>
              <button
                onClick={() => {
                  onSelectTab('pengaturan');
                  setShowMoreMenu(false);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  currentTab === 'pengaturan'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Settings className="w-5 h-5 mb-1.5" />
                <span className="text-[10px] font-semibold">{t('nav_pengaturan')}</span>
              </button>
              <button
                onClick={() => {
                  onToggleDarkMode?.();
                }}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100"
              >
                {darkMode ? <Sun className="w-5 h-5 mb-1.5 text-amber-500" /> : <Moon className="w-5 h-5 mb-1.5 text-indigo-500" />}
                <span className="text-[10px] font-semibold">{darkMode ? t('mode_terang') : t('mode_gelap')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed bottom navigation bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-around px-2 pb-safe transition-colors">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setShowMoreMenu(false);
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {tab.badge !== null && (
                  <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold rounded-full bg-indigo-600 text-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1">{tab.label}</span>
            </button>
          );
        })}

        {/* Lainnya button */}
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            isMoreActive
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutTemplate className={`w-5 h-5 ${isMoreActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1">{t('nav_lainnya')}</span>
        </button>
      </nav>
    </>
  );
};
