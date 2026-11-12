import React, { useState } from 'react';
import { X, Check, Briefcase, Home, Heart, BookOpen, Star, Coffee } from 'lucide-react';
import { Category } from '../types/task';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: Category) => void;
}

const AVAILABLE_ICONS = [
  { id: 'briefcase', label: 'Kerja', icon: Briefcase },
  { id: 'home', label: 'Rumah', icon: Home },
  { id: 'heart', label: 'Pribadi', icon: Heart },
  { id: 'book', label: 'Belajar', icon: BookOpen },
  { id: 'star', label: 'Prioritas', icon: Star },
  { id: 'coffee', label: 'Santai', icon: Coffee },
];

const AVAILABLE_COLORS = [
  { hex: '#4f46e5', label: 'Indigo', bgLight: 'bg-indigo-50 text-indigo-700 border-indigo-100', bgDark: 'dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/50' },
  { hex: '#10b981', label: 'Emerald', bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-100', bgDark: 'dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/50' },
  { hex: '#ec4899', label: 'Rose', bgLight: 'bg-rose-50 text-rose-700 border-rose-100', bgDark: 'dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/50' },
  { hex: '#f59e0b', label: 'Amber', bgLight: 'bg-amber-50 text-amber-700 border-amber-100', bgDark: 'dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/50' },
  { hex: '#06b6d4', label: 'Cyan', bgLight: 'bg-cyan-50 text-cyan-700 border-cyan-100', bgDark: 'dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-900/50' },
  { hex: '#8b5cf6', label: 'Purple', bgLight: 'bg-purple-50 text-purple-700 border-purple-100', bgDark: 'dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900/50' },
];

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<'briefcase' | 'home' | 'heart' | 'book' | 'star' | 'coffee'>('book');
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = name.trim().toLowerCase().replace(/\s+/g, '-');
    onAdd({
      id,
      name: name.trim(),
      icon: selectedIcon,
      color: selectedColor.hex,
      bgLight: selectedColor.bgLight,
      bgDark: selectedColor.bgDark,
    });
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Tambah Kategori Baru
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Nama Kategori
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Belajar, Proyek, dll."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Pilih Ikon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedIcon === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedIcon(item.id as typeof selectedIcon)}
                    className={`p-3 rounded-2xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Pilih Warna Tema
            </label>
            <div className="flex items-center gap-3">
              {AVAILABLE_COLORS.map((col) => {
                const isSelected = selectedColor.hex === col.hex;
                return (
                  <button
                    type="button"
                    key={col.hex}
                    onClick={() => setSelectedColor(col)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform ${
                      isSelected ? 'scale-110 border-slate-900 dark:border-white shadow-xs' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: col.hex }}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Simpan Kategori</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
