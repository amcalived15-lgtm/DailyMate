import React from 'react';
import {
  Trophy,
  CheckCircle2,
  Clock,
  ListTodo,
  Check,
} from 'lucide-react';
import { Task, Category } from '../types/task';
import { useLanguage } from '../services/i18n';

interface ProgressViewProps {
  tasks: Task[];
  categories: Category[];
  currentDateText: string;
  onSelectTask: (task: Task) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  tasks,
  categories,
  currentDateText,
  onSelectTask,
}) => {
  const { language, t } = useLanguage();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const percentCompleted = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const completedList = tasks.filter((t) => t.completed);

  // Category progress
  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => t.categoryId === cat.id);
    const catTotal = catTasks.length;
    const catDone = catTasks.filter((t) => t.completed).length;
    const catPercent = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0;
    return {
      category: cat,
      total: catTotal,
      completed: catDone,
      percent: catPercent,
    };
  });

  // Circular gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentCompleted / 100) * circumference;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('kemajuanmu_berarti')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {currentDateText}
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60">
          {t('hari_ini_btn')}
        </span>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Large Circular Progress Card */}
        <div className="md:col-span-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="11"
                className="text-indigo-50 dark:text-slate-800"
              />
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="transparent"
                stroke="#4f46e5"
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {percentCompleted}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('selesai')}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {completedTasks} {t('dari')} {totalTasks} {t('tugas_selesai_count')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {pendingTasks > 0
              ? `${pendingTasks} ${t('langkah_lagi_hari_ini')}`
              : t('semua_target_selesai')}
          </p>
        </div>

        {/* 3 Small Metric Cards on Right */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total tugas */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ListTodo className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {totalTasks}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {t('total_semua_tugas')}
              </div>
            </div>
          </div>

          {/* Selesai */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {completedTasks}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {t('selesai')}
              </div>
            </div>
          </div>

          {/* Belum Selesai */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {pendingTasks}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {t('belum_selesai')}
              </div>
            </div>
          </div>

          {/* Trophy Motivation Banner */}
          <div className="sm:col-span-3 rounded-3xl bg-indigo-50/70 dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/40 p-5 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {percentCompleted >= 50
                  ? language === 'English'
                    ? 'More than halfway there!'
                    : 'Lebih dari setengah jalan!'
                  : language === 'English'
                  ? 'Every step counts!'
                  : 'Setiap langkah dihitung!'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {language === 'English'
                  ? `You have completed ${percentCompleted}% of your plans today. Maintain your momentum at your own calm pace.`
                  : `Kamu sudah menyelesaikan ${percentCompleted}% rencana hari ini. Pertahankan ritmemu, tanpa terburu-buru.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Progres Per Kategori & Sudah Kamu Selesaikan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left: Category Progress */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
            {t('progres_per_kategori')}
          </h3>

          <div className="space-y-6">
            {categoryStats.map((item) => (
              <div key={item.category.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {item.category.name}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">
                    {item.completed}/{item.total} {t('selesai')}
                  </span>
                </div>

                <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.percent === 100
                        ? 'bg-emerald-500'
                        : item.percent > 0
                        ? 'bg-indigo-600'
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Completed Tasks List */}
        <div className="lg:col-span-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('sudah_kamu_selesaikan')}
            </h3>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {completedList.length} {t('tugas_label')}
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {completedList.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
                {t('belum_ada_tugas_selesai')}
              </div>
            ) : (
              completedList.map((task) => {
                const category = categories.find((c) => c.id === task.categoryId);
                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="flex items-center justify-between py-3.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-2xs shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {task.title}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {task.time} • {category?.name || 'Umum'}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                      {t('selesai')}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
