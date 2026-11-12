import React, { useState } from 'react';
import {
  Plus,
  Check,
  Repeat,
  Bell,
  Calendar,
  Share2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Circle,
  ExternalLink,
} from 'lucide-react';
import { Task, Category, UserProfile } from '../types/task';
import { generateGoogleCalendarUrl, downloadICS } from '../services/calendarSync';
import { useLanguage } from '../services/i18n';

interface DashboardViewProps {
  tasks: Task[];
  categories: Category[];
  profile: UserProfile;
  currentDateText: string;
  onToggleTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onAddTask: () => void;
  onViewAllTasks: () => void;
  onViewCalendar: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  categories,
  profile,
  currentDateText,
  onToggleTask,
  onSelectTask,
  onAddTask,
  onViewAllTasks,
  onViewCalendar,
}) => {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<'semua' | 'belum' | 'selesai'>('semua');

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const percentCompleted = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filtered tasks for display
  const displayTasks = tasks.filter((t) => {
    if (filter === 'belum') return !t.completed;
    if (filter === 'selesai') return t.completed;
    return true;
  });

  // Next upcoming pending task
  const nextTask = tasks.find((t) => !t.completed) || tasks[0];

  // Category completion counts for today
  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => t.categoryId === cat.id);
    const catCompleted = catTasks.filter((t) => t.completed).length;
    return {
      category: cat,
      total: catTasks.length,
      completed: catCompleted,
    };
  }).filter((item) => item.completed > 0);

  // SVG Circular Gauge calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentCompleted / 100) * circumference;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Greeting & Add Task CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t('halo')}, {profile.name.split(' ')[0]} ☀️
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {currentDateText}
          </p>
        </div>

        <button
          onClick={onAddTask}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('tambah_tugas')}</span>
        </button>
      </div>

      {/* Hero Progress Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-50/70 dark:bg-gradient-to-r dark:from-indigo-950/80 dark:to-slate-900 border border-indigo-100/80 dark:border-indigo-900/40 p-6 sm:p-8 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              {t('progres_hari_ini')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {percentCompleted === 100
                ? (language === 'English' ? `Awesome, ${profile.name.split(' ')[0]}!` : `Luar biasa, ${profile.name.split(' ')[0]}!`)
                : `${t('kerja_bagus')}, ${profile.name.split(' ')[0]}!`}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
              {completedTasks} {t('dari')} {totalTasks} {t('tugas_selesai_count')}.{' '}
              {pendingTasks > 0
                ? (language === 'English' ? `Only ${pendingTasks} left.` : `Tinggal ${pendingTasks} lagi.`)
                : (language === 'English' ? 'All plans are completed! 🎉' : 'Semua rencana telah tuntas! 🎉')}
            </p>
          </div>

          <div className="flex items-center gap-6 sm:gap-8 self-start md:self-auto">
            {/* 03 Selesai */}
            <div className="text-center sm:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {String(completedTasks).padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t('selesai')}
              </div>
            </div>

            {/* 02 Belum Selesai */}
            <div className="text-center sm:text-left border-l border-slate-200 dark:border-slate-800 pl-6 sm:pl-8">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {String(pendingTasks).padStart(2, '0')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t('belum_selesai')}
              </div>
            </div>

            {/* Circular Gauge */}
            <div className="relative flex items-center justify-center shrink-0 w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background track circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-indigo-100 dark:text-slate-800"
                />
                {/* Progress bar circle */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#4f46e5"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  {percentCompleted}%
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  selesai
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Tasks List, Right Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Tasks Card */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
          {/* Header & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('tugas_hari_ini')}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {totalTasks} {t('tugas_label')}
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 self-start sm:self-auto text-xs font-semibold">
              <button
                onClick={() => setFilter('semua')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'semua'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t('semua')} {totalTasks}
              </button>
              <button
                onClick={() => setFilter('belum')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'belum'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t('belum_selesai')} {pendingTasks}
              </button>
              <button
                onClick={() => setFilter('selesai')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === 'selesai'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t('selesai')} {completedTasks}
              </button>
            </div>
          </div>

          {/* Task Items List */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 my-2">
            {displayTasks.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
                Tidak ada tugas untuk filter ini.
              </div>
            ) : (
              displayTasks.map((task) => {
                const category = categories.find((c) => c.id === task.categoryId);
                return (
                  <div
                    key={task.id}
                    className="group flex items-center justify-between py-3.5 px-2 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 rounded-2xl transition-all"
                  >
                    {/* Left: Checkbox & Info */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleTask(task.id);
                        }}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          task.completed
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-indigo-500'
                        }`}
                        aria-label={task.completed ? 'Batal tandai selesai' : 'Tandai selesai'}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div
                        onClick={() => onSelectTask(task)}
                        className="cursor-pointer flex-1 min-w-0"
                      >
                        <h4
                          className={`text-sm font-semibold truncate transition-all ${
                            task.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                          }`}
                        >
                          {task.title}
                        </h4>

                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                          <span>{task.time}</span>
                          <span>•</span>
                          <span>{category?.name || 'Umum'}</span>
                          {task.recurrence !== 'Tidak ada' && (
                            <>
                              <span>•</span>
                              <Repeat className="w-3 h-3 text-indigo-500 inline" />
                            </>
                          )}
                          {task.reminderEnabled && (
                            <>
                              <span>•</span>
                              <Bell className="w-3 h-3 text-amber-500 inline" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Badges & status */}
                    <div
                      onClick={() => onSelectTask(task)}
                      className="cursor-pointer flex items-center gap-2 shrink-0"
                    >
                      {/* Priority tag */}
                      <span
                        className={`hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${
                          task.priority === 'Tinggi'
                            ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : task.priority === 'Sedang'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 border-slate-100 dark:border-slate-700/50'
                        }`}
                      >
                        {task.priority}
                      </span>

                      {/* Status tag */}
                      <span
                        className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                          task.completed
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300'
                        }`}
                      >
                        {task.completed ? 'Selesai' : 'Belum selesai'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* List Footer */}
          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>
              {completedTasks} selesai • {pendingTasks} belum selesai
            </span>
            <button
              onClick={onViewAllTasks}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>Lihat semua tugas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="lg:col-span-4 space-y-6">
          {/* "Berikutnya" Card */}
          {nextTask && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('berikutnya')}
              </span>

              <div className="mt-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {categories.find((c) => c.id === nextTask.categoryId)?.name || 'Pribadi'}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">
                    {language === 'English' ? 'Today' : 'Hari ini'}, {nextTask.time}
                  </div>
                </div>
              </div>

              <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                {nextTask.title}
              </h4>

              {nextTask.notes && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {nextTask.notes}
                </p>
              )}

              {nextTask.reminderEnabled && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <Bell className="w-3.5 h-3.5" />
                  <span>
                    {language === 'English'
                      ? `Reminder ${nextTask.reminderMinutesBefore} minutes before`
                      : `Pengingat ${nextTask.reminderMinutesBefore} menit sebelumnya`}
                  </span>
                </div>
              )}

              <div className="mt-5 space-y-2">
                <button
                  onClick={() => onSelectTask(nextTask)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  {t('lihat_detail')}
                </button>

                {/* Direct Google Calendar Add */}
                <a
                  href={generateGoogleCalendarUrl(nextTask)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{t('buka_google_calendar')}</span>
                </a>
              </div>
            </div>
          )}

          {/* "Ritme kecil, hasil besar" Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t('ritme_kecil')}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              {language === 'English'
                ? `You have completed activities across ${categoryStats.length} categories today.`
                : `Kamu sudah menyelesaikan aktivitas dari ${categoryStats.length} kategori hari ini.`}
            </p>

            <div className="flex flex-wrap gap-2">
              {categoryStats.map((item) => (
                <span
                  key={item.category.id}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/60"
                >
                  {item.category.name} • {item.completed}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Calendar & ICS Sync Widget */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-6 shadow-md shadow-indigo-600/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                Integrasi Kalender
              </span>
              <Calendar className="w-4 h-4 text-indigo-200" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              Sinkronkan ke Kalendermu
            </h4>
            <p className="text-xs text-indigo-100 leading-relaxed mb-4">
              Ekspor seluruh jadwal hari ini ke Google Calendar, Apple Calendar, atau Microsoft Outlook.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => downloadICS(tasks)}
                className="w-full py-2.5 px-3 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 active:scale-[0.99] font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Unduh File Kalender (.ics)</span>
              </button>
              <button
                onClick={onViewCalendar}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs border border-indigo-400/40 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Buka Kalender DailyMate</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
