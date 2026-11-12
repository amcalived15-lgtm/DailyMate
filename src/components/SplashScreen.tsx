import React from 'react';
import { Check, Sparkles, Calendar, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onStart: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between p-6 sm:p-10 lg:p-16 transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Check className="w-5 h-5 stroke-[2.8]" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            DailyMate
          </span>
        </div>
        <span className="hidden sm:inline-block text-xs text-slate-400 dark:text-slate-500 font-medium">
          Ruang kecil untuk hari yang lebih baik.
        </span>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Typography & Action */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Asisten Aktivitas Harian</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Hari lebih teratur. <br className="hidden sm:inline" />
            Pikiran lebih ringan.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Atur tugas, bangun kebiasaan, dan rayakan progresmu. Semua aktivitas harian dengan
            pengingat cerdas dan sinkronisasi kalender, dalam satu tempat.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition-all cursor-pointer group"
            >
              <span>Mulai</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium italic">
              Langkah kecil, dampak besar.
            </span>
          </div>

          {/* Three Feature Badges */}
          <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>Rencanakan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>Selesaikan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>Berkembang</span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Preview Card */}
        <div className="lg:col-span-5 relative flex justify-center">
          {/* Subtle decorative background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-indigo-100/60 dark:bg-indigo-950/40 blur-3xl pointer-events-none" />

          {/* Main Card */}
          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 sm:p-7 shadow-2xl transition-all hover:shadow-indigo-500/10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                  Hari Ini
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Satu langkah lagi.
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>

            {/* Mock Tasks List */}
            <div className="space-y-3">
              {/* Completed Task 1 */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl text-slate-700 dark:text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-sm font-medium line-through text-slate-400 dark:text-slate-500">
                  Olahraga Pagi
                </span>
              </div>

              {/* Completed Task 2 */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl text-slate-700 dark:text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-sm font-medium line-through text-slate-400 dark:text-slate-500">
                  Membaca Buku
                </span>
              </div>

              {/* Completed Task 3 */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl text-slate-700 dark:text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-sm font-medium line-through text-slate-400 dark:text-slate-500">
                  Membeli Kebutuhan
                </span>
              </div>

              {/* Active Pending Task */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60">
                <div className="w-5 h-5 mt-0.5 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                <div className="text-xs">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    Menyiapkan Presentasi
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                    19.00 • Pekerjaan
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping Floating Status Badge */}
            <div className="mt-6 flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 shadow-lg">
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900 dark:text-white">
                  3 dari 5 selesai!
                </div>
                <div className="text-slate-500 dark:text-slate-400">Kamu sudah lebih dekat.</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto pt-6 text-center text-xs text-slate-400 dark:text-slate-600">
        DailyMate © 2026 • Asisten Aktivitas Harian
      </footer>
    </div>
  );
};
