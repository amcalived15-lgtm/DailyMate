export type Priority = 'Rendah' | 'Sedang' | 'Tinggi';

export type Recurrence = 'Tidak ada' | 'Setiap Hari' | 'Setiap Senin' | 'Setiap Minggu' | 'Setiap Bulan';

export type CategoryId = 'pekerjaan' | 'rumah' | 'pribadi' | string;

export interface Category {
  id: CategoryId;
  name: string;
  icon: 'briefcase' | 'home' | 'heart' | 'book' | 'star' | 'coffee';
  color: string; // Tailwind color class or hex
  bgLight: string;
  bgDark: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  categoryId: CategoryId;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  recurrence: Recurrence;
  priority: Priority;
  completed: boolean;
  reminderEnabled: boolean;
  reminderMinutesBefore: number; // e.g. 5, 10, 15, 30, 60
  subtasks: SubTask[];
  createdAt: string;
  completedAt?: string;
  reminderTriggered?: boolean;
}

export type OccupationType =
  | 'Pelajar'
  | 'Anak Kuliahan'
  | 'Pekerja Kantoran'
  | 'Pengajar'
  | 'Ibu/Bapak Rumah Tangga'
  | 'Freelancer / Wirausaha'
  | 'Lainnya';

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  accountType: string;
  avatarUrl?: string;
  // Personal optional info
  occupation?: OccupationType | string;
  address?: string;
  age?: number | string;
  bio?: string;
  phone?: string;
}

export interface AppNotification {
  id: string;
  taskId: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  timestamp: number;
}

export type ViewTab = 'beranda' | 'tugas' | 'kalender' | 'progress' | 'kategori' | 'teman' | 'pengaturan';

// Friends & Social accountability features
export interface Friend {
  id: string;
  name: string;
  avatarUrl?: string;
  initials: string;
  occupation: string;
  status: 'online' | 'offline' | 'fokus';
  currentTaskTitle?: string;
  tasksCompletedToday: number;
  streakDays: number;
}

export interface Sticker {
  id: string;
  title: string;
  emoji: string;
  tag: string;
  imageUrl?: string;
  bgColor?: string;
  textColor?: string;
  isCustom?: boolean;
}

export interface ChatMessage {
  id: string;
  friendId: string;
  sender: 'me' | 'friend';
  type: 'text' | 'reminder' | 'voice' | 'sticker';
  content: string;
  sticker?: Sticker;
  voiceDuration?: number; // in seconds
  voiceAudioUrl?: string;
  timestamp: number;
  timeStr: string;
}

export interface ActiveCall {
  friend: Friend;
  type: 'voice' | 'video';
  isMuted: boolean;
  isVideoOff: boolean;
  durationSeconds: number;
}
