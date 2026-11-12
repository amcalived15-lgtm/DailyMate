import { Task, AppNotification } from '../types/task';
import { soundService } from './sound';
import { storage } from './storage';

export type ReminderTriggerHandler = (task: Task) => void;

class ReminderEngine {
  private intervalId: number | null = null;
  private listeners: Set<ReminderTriggerHandler> = new Set();
  private triggeredTaskIds: Set<string> = new Set();

  public init(tasks: Task[]) {
    if (typeof window === 'undefined') return;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Check every 15 seconds
    this.intervalId = window.setInterval(() => {
      this.checkTasks(tasks);
    }, 15000);

    // Initial immediate check
    this.checkTasks(tasks);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public subscribe(handler: ReminderTriggerHandler) {
    this.listeners.add(handler);
    return () => {
      this.listeners.delete(handler);
    };
  }

  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    if (Notification.permission === 'granted') {
      return 'granted';
    }
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  public isNotificationSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermissionStatus(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  public checkTasks(tasks: Task[]) {
    if (!storage.getNotificationsEnabled()) return;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    tasks.forEach((task) => {
      if (!task.reminderEnabled || task.completed) return;

      const triggerKey = `${task.id}_${task.date}_${task.time}_${task.reminderMinutesBefore}`;
      if (this.triggeredTaskIds.has(triggerKey)) return;

      try {
        const [tYear, tMonth, tDay] = task.date.split('-').map(Number);
        const [tHour, tMinute] = task.time.split(':').map(Number);

        const taskDateTime = new Date(tYear, tMonth - 1, tDay, tHour, tMinute);
        const reminderMinutes = task.reminderMinutesBefore || 10;
        const reminderTime = new Date(taskDateTime.getTime() - reminderMinutes * 60 * 1000);

        // Check if reminder is due (difference is within 1 minute or just passed within 5 minutes)
        const diffMs = now.getTime() - reminderTime.getTime();
        const diffMinutes = diffMs / (1000 * 60);

        // If reminder window matches (-0.5m to +5m)
        if (diffMinutes >= -0.5 && diffMinutes <= 5) {
          this.triggeredTaskIds.add(triggerKey);
          this.fireReminder(task);
        }
      } catch {
        // ignore format errors
      }
    });
  }

  public fireReminder(task: Task) {
    // 1. Play audio chime if enabled
    if (storage.getSoundEnabled()) {
      soundService.playReminderChime();
    }

    // 2. Native Web Notification if supported & granted
    if (this.isNotificationSupported() && Notification.permission === 'granted') {
      try {
        new Notification(`⏰ Pengingat: ${task.title}`, {
          body: `Waktu aktivitas: ${task.time}. ${task.notes || 'Waktunya menyelesaikan aktivitasmu!'}`,
          icon: '/favicon.ico',
        });
      } catch {
        // Fallback gracefully
      }
    }

    // 3. Add to notification history
    const notifs = storage.getAppNotifications();
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      taskId: task.id,
      title: `Pengingat: ${task.title}`,
      message: `Aktivitas terjadwal pukul ${task.time} (${task.reminderMinutesBefore} menit lagi).`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      timestamp: Date.now(),
    };
    storage.saveAppNotifications([newNotif, ...notifs.slice(0, 19)]);

    // 4. Trigger UI listeners (modal / toast)
    this.listeners.forEach((listener) => listener(task));
  }

  /**
   * Manually test a reminder right now
   */
  public testReminder(task?: Task) {
    const dummyTask: Task = task || {
      id: 'test-reminder',
      title: 'Menyiapkan Presentasi',
      notes: 'Siapkan bahan presentasi dan susun poin utama untuk rapat tim.',
      categoryId: 'pekerjaan',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      recurrence: 'Setiap Senin',
      priority: 'Tinggi',
      completed: false,
      reminderEnabled: true,
      reminderMinutesBefore: 10,
      subtasks: [],
      createdAt: new Date().toISOString(),
    };

    this.fireReminder(dummyTask);
  }
}

export const reminderEngine = new ReminderEngine();
