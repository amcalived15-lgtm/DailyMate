import React, { useState } from 'react';
import {
  Edit2,
  Shield,
  Bell,
  Moon,
  Volume2,
  Globe,
  Calendar,
  Info,
  ChevronRight,
  Download,
  Upload,
  RefreshCw,
  Check,
} from 'lucide-react';
import { UserProfile, Task } from '../types/task';
import { reminderEngine } from '../services/reminder';
import { useLanguage } from '../services/i18n';

interface SettingsViewProps {
  profile: UserProfile;
  darkMode: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  tasks: Task[];
  onToggleDarkMode: () => void;
  onToggleNotifications: () => void;
  onToggleSound: () => void;
  onEditProfile: () => void;
  onResetData: () => void;
  onRestoreBackup: (tasks: Task[]) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  darkMode,
  notificationsEnabled,
  soundEnabled,
  tasks,
  onToggleDarkMode,
  onToggleNotifications,
  onToggleSound,
  onEditProfile,
  onResetData,
  onRestoreBackup,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [startOfWeek, setStartOfWeek] = useState<'Senin' | 'Minggu'>('Senin');
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const handleTestReminder = () => {
    reminderEngine.testReminder();
    setTestStatus(language === 'English' ? 'Notification tested!' : 'Pengingat berhasil diuji!');
    setTimeout(() => setTestStatus(null), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `DailyMate_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          onRestoreBackup(imported);
          alert(
            language === 'English'
              ? `Successfully restored ${imported.length} tasks!`
              : `Berhasil memulihkan ${imported.length} data aktivitas!`
          );
        }
      } catch {
        alert(language === 'English' ? 'Invalid JSON backup file.' : 'Format file JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {t('settings_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          {t('settings_subtitle')}
        </p>
      </div>

      {/* Main Grid: Left Profile, Right Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 shadow-xs flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-extrabold text-2xl flex items-center justify-center border-4 border-indigo-50 dark:border-indigo-950/60 shadow-sm mb-4">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                profile.initials
              )}
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {profile.name}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {profile.email}
            </p>

            <span className="mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/60">
              {profile.accountType}
            </span>

            <button
              onClick={onEditProfile}
              className="mt-6 w-full py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{language === 'English' ? 'Edit Profile & Photo' : 'Edit profil & foto'}</span>
            </button>
          </div>

          {/* Informasi Pribadi Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t('informasi_pribadi')}
              </span>
              <button
                onClick={onEditProfile}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {t('ubah')}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{t('pekerjaan_status')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {profile.occupation || t('belum_diisi')}
                </span>
              </div>

              {profile.age && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t('umur_label')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {profile.age} {typeof profile.age === 'number' || !String(profile.age).includes('tahun') ? t('tahun') : ''}
                  </span>
                </div>
              )}

              {profile.address && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-400 shrink-0">{t('alamat_label')}</span>
                  <span className="font-semibold text-right text-slate-800 dark:text-slate-200">
                    {profile.address}
                  </span>
                </div>
              )}

              {profile.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t('kontak_label')}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {profile.phone}
                  </span>
                </div>
              )}

              {profile.bio && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 block mb-1">{t('motto_label')}</span>
                  <p className="text-slate-600 dark:text-slate-300 italic text-[11px] leading-relaxed">
                    &ldquo;{profile.bio}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Privacy Security Callout */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3.5">
            <Shield className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('privacy_callout')}
            </p>
          </div>
        </div>

        {/* Right Column: Preferences, General, About */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Preferensi */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
              {t('preferensi')}
            </h3>

            <div className="space-y-6">
              {/* Notifikasi */}
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {t('notifikasi_pengingat_label')}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {t('notifikasi_pengingat_desc')}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onToggleNotifications}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Mode Gelap */}
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {t('mode_gelap_label')}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {t('mode_gelap_desc')}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onToggleDarkMode}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    darkMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      darkMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Efek Suara */}
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {t('efek_suara_label')}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {t('efek_suara_desc')}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onToggleSound}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    soundEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Test Reminder Trigger */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={handleTestReminder}
                  className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{t('uji_notif_suara')}</span>
                </button>
                {testStatus && (
                  <span className="text-xs font-bold text-emerald-600 animate-fade-in">
                    {testStatus}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Umum */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
              {t('umum_section')}
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {/* Bahasa */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {t('bahasa_label')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {language === 'English' ? 'Currently using English' : 'Saat ini Bahasa Indonesia'}
                    </span>
                  </div>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'Indonesia' | 'English')}
                  className="px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-slate-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 focus:outline-hidden cursor-pointer"
                >
                  <option value="Indonesia">Bahasa Indonesia</option>
                  <option value="English">English</option>
                </select>
              </div>

              {/* Awal minggu */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t('awal_minggu_label')}
                  </span>
                </div>
                <select
                  value={startOfWeek}
                  onChange={(e) => setStartOfWeek(e.target.value as 'Senin' | 'Minggu')}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
                >
                  <option value="Senin">{language === 'English' ? 'Monday' : 'Senin'}</option>
                  <option value="Minggu">{language === 'English' ? 'Sunday' : 'Minggu'}</option>
                </select>
              </div>

              {/* Data Backup & Restore */}
              <div className="py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {t('manajemen_data')}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleExportJSON}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>{t('ekspor_cadangan')}</span>
                  </button>

                  <label className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3 h-3" />
                    <span>{t('pulihkan_cadangan')}</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-3 py-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{t('reset_data_bawaan')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Tentang DailyMate */}
          <div
            onClick={() => setShowAboutModal(true)}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex items-center justify-between cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {t('tentang_dailymate')}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500">
                  {t('asisten_aktivitas_harian')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>1.0.0</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              DailyMate 1.0.0
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'English'
                ? 'Daily task management assistant with Google Calendar & Apple Calendar (.ics) integration, smart automated reminders, and mutual friend accountability. Designed for more structured days and lighter minds.'
                : 'Asisten manajemen tugas harian dengan integrasi kalender Google / Apple (.ics) dan pengingat otomatis cerdas. Didesain untuk hari yang lebih teratur dan pikiran yang lebih ringan.'}
            </p>
            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              {language === 'English' ? 'Close' : 'Tutup'}
            </button>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-900/40">
              <RefreshCw className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {language === 'English' ? 'Reset to Default Data?' : 'Kembalikan ke Data Contoh?'}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {language === 'English'
                ? 'This will restore the initial sample tasks and habits of DailyMate.'
                : 'Seluruh tugas akan dikembalikan ke data awal contoh DailyMate.'}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('batal')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetData();
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                {language === 'English' ? 'Yes, Reset' : 'Ya, Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer credit */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-600 pt-6">
        {t('footer_credit')}
      </div>
    </div>
  );
};
