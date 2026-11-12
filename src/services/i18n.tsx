import React, { createContext, useContext, useState, ReactNode } from 'react';
import { storage } from './storage';

export type Language = 'Indonesia' | 'English';

export interface Translations {
  [key: string]: {
    Indonesia: string;
    English: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Navigation
  nav_beranda: { Indonesia: 'Beranda', English: 'Home' },
  nav_tugas: { Indonesia: 'Tugas', English: 'Tasks' },
  nav_kalender: { Indonesia: 'Kalender', English: 'Calendar' },
  nav_progress: { Indonesia: 'Progress', English: 'Progress' },
  nav_kategori: { Indonesia: 'Kategori', English: 'Categories' },
  nav_teman: { Indonesia: 'Teman', English: 'Friends' },
  nav_pengaturan: { Indonesia: 'Pengaturan', English: 'Settings' },
  nav_lainnya: { Indonesia: 'Lainnya', English: 'More' },
  ruang_produktif: { Indonesia: 'Ruang Produktif', English: 'Productive Space' },
  sedikit_demi_sedikit: { Indonesia: 'Sedikit demi sedikit.', English: 'Little by little.' },
  motto_sidebar: {
    Indonesia: 'Setiap tugas selesai adalah satu langkah maju.',
    English: 'Every completed task is a step forward.',
  },
  bantuan_panduan: { Indonesia: 'Bantuan & panduan', English: 'Help & guide' },

  // Header & Controls
  workspace: { Indonesia: 'Workspace', English: 'Workspace' },
  cari_aktivitas: { Indonesia: 'Cari aktivitas...', English: 'Search activities...' },
  mode_terang: { Indonesia: 'Mode Terang', English: 'Light Mode' },
  mode_gelap: { Indonesia: 'Mode Gelap', English: 'Dark Mode' },
  notifikasi_pengingat: { Indonesia: 'Notifikasi & Pengingat', English: 'Notifications & Reminders' },
  baru: { Indonesia: 'baru', English: 'new' },
  hapus_semua: { Indonesia: 'Hapus semua', English: 'Clear all' },
  belum_ada_notif: {
    Indonesia: 'Belum ada notifikasi atau pengingat aktif.',
    English: 'No active notifications or reminders yet.',
  },
  edit_profil_foto: { Indonesia: 'Edit Profil & Foto', English: 'Edit Profile & Photo' },
  lihat_splash: { Indonesia: 'Lihat Intro / Splash', English: 'View Intro / Splash' },
  menu_akun: { Indonesia: 'Menu Akun', English: 'Account Menu' },
  akun_pribadi: { Indonesia: 'Akun pribadi', English: 'Personal account' },

  // Dashboard
  halo: { Indonesia: 'Halo', English: 'Hello' },
  progres_hari_ini: { Indonesia: 'PROGRES HARI INI', English: "TODAY'S PROGRESS" },
  kerja_bagus: { Indonesia: 'Kerja bagus', English: 'Great job' },
  dari: { Indonesia: 'dari', English: 'of' },
  tugas_selesai_count: { Indonesia: 'tugas selesai', English: 'tasks completed' },
  tinggal: { Indonesia: 'Tinggal', English: 'Only' },
  lagi: { Indonesia: 'lagi', English: 'left' },
  tugas_hari_ini: { Indonesia: 'Tugas hari ini', English: "Today's tasks" },
  semua: { Indonesia: 'Semua', English: 'All' },
  belum_selesai: { Indonesia: 'Belum selesai', English: 'Pending' },
  selesai: { Indonesia: 'Selesai', English: 'Completed' },
  berikutnya: { Indonesia: 'Berikutnya', English: 'Up Next' },
  lihat_detail: { Indonesia: 'Lihat detail', English: 'View details' },
  lihat_semua_tugas: { Indonesia: 'Lihat semua tugas', English: 'View all tasks' },
  ritme_kecil: { Indonesia: 'Ritme kecil, hasil besar', English: 'Small rhythm, big results' },
  ritme_subtext: {
    Indonesia: 'Kamu sudah menyelesaikan aktivitas dari beberapa kategori hari ini.',
    English: 'You have completed activities across multiple categories today.',
  },
  tambah_tugas: { Indonesia: 'Tambah tugas', English: 'Add task' },

  // Task List
  satu_tugas: { Indonesia: 'Satu tugas, satu langkah.', English: 'One task, one step.' },
  tugas_hari_ini_sub: { Indonesia: 'tugas hari ini', English: 'tasks today' },
  cari_nama_tugas: { Indonesia: 'Cari nama tugas...', English: 'Search task name...' },
  semua_kategori: { Indonesia: 'Semua kategori', English: 'All categories' },
  aktivitas_hari_ini: { Indonesia: 'Aktivitas hari ini', English: "Today's activities" },
  urutkan: { Indonesia: 'Urutkan', English: 'Sort' },
  urutkan_waktu: { Indonesia: 'Urutkan: Waktu', English: 'Sort: Time' },
  urutkan_prioritas: { Indonesia: 'Urutkan: Prioritas', English: 'Sort: Priority' },
  urutkan_nama: { Indonesia: 'Urutkan: Nama', English: 'Sort: Name' },
  ekspor_kalender: { Indonesia: 'Ekspor Kalender', English: 'Export Calendar' },
  tidak_ada_tugas: {
    Indonesia: 'Tidak ada tugas yang sesuai kriteria pencarian.',
    English: 'No tasks match your search criteria.',
  },
  langkah: { Indonesia: 'langkah', English: 'steps' },
  tugas_label: { Indonesia: 'tugas', English: 'tasks' },
  menampilkan: { Indonesia: 'Menampilkan', English: 'Showing' },
  hari_ini_selesai: { Indonesia: 'tugas hari ini selesai', English: 'of today tasks completed' },

  // Task Detail
  fokus_satu_hal: { Indonesia: 'Fokus pada satu hal.', English: 'Focus on one thing.' },
  selesaikan_langkah: {
    Indonesia: 'Selesaikan langkah kecilmu, lalu lanjutkan hari.',
    English: 'Complete your small steps, then move through your day.',
  },
  catatan_aktivitas: { Indonesia: 'Catatan Aktivitas', English: 'Activity Notes' },
  catatan: { Indonesia: 'Catatan', English: 'Notes' },
  belum_ada_catatan: {
    Indonesia: 'Belum ada catatan detail untuk tugas ini.',
    English: 'No detailed notes for this task yet.',
  },
  langkah_subtugas: { Indonesia: 'Langkah & Subtugas', English: 'Steps & Subtasks' },
  langkah_kecil: { Indonesia: 'Langkah kecil', English: 'Small steps' },
  tambah_langkah_placeholder: { Indonesia: 'Tambah langkah baru...', English: 'Add a new step...' },
  tambah: { Indonesia: 'Tambah', English: 'Add' },
  jadwal_pengingat: { Indonesia: 'Jadwal & pengingat', English: 'Schedule & reminder' },
  integrasi_kalender: { Indonesia: 'Integrasi Kalender', English: 'Calendar Integration' },
  buka_google_calendar: { Indonesia: 'Tambah ke Google Calendar', English: 'Add to Google Calendar' },
  unduh_file_ics: { Indonesia: 'Unduh File .ICS', English: 'Download .ICS File' },
  tandai_selesai: { Indonesia: 'Tandai Selesai', English: 'Mark as Completed' },
  batal_selesai: { Indonesia: 'Tandai Belum Selesai', English: 'Mark as Pending' },
  edit_tugas: { Indonesia: 'Edit tugas', English: 'Edit task' },
  hapus: { Indonesia: 'Hapus', English: 'Delete' },
  batal: { Indonesia: 'Batal', English: 'Cancel' },
  simpan: { Indonesia: 'Simpan', English: 'Save' },
  simpan_perubahan: { Indonesia: 'Simpan Perubahan', English: 'Save Changes' },
  kembali: { Indonesia: 'Kembali', English: 'Back' },
  uji_pengingat_sekarang: { Indonesia: 'Uji Pengingat Sekarang', English: 'Test Reminder Now' },
  sekali_jalan: { Indonesia: 'Sekali jalan', English: 'One time only' },
  pengulangan_aktif: { Indonesia: 'Pengulangan otomatis aktif', English: 'Auto recurrence active' },
  pengingat_aktif_label: { Indonesia: 'Pengingat aktif', English: 'Reminder active' },
  pengingat_mati_label: { Indonesia: 'Pengingat dimatikan', English: 'Reminder off' },
  tanpa_alarm: { Indonesia: 'Tanpa alarm', English: 'No alarm' },

  // Task Form
  rencanakan_langkah: { Indonesia: 'Rencanakan langkah berikutnya.', English: 'Plan your next step.' },
  ubah_tugas: { Indonesia: 'Ubah Tugas', English: 'Edit Task' },
  buat_ruang_penting: {
    Indonesia: 'Catat satu tugas, beri ruang untuk hal penting.',
    English: 'Record one task, make room for what matters.',
  },
  informasi_tugas: { Indonesia: 'Informasi tugas', English: 'Task Information' },
  nama_tugas: { Indonesia: 'Nama tugas', English: 'Task Name' },
  kategori: { Indonesia: 'Kategori', English: 'Category' },
  tanggal: { Indonesia: 'Tanggal', English: 'Date' },
  waktu: { Indonesia: 'Waktu', English: 'Time' },
  pengulangan: { Indonesia: 'Pengulangan', English: 'Recurrence' },
  prioritas: { Indonesia: 'Prioritas', English: 'Priority' },
  pengingat: { Indonesia: 'Pengingat', English: 'Reminder' },
  pengingat_otomatis: { Indonesia: 'Pengingat Otomatis', English: 'Automated Reminder' },
  menit_sebelumnya: { Indonesia: 'menit sebelumnya', English: 'minutes before' },
  jam_sebelumnya: { Indonesia: 'jam sebelumnya', English: 'hour before' },
  catatan_opsional: { Indonesia: 'Catatan (Opsional)', English: 'Notes (Optional)' },
  catatan_placeholder: {
    Indonesia: 'Tambahkan detail, instruksi, atau tautan terkait...',
    English: 'Add details, instructions, or relevant links...',
  },
  pratinjau_tugas: { Indonesia: 'Pratinjau Tugas', English: 'Task Preview' },
  prioritas_rendah: { Indonesia: 'Rendah', English: 'Low' },
  prioritas_sedang: { Indonesia: 'Sedang', English: 'Medium' },
  prioritas_tinggi: { Indonesia: 'Tinggi', English: 'High' },
  tidak_berulang: { Indonesia: 'Tidak berulang', English: 'Does not repeat' },
  setiap_hari: { Indonesia: 'Setiap Hari', English: 'Daily' },
  setiap_senin: { Indonesia: 'Setiap Senin', English: 'Every Monday' },
  setiap_minggu: { Indonesia: 'Setiap Minggu', English: 'Weekly' },
  setiap_bulan: { Indonesia: 'Setiap Bulan', English: 'Monthly' },
  nama_tugas_anda: { Indonesia: 'Nama Tugas Anda', English: 'Your Task Name' },

  // Calendar View
  lihat_harimu: { Indonesia: 'Lihat harimu lebih jelas.', English: 'See your day more clearly.' },
  rencana_tertata: {
    Indonesia: 'Rencana yang tertata, hari yang lebih tenang.',
    English: 'A structured plan, a calmer day.',
  },
  ekspor_ics: { Indonesia: 'Ekspor .ICS', English: 'Export .ICS' },
  impor_ics: { Indonesia: 'Impor .ICS', English: 'Import .ICS' },
  hari_ini_btn: { Indonesia: 'Hari ini', English: 'Today' },
  tugas_pada_tanggal: { Indonesia: 'Tugas pada tanggal ini', English: 'Tasks on this date' },
  tanggal_terpilih: { Indonesia: 'Tanggal terpilih', English: 'Selected date' },
  agenda_hari_ini: { Indonesia: 'Agenda hari ini', English: "Today's agenda" },
  tidak_ada_aktivitas_tanggal: {
    Indonesia: 'Belum ada aktivitas di tanggal ini.',
    English: 'No activities scheduled for this date.',
  },
  tambah_aktivitas: { Indonesia: 'Tambah aktivitas', English: 'Add activity' },
  bulan_sebelumnya: { Indonesia: 'Bulan sebelumnya', English: 'Previous month' },
  bulan_berikutnya: { Indonesia: 'Bulan berikutnya', English: 'Next month' },

  // Progress View
  kemajuanmu_berarti: { Indonesia: 'Kemajuanmu berarti.', English: 'Your progress matters.' },
  semua_target_selesai: {
    Indonesia: 'Semua target terselesaikan dengan sempurna!',
    English: 'All targets completed with excellence!',
  },
  langkah_lagi_hari_ini: {
    Indonesia: 'langkah lagi untuk hari ini.',
    English: 'steps left for today.',
  },
  total_semua_tugas: { Indonesia: 'Total tugas', English: 'Total tasks' },
  tingkat_penyelesaian: { Indonesia: 'Tingkat Penyelesaian', English: 'Completion Rate' },
  progres_per_kategori: { Indonesia: 'Progres per kategori', English: 'Progress by category' },
  sudah_kamu_selesaikan: { Indonesia: 'Sudah kamu selesaikan', English: 'Completed by you' },
  belum_ada_tugas_selesai: {
    Indonesia: 'Belum ada tugas yang ditandai selesai hari ini.',
    English: 'No tasks marked as completed today.',
  },

  // Category View
  setiap_peran_tertata: { Indonesia: 'Setiap peran, tertata.', English: 'Every role, structured.' },
  kategori_count: { Indonesia: 'kategori', English: 'categories' },
  tambah_kategori: { Indonesia: 'Tambah kategori', English: 'Add category' },
  belum_ada_tugas_kategori: {
    Indonesia: 'Belum ada tugas di kategori ini',
    English: 'No tasks in this category yet',
  },
  seimbangkan_harimu: { Indonesia: 'Seimbangkan harimu.', English: 'Balance your day.' },
  seimbangkan_subtext: {
    Indonesia: 'Menjaga proporsi antara pekerjaan dan kehidupan pribadi memberi ruang untuk pikiran yang lebih jernih dan produktivitas berkelanjutan.',
    English: 'Keeping a healthy balance between work and personal life makes room for a clearer mind and sustainable productivity.',
  },

  // Settings View
  settings_title: { Indonesia: 'Nyaman dengan caramu.', English: 'Comfortable your way.' },
  settings_subtitle: {
    Indonesia: 'Kelola profil dan sesuaikan DailyMate untuk harimu.',
    English: 'Manage your profile and customize DailyMate for your day.',
  },
  informasi_pribadi: { Indonesia: 'Informasi Pribadi', English: 'Personal Information' },
  ubah: { Indonesia: 'Ubah', English: 'Edit' },
  pekerjaan_status: { Indonesia: 'Pekerjaan / Status:', English: 'Occupation / Status:' },
  belum_diisi: { Indonesia: 'Belum diisi', English: 'Not specified' },
  umur_label: { Indonesia: 'Umur:', English: 'Age:' },
  alamat_label: { Indonesia: 'Alamat:', English: 'Address:' },
  kontak_label: { Indonesia: 'Kontak:', English: 'Contact:' },
  motto_label: { Indonesia: 'Motto:', English: 'Motto:' },
  privacy_callout: {
    Indonesia: 'Ruang pribadimu untuk merencanakan hari. Seluruh data tugas dan informasi profil tersimpan aman di browser Anda.',
    English: 'Your private space to plan your day. All task data and profile information are safely stored in your browser.',
  },
  preferensi: { Indonesia: 'Preferensi', English: 'Preferences' },
  notifikasi_pengingat_label: { Indonesia: 'Notifikasi & Pengingat', English: 'Notifications & Reminders' },
  notifikasi_pengingat_desc: {
    Indonesia: 'Pengingat otomatis tugas dan aktivitas',
    English: 'Automated reminders for tasks and activities',
  },
  mode_gelap_label: { Indonesia: 'Mode gelap', English: 'Dark mode' },
  mode_gelap_desc: {
    Indonesia: 'Tampilan lebih nyaman di malam hari',
    English: 'Comfortable viewing at night',
  },
  efek_suara_label: { Indonesia: 'Efek Suara', English: 'Sound Effects' },
  efek_suara_desc: {
    Indonesia: 'Bunyi saat pengingat aktif atau tugas tuntas',
    English: 'Audio chimes on reminders or task completion',
  },
  uji_notif_suara: { Indonesia: 'Uji Notifikasi & Suara Sekarang', English: 'Test Notification & Sound Now' },
  umum_section: { Indonesia: 'Umum', English: 'General' },
  bahasa_label: { Indonesia: 'Bahasa', English: 'Language' },
  awal_minggu_label: { Indonesia: 'Awal minggu', English: 'Start of week' },
  manajemen_data: { Indonesia: 'Manajemen Data & Cadangan', English: 'Data Management & Backup' },
  ekspor_cadangan: { Indonesia: 'Ekspor Cadangan (JSON)', English: 'Export Backup (JSON)' },
  pulihkan_cadangan: { Indonesia: 'Pulihkan Cadangan (JSON)', English: 'Restore Backup (JSON)' },
  reset_data_bawaan: { Indonesia: 'Reset Data Bawaan', English: 'Reset to Default Data' },
  tentang_dailymate: { Indonesia: 'Tentang DailyMate', English: 'About DailyMate' },
  asisten_aktivitas_harian: { Indonesia: 'Asisten Aktivitas Harian', English: 'Daily Activity Assistant' },
  footer_credit: { Indonesia: 'Dibuat untuk hari yang lebih teratur.', English: 'Crafted for a more structured day.' },

  // Friends View
  teman_komunitas: { Indonesia: 'Teman & Komunitas', English: 'Friends & Community' },
  teman_subtext: {
    Indonesia: 'Saling mengingatkan dan jaga akuntabilitas bersama rekan produktif.',
    English: 'Remind each other and stay accountable with your productive circle.',
  },
  daftar_teman: { Indonesia: 'Daftar Teman', English: 'Friends List' },
  tambah_teman_btn: { Indonesia: 'Tambah Teman', English: 'Add Friend' },
  aktif_sekarang: { Indonesia: 'Aktif sekarang', English: 'Active now' },
  sedang_fokus: { Indonesia: 'Sedang fokus', English: 'Focusing' },
  tidak_aktif: { Indonesia: 'Tidak aktif', English: 'Offline' },
  ingatkan_teman: { Indonesia: 'Ingatkan', English: 'Nudge' },
  kirim_pengingat_cepat: { Indonesia: 'Kirim Pengingat Cepat ke', English: 'Send Quick Nudge to' },
  tulis_pesan: { Indonesia: 'Tulis pesan penyemangat...', English: 'Type an encouraging message...' },
  kirim: { Indonesia: 'Kirim', English: 'Send' },
  buka_stiker: { Indonesia: 'Buka Stiker', English: 'Open Stickers' },
  buat_stiker_kustom: { Indonesia: 'Buat Stiker Kustom', English: 'Create Custom Sticker' },

  // Deletion modals
  hapus_tugas_modal_title: { Indonesia: 'Hapus Tugas Ini?', English: 'Delete This Task?' },
  hapus_tugas_modal_desc: {
    Indonesia: 'Tugas ini akan dihapus secara permanen dari daftar aktivitasmu. Tindakan ini tidak dapat dibatalkan.',
    English: 'This task will be permanently deleted from your activity list. This action cannot be undone.',
  },
  ya_hapus: { Indonesia: 'Ya, Hapus', English: 'Yes, Delete' },
  hapus_kategori_title: { Indonesia: 'Hapus Kategori?', English: 'Delete Category?' },

  // Units
  tahun: { Indonesia: 'tahun', English: 'years old' },
  menit: { Indonesia: 'menit', English: 'minutes' },
  jam: { Indonesia: 'jam', English: 'hour' },
};

export const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAY_NAMES_SHORT_ID = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
export const DAY_NAMES_SHORT_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const DAYS_LONG_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const DAYS_LONG_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  formatDate: (date?: Date | string) => string;
  getMonthNames: () => string[];
  getDayNamesShort: () => string[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'Indonesia',
  setLanguage: () => {},
  t: (key: string) => key,
  formatDate: () => '',
  getMonthNames: () => MONTH_NAMES_ID,
  getDayNamesShort: () => DAY_NAMES_SHORT_ID,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => storage.getLanguage());

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    storage.setLanguage(newLang);
  };

  const t = (key: string): string => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[language] || entry.Indonesia || key;
  };

  const getMonthNames = (): string[] => {
    return language === 'English' ? MONTH_NAMES_EN : MONTH_NAMES_ID;
  };

  const getDayNamesShort = (): string[] => {
    return language === 'English' ? DAY_NAMES_SHORT_EN : DAY_NAMES_SHORT_ID;
  };

  const formatDate = (dateInput?: Date | string): string => {
    let d: Date;
    if (dateInput instanceof Date) {
      d = dateInput;
    } else if (typeof dateInput === 'string' && dateInput.includes('-')) {
      const parts = dateInput.split('-').map(Number);
      if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
        d = new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        d = new Date(dateInput);
      }
    } else {
      d = new Date(2026, 9, 19);
    }

    const dayName = language === 'English' ? DAYS_LONG_EN[d.getDay()] : DAYS_LONG_ID[d.getDay()];
    const dayNum = d.getDate();
    const monthName = language === 'English' ? MONTH_NAMES_EN[d.getMonth()] : MONTH_NAMES_ID[d.getMonth()];
    const year = d.getFullYear();

    if (language === 'English') {
      return `${dayName}, ${monthName} ${dayNum}, ${year}`;
    }
    return `${dayName}, ${dayNum} ${monthName} ${year}`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatDate,
        getMonthNames,
        getDayNamesShort,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
