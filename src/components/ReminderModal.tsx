import React from 'react';
import { BellRing, Check, Clock, Calendar, ArrowRight, X } from 'lucide-react';
import { Task, Category } from '../types/task';

interface ReminderModalProps {
  task: Task | null;
  categories: Category[];
  onClose: () => void;
  onSnooze: (task: Task, minutes: number) => void;
  onComplete: (taskId: string) => void;
  onViewTask: (task: Task) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  task,
  categories,
  onClose,
  onSnooze,
  onComplete,
  onViewTask,
}) => {
  if (!task) return null;

  const category = categories.find((c) => c.id === task.categoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Glow ambient background */}
        <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Alarm Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-bounce">
            <BellRing className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              Pengingat Otomatis
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Waktunya beraktivitas!
            </h3>
          </div>
        </div>

        {/* Task Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
              {category?.name || 'Umum'}
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
              • Prioritas {task.priority}
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            {task.title}
          </h4>

          {task.notes && (
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              {task.notes}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{task.time} WIB</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>{task.date}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onComplete(task.id);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-indigo-600/25 transition-all"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Tandai Selesai Sekarang</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSnooze(task, 5);
                onClose();
              }}
              className="py-2.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Tunda 5 Menit
            </button>
            <button
              onClick={() => {
                onViewTask(task);
                onClose();
              }}
              className="py-2.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors flex items-center justify-center gap-1"
            >
              <span>Lihat Detail</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
