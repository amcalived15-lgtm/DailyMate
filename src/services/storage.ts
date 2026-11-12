import { Task, Category, UserProfile, AppNotification, Friend, Sticker, ChatMessage } from '../types/task';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'pekerjaan',
    name: 'Pekerjaan',
    icon: 'briefcase',
    color: '#4f46e5',
    bgLight: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    bgDark: 'dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-900/50',
  },
  {
    id: 'rumah',
    name: 'Rumah',
    icon: 'home',
    color: '#10b981',
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    bgDark: 'dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/50',
  },
  {
    id: 'pribadi',
    name: 'Pribadi',
    icon: 'heart',
    color: '#ec4899',
    bgLight: 'bg-rose-50 text-rose-700 border-rose-100',
    bgDark: 'dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/50',
  },
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Nadia Putri',
  email: 'nadia.putri@email.com',
  initials: 'NP',
  accountType: 'Akun pribadi',
  occupation: 'Pekerja Kantoran',
  address: 'Jakarta Selatan, DKI Jakarta',
  age: 26,
  bio: 'Disiplin adalah jembatan antara tujuan dan pencapaian.',
  phone: '+62 812-3456-7890',
};

// Returns date string in YYYY-MM-DD
export function getFormattedDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate sample tasks matching the exact mockup
export function getInitialTasks(): Task[] {
  // Use today's date or 2026-10-19
  const today = getFormattedDate();

  return [
    {
      id: 'task-1',
      title: 'Olahraga Pagi',
      notes: 'Jogging 30 menit keliling taman kompleks dan peregangan ringan.',
      categoryId: 'pribadi',
      date: today,
      time: '06:30',
      recurrence: 'Setiap Hari',
      priority: 'Sedang',
      completed: true,
      reminderEnabled: true,
      reminderMinutesBefore: 15,
      subtasks: [
        { id: 'sub-1-1', title: 'Pemanasan 5 menit', completed: true },
        { id: 'sub-1-2', title: 'Lari santai 2.5 km', completed: true },
      ],
      createdAt: `${today}T06:00:00`,
      completedAt: `${today}T07:15:00`,
    },
    {
      id: 'task-2',
      title: 'Membaca Buku',
      notes: 'Lanjutkan membaca bab 4 Atomic Habits.',
      categoryId: 'pribadi',
      date: today,
      time: '12:30',
      recurrence: 'Tidak ada',
      priority: 'Rendah',
      completed: true,
      reminderEnabled: false,
      reminderMinutesBefore: 10,
      subtasks: [],
      createdAt: `${today}T11:00:00`,
      completedAt: `${today}T13:00:00`,
    },
    {
      id: 'task-3',
      title: 'Membeli Kebutuhan',
      notes: 'Bahan makanan mingguan di supermarket.',
      categoryId: 'rumah',
      date: today,
      time: '16:00',
      recurrence: 'Setiap Minggu',
      priority: 'Sedang',
      completed: true,
      reminderEnabled: true,
      reminderMinutesBefore: 30,
      subtasks: [
        { id: 'sub-3-1', title: 'Sayuran & buah segar', completed: true },
        { id: 'sub-3-2', title: 'Susu almond & telur', completed: true },
      ],
      createdAt: `${today}T14:00:00`,
      completedAt: `${today}T16:45:00`,
    },
    {
      id: 'task-4',
      title: 'Menyiapkan Presentasi',
      notes: 'Siapkan bahan presentasi dan susun poin utama untuk rapat tim.',
      categoryId: 'pekerjaan',
      date: today,
      time: '19:00',
      recurrence: 'Setiap Senin',
      priority: 'Tinggi',
      completed: false,
      reminderEnabled: true,
      reminderMinutesBefore: 10,
      subtasks: [
        { id: 'sub-4-1', title: 'Kumpulkan bahan presentasi', completed: true },
        { id: 'sub-4-2', title: 'Susun 5 slide utama', completed: false },
      ],
      createdAt: `${today}T08:00:00`,
    },
    {
      id: 'task-5',
      title: 'Menyusun Laporan',
      notes: 'Finalisasi laporan evaluasi bulanan dan kirim ke manajer.',
      categoryId: 'pekerjaan',
      date: today,
      time: '20:00',
      recurrence: 'Tidak ada',
      priority: 'Sedang',
      completed: false,
      reminderEnabled: true,
      reminderMinutesBefore: 15,
      subtasks: [
        { id: 'sub-5-1', title: 'Cek angka metrik', completed: false },
        { id: 'sub-5-2', title: 'Export ke format PDF', completed: false },
      ],
      createdAt: `${today}T09:30:00`,
    },
  ];
}

const STORAGE_KEYS = {
  TASKS: 'dailymate_tasks',
  CATEGORIES: 'dailymate_categories',
  PROFILE: 'dailymate_profile',
  DARK_MODE: 'dailymate_dark_mode',
  NOTIFICATIONS_ENABLED: 'dailymate_notifications_enabled',
  SOUND_ENABLED: 'dailymate_sound_enabled',
  FIRST_VISIT_DONE: 'dailymate_first_visit_done',
  APP_NOTIFICATIONS: 'dailymate_app_notifications',
  LANGUAGE: 'dailymate_language',
};

export const storage = {
  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    const initial = getInitialTasks();
    this.saveTasks(initial);
    return initial;
  },

  saveTasks(tasks: Task[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  },

  getCategories(): Category[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    this.saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  },

  saveCategories(cats: Category[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
    } catch {
      // ignore
    }
  },

  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  },

  getDarkMode(): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      return data ? JSON.parse(data) : false;
    } catch {
      return false;
    }
  },

  setDarkMode(val: boolean) {
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(val));
    } catch {
      // ignore
    }
  },

  getNotificationsEnabled(): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
      return data !== null ? JSON.parse(data) : true;
    } catch {
      return true;
    }
  },

  setNotificationsEnabled(val: boolean) {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, JSON.stringify(val));
    } catch {
      // ignore
    }
  },

  getSoundEnabled(): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      return data !== null ? JSON.parse(data) : true;
    } catch {
      return true;
    }
  },

  setSoundEnabled(val: boolean) {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(val));
    } catch {
      // ignore
    }
  },

  hasSeenSplash(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.FIRST_VISIT_DONE) === 'true';
    } catch {
      return false;
    }
  },

  setSeenSplash(val: boolean) {
    try {
      localStorage.setItem(STORAGE_KEYS.FIRST_VISIT_DONE, val ? 'true' : 'false');
    } catch {
      // ignore
    }
  },

  getLanguage(): 'Indonesia' | 'English' {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return data === 'English' ? 'English' : 'Indonesia';
    } catch {
      return 'Indonesia';
    }
  },

  setLanguage(lang: 'Indonesia' | 'English') {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch {
      // ignore
    }
  },

  getAppNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APP_NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [
      {
        id: 'notif-1',
        taskId: 'task-4',
        title: 'Pengingat: Menyiapkan Presentasi',
        message: 'Aktivitas terjadwal pukul 19:00 (10 menit lagi). Siapkan bahan presentasi Anda.',
        time: '18:50',
        read: false,
        timestamp: Date.now() - 1000 * 60 * 10,
      },
      {
        id: 'notif-2',
        taskId: 'task-3',
        title: 'Tugas Selesai',
        message: 'Bagus! Anda telah menyelesaikan "Membeli Kebutuhan".',
        time: '16:45',
        read: true,
        timestamp: Date.now() - 1000 * 60 * 120,
      },
    ];
  },

  saveAppNotifications(notifications: AppNotification[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_NOTIFICATIONS, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  },

  getFriends(): Friend[] {
    try {
      const data = localStorage.getItem('dailymate_friends');
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    const initial: Friend[] = [
      {
        id: 'friend-1',
        name: 'Dimas Pratama',
        initials: 'DP',
        occupation: 'Pekerja Kantoran',
        status: 'online',
        currentTaskTitle: 'Review Desain UI/UX Presentasi',
        tasksCompletedToday: 4,
        streakDays: 7,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
      },
      {
        id: 'friend-2',
        name: 'Rina Safitri',
        initials: 'RS',
        occupation: 'Anak Kuliahan',
        status: 'fokus',
        currentTaskTitle: 'Mengerjakan Skripsi Bab 3',
        tasksCompletedToday: 3,
        streakDays: 12,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
      },
      {
        id: 'friend-3',
        name: 'Budi Santoso',
        initials: 'BS',
        occupation: 'Pengajar',
        status: 'online',
        currentTaskTitle: 'Membuat Silabus Pelatihan',
        tasksCompletedToday: 2,
        streakDays: 5,
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
      },
      {
        id: 'friend-4',
        name: 'Maya Lestari',
        initials: 'ML',
        occupation: 'Ibu/Bapak Rumah Tangga',
        status: 'offline',
        currentTaskTitle: 'Persiapan Masak & Stok Makanan',
        tasksCompletedToday: 5,
        streakDays: 18,
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
      },
    ];
    this.saveFriends(initial);
    return initial;
  },

  saveFriends(friends: Friend[]) {
    try {
      localStorage.setItem('dailymate_friends', JSON.stringify(friends));
    } catch {
      // ignore
    }
  },

  getStickers(): Sticker[] {
    try {
      const data = localStorage.getItem('dailymate_stickers');
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    const initial: Sticker[] = [
      { id: 'st-1', title: 'Semangat!', emoji: '💪', tag: 'Motivasi', bgColor: '#4f46e5', textColor: '#ffffff' },
      { id: 'st-2', title: 'Hebat Sekali!', emoji: '🎉', tag: 'Selamat', bgColor: '#10b981', textColor: '#ffffff' },
      { id: 'st-3', title: 'Fokus Dulu', emoji: '🎯', tag: 'Fokus', bgColor: '#f59e0b', textColor: '#ffffff' },
      { id: 'st-4', title: 'Sudah Selesai!', emoji: '✅', tag: 'Tuntas', bgColor: '#06b6d4', textColor: '#ffffff' },
      { id: 'st-5', title: 'Rehat Sejenak', emoji: '☕', tag: 'Istirahat', bgColor: '#8b5cf6', textColor: '#ffffff' },
      { id: 'st-6', title: 'Deadline Dekat!', emoji: '⏰', tag: 'Waspada', bgColor: '#ef4444', textColor: '#ffffff' },
      { id: 'st-7', title: 'Kerja Bagus', emoji: '⭐', tag: 'Apresiasi', bgColor: '#ec4899', textColor: '#ffffff' },
      { id: 'st-8', title: 'Minum Air Dulu', emoji: '💧', tag: 'Sehat', bgColor: '#3b82f6', textColor: '#ffffff' },
    ];
    this.saveStickers(initial);
    return initial;
  },

  saveStickers(stickers: Sticker[]) {
    try {
      localStorage.setItem('dailymate_stickers', JSON.stringify(stickers));
    } catch {
      // ignore
    }
  },

  getMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem('dailymate_messages');
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    const initial: ChatMessage[] = [
      {
        id: 'msg-1',
        friendId: 'friend-1',
        sender: 'friend',
        type: 'text',
        content: 'Hai Nadia! Jangan lupa nanti malam ada jadwal Menyiapkan Presentasi ya jam 19.00 👍',
        timestamp: Date.now() - 1000 * 60 * 45,
        timeStr: '18:15',
      },
      {
        id: 'msg-2',
        friendId: 'friend-1',
        sender: 'me',
        type: 'text',
        content: 'Iya Dimas, terima kasih sudah diingatkan! Bahan materinya sudah siap sebagian.',
        timestamp: Date.now() - 1000 * 60 * 30,
        timeStr: '18:30',
      },
      {
        id: 'msg-3',
        friendId: 'friend-1',
        sender: 'friend',
        type: 'sticker',
        content: 'Semangat!',
        sticker: { id: 'st-1', title: 'Semangat!', emoji: '💪', tag: 'Motivasi', bgColor: '#4f46e5', textColor: '#ffffff' },
        timestamp: Date.now() - 1000 * 60 * 28,
        timeStr: '18:32',
      },
    ];
    this.saveMessages(initial);
    return initial;
  },

  saveMessages(messages: ChatMessage[]) {
    try {
      localStorage.setItem('dailymate_messages', JSON.stringify(messages));
    } catch {
      // ignore
    }
  },
};
