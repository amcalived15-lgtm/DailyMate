import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Circle,
  Calendar as CalendarIcon,
  Download,
  Upload,
  CheckCircle2,
} from 'lucide-react';
import { Task, Category } from '../types/task';
import { downloadICS, parseICS } from '../services/calendarSync';
import { getFormattedDate } from '../services/storage';
import { useLanguage } from '../services/i18n';

interface CalendarViewProps {
  tasks: Task[];
  categories: Category[];
  onToggleTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onAddTaskOnDate: (dateStr: string) => void;
  onImportTasks: (importedTasks: Partial<Task>[]) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  categories,
  onToggleTask,
  onSelectTask,
  onAddTaskOnDate,
  onImportTasks,
}) => {
  const { language, t, formatDate, getMonthNames, getDayNamesShort } = useLanguage();
  const monthNames = getMonthNames();
  const dayNames = getDayNamesShort();

  // If tasks exist, we can center on their primary month (or default to current/today)
  const [currentDate, setCurrentDate] = useState(() => {
    const firstTask = tasks[0];
    if (firstTask && firstTask.date) {
      const [y, m, d] = firstTask.date.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  });

  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return tasks[0]?.date || getFormattedDate();
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const jumpToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(getFormattedDate(today));
  };

  // Generate calendar days
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDay = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  interface CalendarDay {
    day: number;
    monthOffset: -1 | 0 | 1;
    dateStr: string;
    isCurrentMonth: boolean;
  }

  const calendarDays: CalendarDay[] = [];

  // Previous month trailing days
  for (let i = startingDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevM = month === 0 ? 11 : month - 1;
    const prevY = month === 0 ? year - 1 : year;
    const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarDays.push({ day, monthOffset: -1, dateStr, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ day: i, monthOffset: 0, dateStr, isCurrentMonth: true });
  }

  // Next month leading days to complete the 35 or 42 grid cells
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const nextM = month === 11 ? 0 : month + 1;
    const nextY = month === 11 ? year + 1 : year;
    const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({ day: i, monthOffset: 1, dateStr, isCurrentMonth: false });
  }

  // Tasks for the selected date
  const selectedDateTasks = tasks
    .filter((t) => t.date === selectedDateStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Map of tasks count per date for quick dot indicators
  const tasksCountByDate = tasks.reduce<Record<string, number>>((acc, t) => {
    acc[t.date] = (acc[t.date] || 0) + 1;
    return acc;
  }, {});

  // Human readable selected date header
  const getSelectedDateLabel = () => {
    return formatDate(selectedDateStr);
  };

  // Handle ICS file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseICS(content);
        if (parsed.length > 0) {
          onImportTasks(parsed);
          alert(
            language === 'English'
              ? `Successfully imported ${parsed.length} activities from calendar!`
              : `Berhasil mengimpor ${parsed.length} aktivitas dari kalender!`
          );
        } else {
          alert(
            language === 'English'
              ? 'No valid calendar events found in this .ics file.'
              : 'Tidak ditemukan acara yang valid di file .ics ini.'
          );
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('lihat_harimu')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {t('rencana_tertata')}
          </p>
        </div>

        {/* Action Buttons: Hari Ini, ICS Export & Import */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={jumpToToday}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t('hari_ini_btn')}</span>
          </button>

          <button
            onClick={() => downloadICS(tasks)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={language === 'English' ? 'Download all activities to .ics file' : 'Download seluruh agenda ke file .ics'}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('ekspor_ics')}</span>
          </button>

          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('impor_ics')}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".ics,text/calendar"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Main Grid: Calendar Left, Agenda on selected date Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Calendar Card */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
          {/* Month & Navigators */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={t('bulan_sebelumnya')}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={t('bulan_berikutnya')}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
            {dayNames.map((d) => (
              <span
                key={d}
                className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase py-2"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((item, idx) => {
              const isSelected = item.dateStr === selectedDateStr;
              const count = tasksCountByDate[item.dateStr] || 0;
              const isToday = item.dateStr === getFormattedDate();

              return (
                <button
                  key={`${item.dateStr}-${idx}`}
                  onClick={() => setSelectedDateStr(item.dateStr)}
                  className={`min-h-[52px] sm:min-h-[72px] p-1.5 sm:p-2 rounded-2xl flex flex-col items-center justify-between transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                      : item.isCurrentMonth
                      ? 'bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                      : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      isToday && !isSelected
                        ? 'w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center'
                        : ''
                    }`}
                  >
                    {item.day}
                  </span>

                  {/* Task Indicator Dot or Badge */}
                  {count > 0 && (
                    <div className="flex items-center justify-center mt-1">
                      {isSelected ? (
                        <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full">
                          {count} {t('tugas_label')}
                        </span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                          <span className="hidden sm:inline text-[10px] font-medium text-slate-400">
                            {count}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Selected Indicator */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>{t('tanggal_terpilih')}</span>
            </div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {getSelectedDateLabel()}
            </span>
          </div>
        </div>

        {/* Right Column: Selected Date Agenda */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
          {/* Agenda Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {getSelectedDateLabel()}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                {t('agenda_hari_ini')}
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
              {selectedDateTasks.length} {t('tugas_label')}
            </span>
          </div>

          {/* Agenda Timeline List */}
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {selectedDateTasks.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <CalendarIcon className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {t('tidak_ada_aktivitas_tanggal')}
                </p>
              </div>
            ) : (
              selectedDateTasks.map((task) => {
                const category = categories.find((c) => c.id === task.categoryId);
                const isPekerjaan = task.categoryId === 'pekerjaan';
                const stripeColor = isPekerjaan ? 'bg-indigo-500' : 'bg-emerald-500';

                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800 transition-all cursor-pointer"
                  >
                    {/* Time & Stripe & Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">
                        {task.time}
                      </span>

                      {/* Colored vertical bar */}
                      <span className={`w-1 h-8 rounded-full ${stripeColor} shrink-0`} />

                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-xs font-bold truncate ${
                            task.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="text-[11px] text-slate-400">
                          {category?.name || 'Umum'} • {task.completed ? t('selesai') : t('belum_selesai')}
                        </div>
                      </div>
                    </div>

                    {/* Checkbox toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(task.id);
                      }}
                      className="p-1 rounded-full text-slate-300 hover:text-emerald-500 dark:text-slate-600 dark:hover:text-emerald-400 transition-colors ml-2 cursor-pointer"
                      title={task.completed ? t('batal_selesai') : t('tandai_selesai')}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-indigo-500" />
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => onAddTaskOnDate(selectedDateStr)}
            className="w-full py-3 px-4 rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-700/60 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t('tambah_aktivitas')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
