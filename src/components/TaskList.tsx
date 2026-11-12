import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Check,
  Repeat,
  Bell,
  Share2,
  Trash2,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { Task, Category, CategoryId, Priority } from '../types/task';
import { downloadICS } from '../services/calendarSync';
import { useLanguage } from '../services/i18n';

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  currentDateText: string;
  onToggleTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onAddTask: () => void;
  onDeleteTask?: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  categories,
  currentDateText,
  onToggleTask,
  onSelectTask,
  onAddTask,
  onDeleteTask,
}) => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'time' | 'priority' | 'title'>('time');
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Filter & sort logic
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(query);
          const matchesNotes = task.notes?.toLowerCase().includes(query);
          if (!matchesTitle && !matchesNotes) return false;
        }

        // Category
        if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) {
          return false;
        }

        // Status
        if (statusFilter === 'pending' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'time') {
          return a.time.localeCompare(b.time);
        }
        if (sortBy === 'priority') {
          const order: Record<Priority, number> = { Tinggi: 1, Sedang: 2, Rendah: 3 };
          return order[a.priority] - order[b.priority];
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [tasks, searchQuery, selectedCategory, statusFilter, sortBy]);

  const pendingList = filteredTasks.filter((t) => !t.completed);
  const completedList = filteredTasks.filter((t) => t.completed);

  const totalAll = tasks.length;
  const totalPending = tasks.filter((t) => !t.completed).length;
  const totalCompleted = tasks.filter((t) => t.completed).length;
  const percentCompleted = totalAll > 0 ? Math.round((totalCompleted / totalAll) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('satu_tugas')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {currentDateText} • {totalAll} {t('tugas_hari_ini_sub')}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => downloadICS(filteredTasks)}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={language === 'English' ? 'Export this list to calendar (.ics)' : 'Ekspor daftar tugas ini ke kalender (.ics)'}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t('ekspor_kalender')}</span>
          </button>

          <button
            onClick={onAddTask}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t('tambah_tugas')}</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('cari_nama_tugas')}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Category filter dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as CategoryId | 'all')}
            className="px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">{t('semua_kategori')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'time' | 'priority' | 'title')}
            className="px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="time">{t('urutkan_waktu')}</option>
            <option value="priority">{t('urutkan_prioritas')}</option>
            <option value="title">{t('urutkan_nama')}</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {t('semua')} {totalAll}
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {t('belum_selesai')} {totalPending}
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            statusFilter === 'completed'
              ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {t('selesai')} {totalCompleted}
        </button>
      </div>

      {/* Main List Container */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('aktivitas_hari_ini')}
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium capitalize">
            {t('urutkan')}: {sortBy}
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-xs">
            {t('tidak_ada_tugas')}
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            {/* Section 1: Belum Selesai */}
            {(statusFilter === 'all' || statusFilter === 'pending') && pendingList.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>{t('belum_selesai')}</span>
                  <span className="text-slate-400 font-normal">({pendingList.length} {t('tugas_label')})</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {pendingList.map((task) => (
                    <TaskItemRow
                      key={task.id}
                      task={task}
                      category={categories.find((c) => c.id === task.categoryId)}
                      onToggle={() => onToggleTask(task.id)}
                      onSelect={() => onSelectTask(task)}
                      onDelete={onDeleteTask ? () => setTaskToDelete(task) : undefined}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Selesai */}
            {(statusFilter === 'all' || statusFilter === 'completed') && completedList.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{t('selesai')}</span>
                  <span className="text-slate-400 font-normal">({completedList.length} {t('tugas_label')})</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {completedList.map((task) => (
                    <TaskItemRow
                      key={task.id}
                      task={task}
                      category={categories.find((c) => c.id === task.categoryId)}
                      onToggle={() => onToggleTask(task.id)}
                      onSelect={() => onSelectTask(task)}
                      onDelete={onDeleteTask ? () => setTaskToDelete(task) : undefined}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Summary */}
        <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>{t('menampilkan')} {filteredTasks.length} {t('dari')} {totalAll} {t('tugas_label')}</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {percentCompleted}% {t('hari_ini_selesai')}
          </span>
        </div>
      </div>

      {/* Motivational Bottom Callout */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>
          {completedList.length > 0
            ? language === 'English'
              ? `${completedList.length} tasks completed. Keep focusing on the next ${pendingList.length} steps.`
              : `${completedList.length} tugas sudah selesai. Tetap fokus pada ${pendingList.length} langkah berikutnya.`
            : language === 'English'
            ? 'Start with the very first small step to build today’s momentum.'
            : 'Mulai dari satu langkah pertama untuk membangun momentum harimu.'}
        </span>
      </div>

      {/* In-app Deletion Modal for TaskList */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-900/40">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-center text-slate-900 dark:text-white mb-2">
              {t('hapus_tugas_modal_title')}
            </h3>

            <div className="p-3 my-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                &ldquo;{taskToDelete.title}&rdquo;
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {categories.find((c) => c.id === taskToDelete.categoryId)?.name || 'Umum'} • {taskToDelete.time}
              </p>
            </div>

            <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {t('hapus_tugas_modal_desc')}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('batal')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteTask) {
                    onDeleteTask(taskToDelete.id);
                  }
                  setTaskToDelete(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('ya_hapus')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface TaskItemRowProps {
  task: Task;
  category?: Category;
  onToggle: () => void;
  onSelect: () => void;
  onDelete?: () => void;
}

const TaskItemRow: React.FC<TaskItemRowProps> = ({ task, category, onToggle, onSelect, onDelete }) => {
  const { language, t } = useLanguage();

  return (
    <div className="group flex items-center justify-between py-3.5 px-2 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 rounded-2xl transition-all">
      {/* Checkbox and info */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            task.completed
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-indigo-500'
          }`}
          aria-label={task.completed ? t('batal_selesai') : t('tandai_selesai')}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        <div onClick={onSelect} className="cursor-pointer flex-1 min-w-0">
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
            {task.subtasks.length > 0 && (
              <>
                <span>•</span>
                <span>
                  {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} {t('langkah')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right badges */}
      <div onClick={onSelect} className="cursor-pointer flex items-center gap-2 shrink-0">
        <span
          className={`hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${
            task.priority === 'Tinggi'
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              : task.priority === 'Sedang'
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 border-slate-100 dark:border-slate-700/50'
          }`}
        >
          {task.priority === 'Tinggi'
            ? t('prioritas_tinggi')
            : task.priority === 'Sedang'
            ? t('prioritas_sedang')
            : t('prioritas_rendah')}
        </span>

        <span
          className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
            task.completed
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
              : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300'
          }`}
        >
          {task.completed ? t('selesai') : t('belum_selesai')}
        </span>

        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
            title={language === 'English' ? 'Delete task' : 'Hapus tugas'}
            aria-label={language === 'English' ? 'Delete task' : 'Hapus tugas'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
      </div>
    </div>
  );
};
