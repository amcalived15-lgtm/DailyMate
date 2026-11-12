import React, { useState } from 'react';
import { X, Check, Sparkles, Smile, Tag, Palette } from 'lucide-react';
import { Sticker } from '../types/task';

interface StickerCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSticker: (sticker: Sticker) => void;
}

const POPULAR_EMOJIS = ['💪', '🎯', '🚀', '⭐', '🔥', '🎉', '☕', '💡', '⏰', '✨', '🏆', '💯'];

const STICKER_PALETTES = [
  { name: 'Indigo', bg: '#4f46e5', text: '#ffffff' },
  { name: 'Emerald', bg: '#10b981', text: '#ffffff' },
  { name: 'Amber', bg: '#f59e0b', text: '#ffffff' },
  { name: 'Rose', bg: '#ec4899', text: '#ffffff' },
  { name: 'Cyan', bg: '#06b6d4', text: '#ffffff' },
  { name: 'Purple', bg: '#8b5cf6', text: '#ffffff' },
  { name: 'Midnight', bg: '#1e293b', text: '#38bdf8' },
];

export const StickerCreatorModal: React.FC<StickerCreatorModalProps> = ({
  isOpen,
  onClose,
  onSaveSticker,
}) => {
  const [title, setTitle] = useState('Semangat Terus!');
  const [selectedEmoji, setSelectedEmoji] = useState('🔥');
  const [tag, setTag] = useState('Motivasi');
  const [palette, setPalette] = useState(STICKER_PALETTES[0]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSticker: Sticker = {
      id: `custom-st-${Date.now()}`,
      title: title.trim(),
      emoji: selectedEmoji,
      tag: tag.trim() || 'Kustom',
      bgColor: palette.bg,
      textColor: palette.text,
      isCustom: true,
    };

    onSaveSticker(newSticker);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Pembuat Stiker Kustom</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Buat Stiker Pengingat
        </h3>

        {/* Live Sticker Preview */}
        <div className="py-6 flex flex-col items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider mb-3">
            Pratinjau Stiker
          </span>
          <div
            className="w-40 h-40 rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-lg transition-transform transform hover:scale-105 select-none"
            style={{ backgroundColor: palette.bg, color: palette.text }}
          >
            <span className="text-4xl mb-2 drop-shadow-sm">{selectedEmoji}</span>
            <span className="font-extrabold text-sm leading-tight drop-shadow-xs px-2">
              {title || 'Teks Stiker'}
            </span>
            <span className="mt-2 text-[10px] uppercase font-bold tracking-wider opacity-85 px-2 py-0.5 rounded-full bg-black/15">
              {tag || 'Stiker'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Teks Stiker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Teks / Slogan Stiker
            </label>
            <input
              type="text"
              required
              maxLength={24}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Gasken Selesai!"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Emoji Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Pilih Ikon / Emoji
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-transform ${
                    selectedEmoji === emoji
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 scale-110 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:scale-105'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Pilih Warna Tema
            </label>
            <div className="flex items-center gap-2">
              {STICKER_PALETTES.map((pal) => (
                <button
                  key={pal.name}
                  type="button"
                  onClick={() => setPalette(pal)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    palette.name === pal.name ? 'scale-110 border-slate-900 dark:border-white shadow-xs' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: pal.bg }}
                  title={pal.name}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
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
              <span>Simpan &amp; Gunakan Stiker</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
