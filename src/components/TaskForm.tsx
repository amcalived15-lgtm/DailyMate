import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Repeat,
  Bell,
  Check,
  Plus,
  Trash2,
  Lightbulb,
  ArrowLeft,
} from 'lucide-react';
import { Task, Category, CategoryId, Priority, Recurrence, SubTask } from '../types/task';
import { getFormattedDate } from '../services/storage';
import { useLanguage } from '../services/i18n';

interface TaskFormProps {
  initialTask?: Task | null;
  categories: Category[];
  onSave: (task: Partial<Task>) => void;
  onCancel: () => void;
  onDelete?: (taskId: string) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialTask,
  categories,
  onSave,
  onCancel,
  onDelete,
}) => {
  const { language, t, formatDate } = useLanguage();
  const isEditing = Boolean(initialTask && initialTask.id);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [title, setTitle] = useState(initialTask?.title || '');
  const [categoryId, setCategoryId] = useState<CategoryId>(
    initialTask?.categoryId || categories[0]?.id || 'pekerjaan'
  );
  const [date, setDate] = useState(initialTask?.date || getFormattedDate());
  const [time, setTime] = useState(initialTask?.time || '19:00');
  const [recurrence, setRecurrence] = useState<Recurrence>(initialTask?.recurrence || 'Tidak ada');
  const [priority, setPriority] = useState<Priority>(initialTask?.priority || 'Sedang');
  const [reminderEnabled, setReminderEnabled] = useState(initialTask?.reminderEnabled ?? true);
  const [reminderMinutes, setReminderMinutes] = useState(initialTask?.reminderMinutesBefore || 10);
  const [notes, setNotes] = useState(initialTask?.notes || '');
  const [subtasks, setSubtasks] = useState<SubTask[]>(initialTask?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: `sub-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...(initialTask || {}),
      title: title.trim(),
      categoryId,
      date,
      time,
      recurrence,
      priority,
      reminderEnabled,
      reminderMinutesBefore: reminderMinutes,
      notes: notes.trim(),
      subtasks,
      completed: isEditing ? (initialTask?.completed ?? false) : false,
      createdAt: isEditing ? (initialTask?.createdAt ?? new Date().toISOString()) : new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={t('kembali')}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isEditing ? t('ubah_tugas') : t('rencanakan_langkah')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {t('buat_ruang_penting')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form Container */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            {t('informasi_tugas')}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Task Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('nama_tugas')}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === 'English' ? 'e.g.: Prepare Presentation' : 'Contoh: Menyiapkan Presentasi'}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Category dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('kategori')}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t('tanggal')}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  {t('waktu')}
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Recurrence dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('pengulangan')}
              </label>
              <div className="relative">
                <Repeat className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value as Recurrence)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Tidak ada">{t('tidak_berulang')}</option>
                  <option value="Setiap Hari">{t('setiap_hari')}</option>
                  <option value="Setiap Senin">{t('setiap_senin')}</option>
                  <option value="Setiap Minggu">{t('setiap_minggu')}</option>
                  <option value="Setiap Bulan">{t('setiap_bulan')}</option>
                </select>
              </div>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('prioritas')}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Rendah', 'Sedang', 'Tinggi'] as Priority[]).map((p) => {
                  const isSelected = priority === p;
                  let colorClasses = 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400';
                  if (isSelected) {
                    if (p === 'Tinggi') {
                      colorClasses = 'border-amber-400 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold';
                    } else if (p === 'Sedang') {
                      colorClasses = 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold';
                    } else {
                      colorClasses = 'border-slate-400 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold';
                    }
                  }
                  const label =
                    p === 'Tinggi'
                      ? t('prioritas_tinggi')
                      : p === 'Sedang'
                      ? t('prioritas_sedang')
                      : t('prioritas_rendah');

                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`py-3 px-4 rounded-2xl border text-xs text-center transition-all cursor-pointer ${colorClasses}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reminder Toggle & Interval */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {t('pengingat_otomatis')}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {reminderEnabled
                      ? `${reminderMinutes} ${t('menit_sebelumnya')}`
                      : t('pengingat_mati_label')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {reminderEnabled && (
                  <select
                    value={reminderMinutes}
                    onChange={(e) => setReminderMinutes(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <option value={5}>5 {t('menit_sebelumnya')}</option>
                    <option value={10}>10 {t('menit_sebelumnya')}</option>
                    <option value={15}>15 {t('menit_sebelumnya')}</option>
                    <option value={30}>30 {t('menit_sebelumnya')}</option>
                    <option value={60}>1 {t('jam_sebelumnya')}</option>
                  </select>
                )}

                <button
                  type="button"
                  onClick={() => setReminderEnabled(!reminderEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    reminderEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      reminderEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('catatan_opsional')}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('catatan_placeholder')}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Subtasks Builder */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t('langkah_kecil')}
              </label>

              {subtasks.length > 0 && (
                <div className="space-y-2 mb-3">
                  {subtasks.map((st) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-xs"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {st.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(st.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  placeholder={
                    language === 'English'
                      ? 'Add small step (e.g. Gather materials)'
                      : 'Tambah langkah kecil (contoh: Kumpulkan bahan)'
                  }
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('tambah')}</span>
                </button>
              </div>
            </div>

            {/* Submit / Cancel / Delete Buttons */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              {isEditing && onDelete ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-3 rounded-2xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100/70 text-rose-600 dark:text-rose-400 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('hapus')}</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {t('batal')}
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{t('simpan')}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right: Live Preview & Tip Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* PRATINJAU TUGAS */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              {t('pratinjau_tugas')}
            </span>

            <div className="mt-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/60">
                {selectedCategory?.name || 'Umum'}
              </span>
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {title || t('nama_tugas_anda')}
            </h3>

            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {formatDate(date)} • {time}
            </div>

            <div className="mt-4">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  priority === 'Tinggi'
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                    : priority === 'Sedang'
                    ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {t('prioritas')}:{' '}
                {priority === 'Tinggi'
                  ? t('prioritas_tinggi')
                  : priority === 'Sedang'
                  ? t('prioritas_sedang')
                  : t('prioritas_rendah')}
              </span>
            </div>

            {recurrence !== 'Tidak ada' && (
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Repeat className="w-3.5 h-3.5 text-indigo-500" />
                <span>
                  {recurrence === 'Setiap Hari'
                    ? t('setiap_hari')
                    : recurrence === 'Setiap Senin'
                    ? t('setiap_senin')
                    : recurrence === 'Setiap Minggu'
                    ? t('setiap_minggu')
                    : t('setiap_bulan')}
                </span>
              </div>
            )}

            {reminderEnabled && (
              <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                <Bell className="w-3.5 h-3.5" />
                <span>
                  {t('pengingat_aktif_label')} ({reminderMinutes} {t('menit_sebelumnya')})
                </span>
              </div>
            )}
          </div>

          {/* Motivational Tip Card */}
          <div className="rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
                {language === 'English'
                  ? 'Specific tasks are easier to start. Break down large activities into manageable steps to increase confidence.'
                  : 'Tugas yang spesifik lebih mudah dimulai. Pecah aktivitas besar menjadi langkah kecil untuk mempermudah eksekusi dan meningkatkan rasa percaya diri.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* In-app Deletion Modal for TaskForm */}
      {showDeleteConfirm && initialTask && (
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
                &ldquo;{initialTask.title}&rdquo;
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {selectedCategory?.name || 'Umum'} • {initialTask.time}
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
                  if (onDelete && initialTask.id) {
                    onDelete(initialTask.id);
                  }
                  onCancel();
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
