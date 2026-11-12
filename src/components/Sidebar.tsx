import React from 'react';
import {
  LayoutGrid,
  CheckSquare,
  Calendar,
  TrendingUp,
  Folder,
  Settings,
  Sparkles,
  HelpCircle,
  Check,
  Users,
} from 'lucide-react';
import { ViewTab } from '../types/task';
import { useLanguage } from '../services/i18n';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  pendingTaskCount: number;
  onOpenHelpModal?: () => void;
  onLogoClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingTaskCount,
  onOpenHelpModal,
  onLogoClick,
}) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'beranda' as ViewTab, label: t('nav_beranda'), icon: LayoutGrid },
    {
      id: 'tugas' as ViewTab,
      label: t('nav_tugas'),
      icon: CheckSquare,
      badge: pendingTaskCount > 0 ? pendingTaskCount : null,
    },
    { id: 'kalender' as ViewTab, label: t('nav_kalender'), icon: Calendar },
    { id: 'progress' as ViewTab, label: t('nav_progress'), icon: TrendingUp },
    { id: 'kategori' as ViewTab, label: t('nav_kategori'), icon: Folder },
    { id: 'teman' as ViewTab, label: t('nav_teman'), icon: Users },
    { id: 'pengaturan' as ViewTab, label: t('nav_pengaturan'), icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 min-w-[16rem] h-screen sticky top-0 border-r bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 transition-colors z-20">
      {/* Brand Header */}
      <div className="p-6 pb-4">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-3 text-left group focus:outline-hidden"
          title="DailyMate - Klik untuk intro"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Check className="w-5 h-5 stroke-[2.8]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
            DailyMate
          </span>
        </button>
      </div>

      {/* Nav section */}
      <div className="flex-1 px-4 py-2 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 text-[11px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">
            {t('ruang_produktif')}
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400 stroke-[2.2]'
                          : 'text-slate-400 dark:text-slate-500 stroke-[1.8]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        isActive
                          ? 'bg-indigo-200/70 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Motivational Widget & Footer */}
      <div className="p-4 space-y-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {t('sedikit_demi_sedikit')}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            {t('motto_sidebar')}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 px-2">
          <button
            onClick={onOpenHelpModal}
            className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('bantuan_panduan')}</span>
          </button>
          <div className="text-[10px] text-slate-400 dark:text-slate-500">
            DailyMate • Versi 1.0.0
          </div>
        </div>
      </div>
    </aside>
  );
};
