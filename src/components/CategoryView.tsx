import React from 'react';
import {
  Plus,
  Briefcase,
  Home,
  Heart,
  Folder,
  Check,
  Layers,
  Trash2,
} from 'lucide-react';
import { Task, Category } from '../types/task';
import { useLanguage } from '../services/i18n';

interface CategoryViewProps {
  tasks: Task[];
  categories: Category[];
  currentDateText: string;
  onSelectTask: (task: Task) => void;
  onOpenAddCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  tasks,
  categories,
  currentDateText,
  onSelectTask,
  onOpenAddCategory,
  onDeleteCategory,
}) => {
  const { language, t } = useLanguage();
  const [categoryToDelete, setCategoryToDelete] = React.useState<Category | null>(null);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'briefcase':
        return Briefcase;
      case 'home':
        return Home;
      case 'heart':
        return Heart;
      default:
        return Folder;
    }
  };

  const totalTasks = tasks.length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('setiap_peran_tertata')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {categories.length} {t('kategori_count')} • {totalTasks} {t('tugas_label')} • {currentDateText}
          </p>
        </div>

        <button
          onClick={onOpenAddCategory}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('tambah_kategori')}</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          const catTasks = tasks.filter((t) => t.categoryId === cat.id);
          const completedCount = catTasks.filter((t) => t.completed).length;
          const totalCount = catTasks.length;
          const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <div
              key={cat.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700 group/card"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${cat.bgLight} ${cat.bgDark}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Delete category button */}
                  {categories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(cat)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title={language === 'English' ? `Delete category ${cat.name}` : `Hapus kategori ${cat.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {cat.name}
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      completedCount === totalCount && totalCount > 0
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {completedCount}/{totalCount} {t('selesai')}
                  </span>
                </div>

                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                  {totalCount} {t('tugas_hari_ini_sub')}
                </p>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-4">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percent === 100
                        ? 'bg-emerald-500'
                        : percent > 0
                        ? 'bg-indigo-600'
                        : 'bg-transparent'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Task items list inside category */}
                <div className="mt-5 space-y-2">
                  {catTasks.length === 0 ? (
                    <div className="py-4 text-center text-[11px] text-slate-400">
                      {t('belum_ada_tugas_kategori')}
                    </div>
                  ) : (
                    catTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onSelectTask(task)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                              task.completed
                                ? 'bg-emerald-500 text-white'
                                : 'border border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {task.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span
                            className={`truncate ${
                              task.completed
                                ? 'line-through text-slate-400'
                                : 'font-medium text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0">{task.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Balance Callout */}
      <div className="p-5 rounded-3xl bg-indigo-50/60 dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-2xs border border-indigo-100 dark:border-indigo-900/50">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {t('seimbangkan_harimu')}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            {t('seimbangkan_subtext')}
          </p>
        </div>
      </div>

      {/* In-app Category Deletion Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-900/40">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-center text-slate-900 dark:text-white mb-2">
              {language === 'English'
                ? `Delete Category "${categoryToDelete.name}"?`
                : `Hapus Kategori "${categoryToDelete.name}"?`}
            </h3>

            <p className="text-xs text-center text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {language === 'English'
                ? `All tasks in this category will automatically be reassigned to "${
                    categories.find((c) => c.id !== categoryToDelete.id)?.name || 'General'
                  }".`
                : `Seluruh tugas dalam kategori ini akan secara otomatis dialihkan ke kategori "${
                    categories.find((c) => c.id !== categoryToDelete.id)?.name || 'Umum'
                  }" agar data tidak hilang.`}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('batal')}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteCategory(categoryToDelete.id);
                  setCategoryToDelete(null);
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                {t('hapus')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
