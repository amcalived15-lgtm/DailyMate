import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Repeat,
  Bell,
  Check,
  Edit2,
  Trash2,
  Sparkles,
  ExternalLink,
  Plus,
  Share2,
} from 'lucide-react';
import { Task, Category, SubTask } from '../types/task';
import { generateGoogleCalendarUrl, downloadICS } from '../services/calendarSync';
import { reminderEngine } from '../services/reminder';
import { useLanguage } from '../services/i18n';

interface TaskDetailProps {
  task: Task;
  category?: Category;
  onBack: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onUpdateSubtasks: (taskId: string, subtasks: SubTask[]) => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  category,
  onBack,
  onEdit,
  onDelete,
  onToggleComplete,
  onUpdateSubtasks,
}) => {
  const { language, t, formatDate } = useLanguage();
  const [newSubtask, setNewSubtask] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const completedSubtasksCount = task.subtasks.filter((s) => s.completed).length;

  const handleToggleSubtask = (subtaskId: string) => {
    const updated = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    onUpdateSubtasks(task.id, updated);
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    const updated: SubTask[] = [
      ...task.subtasks,
      {
        id: `sub-${Date.now()}`,
        title: newSubtask.trim(),
        completed: false,
      },
    ];
    onUpdateSubtasks(task.id, updated);
    setNewSubtask('');
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    const updated = task.subtasks.filter((st) => st.id !== subtaskId);
    onUpdateSubtasks(task.id, updated);
  };

  const googleCalUrl = generateGoogleCalendarUrl(task);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={t('kembali')}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('fokus_satu_hal')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {t('selesaikan_langkah')}
          </p>
        </div>
      </div>

      {/* Main Grid: Detail left, Schedule & actions right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Task Overview & Subtasks */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
            {/* Badges row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60">
                  {category?.name || 'Umum'}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    task.priority === 'Tinggi'
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                      : task.priority === 'Sedang'
                      ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {task.priority === 'Tinggi'
                    ? t('prioritas_tinggi')
                    : task.priority === 'Sedang'
                    ? t('prioritas_sedang')
                    : t('prioritas_rendah')}
                </span>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  task.completed
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {task.completed ? t('selesai') : t('belum_selesai')}
              </span>
            </div>

            {/* Title */}
            <h2
              className={`text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight ${
                task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {task.title}
            </h2>

            {/* Notes */}
            {task.notes && (
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  {t('catatan')}
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {task.notes}
                </p>
              </div>
            )}

            {/* Created info */}
            <div className="mt-6 text-xs text-slate-400 dark:text-slate-500">
              {formatDate(task.date)} • {task.time}
            </div>
          </div>

          {/* Subtasks checklist Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('langkah_kecil')}
              </h3>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {completedSubtasksCount} {t('dari')} {task.subtasks.length}
              </span>
            </div>

            {/* Subtasks List */}
            <div className="space-y-2 mb-4">
              {task.subtasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 italic">
                  {language === 'English'
                    ? 'No small steps yet. Add subtasks to break down big goals.'
                    : 'Belum ada langkah kecil. Tambahkan subtask agar tugas besar lebih mudah diselesaikan.'}
                </p>
              ) : (
                task.subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 transition-all hover:bg-slate-100/60"
                  >
                    <div
                      onClick={() => handleToggleSubtask(st.id)}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                          st.completed
                            ? 'bg-emerald-500 text-white'
                            : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}
                      >
                        {st.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs font-medium truncate ${
                          st.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {st.title}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors ml-2 cursor-pointer"
                      title={language === 'English' ? 'Remove step' : 'Hapus langkah ini'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add new subtask input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder={t('tambah_langkah_placeholder')}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddSubtask}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('tambah')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Schedule Card, Google Calendar Integration & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Jadwal & Pengingat */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('jadwal_pengingat')}
            </h3>

            {/* Date info */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {formatDate(task.date)}
                </div>
                <div className="text-slate-400">{task.time}</div>
              </div>
            </div>

            {/* Recurrence info */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Repeat className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {task.recurrence === 'Tidak ada'
                    ? t('tidak_berulang')
                    : task.recurrence === 'Setiap Hari'
                    ? t('setiap_hari')
                    : task.recurrence === 'Setiap Senin'
                    ? t('setiap_senin')
                    : task.recurrence === 'Setiap Minggu'
                    ? t('setiap_minggu')
                    : t('setiap_bulan')}
                </div>
                <div className="text-slate-400">
                  {task.recurrence === 'Tidak ada' ? t('sekali_jalan') : t('pengulangan_aktif')}
                </div>
              </div>
            </div>

            {/* Reminder info */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {task.reminderEnabled
                    ? `${task.reminderMinutesBefore} ${t('menit_sebelumnya')}`
                    : t('pengingat_mati_label')}
                </div>
                <div className="text-slate-400">
                  {task.reminderEnabled ? t('pengingat_aktif_label') : t('tanpa_alarm')}
                </div>
              </div>
            </div>

            {/* Calendar Integration actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <a
                href={googleCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t('buka_google_calendar')}</span>
              </a>

              <button
                onClick={() => downloadICS([task], `${task.title.replace(/\s+/g, '_')}.ics`)}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t('unduh_file_ics')}</span>
              </button>

              {task.reminderEnabled && (
                <button
                  onClick={() => reminderEngine.testReminder(task)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{t('uji_pengingat_sekarang')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Mark completed */}
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                task.completed
                  ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{task.completed ? t('batal_selesai') : t('tandai_selesai')}</span>
            </button>

            {/* Edit & Delete row */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onEdit(task)}
                className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{t('edit_tugas')}</span>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="py-3 px-4 rounded-2xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/40 hover:bg-rose-100/80 text-rose-600 dark:text-rose-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('hapus')}</span>
              </button>
            </div>
          </div>

          {/* Bottom encouragement callout */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100/60 dark:border-indigo-900/40 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
              {language === 'English'
                ? 'Every completed task is a step forward. Focus on the next small achievement.'
                : 'Mulai dari rangkuman. Satu langkah sudah kamu selesaikan. Fokus pada langkah berikutnya.'}
            </p>
          </div>
        </div>
      </div>

      {/* In-app Task Deletion Confirmation Modal */}
      {showDeleteConfirm && (
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
                &ldquo;{task.title}&rdquo;
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {category?.name || 'Umum'} • {task.time}
              </p>
            </div>

            <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {t('hapus_tugas_modal_desc')}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('batal')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDelete(task.id);
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
