import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckSquare,
  Calendar,
  TrendingUp,
  Plus,
  Moon,
  Sun,
  X,
  Share2,
  Folder,
} from 'lucide-react';
import { Task, ViewTab } from '../types/task';

interface CommandPaletteProps {
  isOpen: boolean;
  tasks: Task[];
  darkMode: boolean;
  onClose: () => void;
  onSelectTask: (task: Task) => void;
  onNavigateTab: (tab: ViewTab) => void;
  onAddTask: () => void;
  onToggleDarkMode: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  tasks,
  darkMode,
  onClose,
  onSelectTask,
  onNavigateTab,
  onAddTask,
  onToggleDarkMode,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.notes?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari tugas, buka menu, atau aksi cepat..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Aksi Cepat
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onAddTask();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Plus className="w-4 h-4 text-indigo-500" />
                <span>Buat Tugas Baru</span>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('kalender');
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Buka Kalender &amp; Agenda</span>
              </button>

              <button
                onClick={() => {
                  onNavigateTab('progress');
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-slate-400" />
                <span>Lihat Statistik &amp; Progres</span>
              </button>

              <button
                onClick={() => {
                  onToggleDarkMode();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-400" />}
                <span>Ganti ke Mode {darkMode ? 'Terang' : 'Gelap'}</span>
              </button>
            </div>
          </div>

          {/* Matched Tasks */}
          {matchedTasks.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Tugas ({matchedTasks.length})
              </div>
              <div className="space-y-1">
                {matchedTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      onSelectTask(task);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <CheckSquare className={`w-4 h-4 shrink-0 ${task.completed ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <span className={`truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {task.time} • {task.priority}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
