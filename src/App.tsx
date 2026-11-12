import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  Category,
  UserProfile,
  ViewTab,
  AppNotification,
  SubTask,
  Friend,
  Sticker,
  ChatMessage,
} from './types/task';
import { storage, getInitialTasks, getFormattedDate } from './services/storage';
import { soundService } from './services/sound';
import { reminderEngine } from './services/reminder';

// Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { SplashScreen } from './components/SplashScreen';
import { DashboardView } from './components/DashboardView';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { TaskDetail } from './components/TaskDetail';
import { CalendarView } from './components/CalendarView';
import { ProgressView } from './components/ProgressView';
import { CategoryView } from './components/CategoryView';
import { SettingsView } from './components/SettingsView';
import { ReminderModal } from './components/ReminderModal';
import { EditProfileModal } from './components/EditProfileModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { CommandPalette } from './components/CommandPalette';
import { FriendsView } from './components/FriendsView';
import { useLanguage } from './services/i18n';

export default function App() {
  const { language, t, formatDate } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [categories, setCategories] = useState<Category[]>(() => storage.getCategories());
  const [profile, setProfile] = useState<UserProfile>(() => storage.getProfile());
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    storage.getAppNotifications()
  );
  const [darkMode, setDarkMode] = useState<boolean>(() => storage.getDarkMode());
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() =>
    storage.getNotificationsEnabled()
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => storage.getSoundEnabled());

  // Friends, stickers & community chat
  const [friends, setFriends] = useState<Friend[]>(() => storage.getFriends());
  const [stickers, setStickers] = useState<Sticker[]>(() => storage.getStickers());
  const [messages, setMessages] = useState<ChatMessage[]>(() => storage.getMessages());

  const [showSplash, setShowSplash] = useState<boolean>(() => !storage.hasSeenSplash());
  const [currentTab, setCurrentTab] = useState<ViewTab>('beranda');

  // Navigation & sub-views
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Modals
  const [activeReminderTask, setActiveReminderTask] = useState<Task | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  // Sync dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storage.setDarkMode(darkMode);
  }, [darkMode]);

  // Sync tasks with storage and reminder engine
  useEffect(() => {
    storage.saveTasks(tasks);
    reminderEngine.init(tasks);
  }, [tasks]);

  // Initialize reminder engine subscriber
  useEffect(() => {
    reminderEngine.init(tasks);
    const unsubscribe = reminderEngine.subscribe((dueTask) => {
      setActiveReminderTask(dueTask);
    });

    return () => {
      unsubscribe();
      reminderEngine.stop();
    };
  }, []);

  // Request browser notification permission once on app launch
  useEffect(() => {
    if (reminderEngine.isNotificationSupported() && Notification.permission === 'default') {
      reminderEngine.requestNotificationPermission();
    }
  }, []);

  // Global keyboard shortcut for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Formatted date string adapted to current language
  const currentDateText = formatDate('2026-10-19');

  // Toggle dark mode
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Toggle task completion
  const handleToggleTask = (taskId: string) => {
    let justCompleted = false;
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) justCompleted = true;
        return {
          ...t,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });

    setTasks(updated);

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask((prev) => (prev ? { ...prev, completed: !prev.completed } : null));
    }

    if (justCompleted) {
      if (soundEnabled) soundService.playSuccessChime();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#4f46e5', '#10b981', '#f59e0b'],
        });
      } catch {
        // ignore
      }
    }
  };

  // Save new or edited task
  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskToEdit && taskToEdit.id) {
      // Editing existing task
      const updated = tasks.map((t) => (t.id === taskToEdit.id ? ({ ...t, ...taskData } as Task) : t));
      setTasks(updated);
      if (selectedTask?.id === taskToEdit.id) {
        setSelectedTask({ ...selectedTask, ...taskData } as Task);
      }
    } else {
      // Adding new task
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskData.title || 'Tugas Baru',
        notes: taskData.notes || '',
        categoryId: taskData.categoryId || categories[0]?.id || 'pekerjaan',
        date: taskData.date || getFormattedDate(),
        time: taskData.time || '09:00',
        recurrence: taskData.recurrence || 'Tidak ada',
        priority: taskData.priority || 'Sedang',
        completed: false,
        reminderEnabled: taskData.reminderEnabled ?? true,
        reminderMinutesBefore: taskData.reminderMinutesBefore || 10,
        subtasks: taskData.subtasks || [],
        createdAt: new Date().toISOString(),
      };
      setTasks([newTask, ...tasks]);
    }

    setIsTaskFormOpen(false);
    setTaskToEdit(null);
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    storage.saveTasks(updated);
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  // Update subtasks
  const handleUpdateSubtasks = (taskId: string, subtasks: SubTask[]) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, subtasks } : t));
    setTasks(updated);
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, subtasks });
    }
  };

  // Reminder snooze
  const handleSnoozeReminder = (task: Task, minutes: number) => {
    const [h, m] = task.time.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m + minutes, 0, 0);
    const newTime = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

    const updated = tasks.map((t) => (t.id === task.id ? { ...t, time: newTime } : t));
    setTasks(updated);
    setActiveReminderTask(null);
  };

  // Add custom category
  const handleAddCategory = (newCat: Category) => {
    const updated = [...categories, newCat];
    setCategories(updated);
    storage.saveCategories(updated);
  };

  // Delete category and reassign its tasks to remaining category
  const handleDeleteCategory = (categoryId: string) => {
    if (categories.length <= 1) {
      alert('Minimal harus ada 1 kategori aktif.');
      return;
    }
    const remainingCats = categories.filter((c) => c.id !== categoryId);
    const fallbackCategory = remainingCats[0];

    // Reassign tasks that belonged to the deleted category
    const updatedTasks = tasks.map((t) =>
      t.categoryId === categoryId ? { ...t, categoryId: fallbackCategory.id } : t
    );

    setCategories(remainingCats);
    setTasks(updatedTasks);
    storage.saveCategories(remainingCats);
    storage.saveTasks(updatedTasks);
  };

  // Save profile
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    storage.saveProfile(newProfile);
  };

  // Friend chat & reminder actions
  const handleSendMessage = (msgData: Partial<ChatMessage>) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      friendId: msgData.friendId || 'friend-1',
      sender: msgData.sender || 'me',
      type: msgData.type || 'text',
      content: msgData.content || '',
      sticker: msgData.sticker,
      voiceDuration: msgData.voiceDuration,
      timestamp: Date.now(),
      timeStr:
        msgData.timeStr ||
        new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    storage.saveMessages(updated);
  };

  const handleAddFriend = (newFriend: Friend) => {
    const updated = [...friends, newFriend];
    setFriends(updated);
    storage.saveFriends(updated);
  };

  const handleSaveCustomSticker = (newSticker: Sticker) => {
    const updated = [...stickers, newSticker];
    setStickers(updated);
    storage.saveStickers(updated);
  };

  // Reset to initial sample data
  const handleResetData = () => {
    const initial = getInitialTasks();
    setTasks(initial);
    storage.saveTasks(initial);
  };

  // Restore imported tasks
  const handleRestoreBackup = (importedTasks: Task[]) => {
    setTasks(importedTasks);
    storage.saveTasks(importedTasks);
  };

  // Import from ICS
  const handleImportCalendarTasks = (importedTasks: Partial<Task>[]) => {
    const newItems: Task[] = importedTasks.map((t, index) => ({
      id: `task-imported-${Date.now()}-${index}`,
      title: t.title || 'Aktivitas Kalender',
      notes: t.notes || '',
      categoryId: t.categoryId || 'pekerjaan',
      date: t.date || getFormattedDate(),
      time: t.time || '10:00',
      recurrence: 'Tidak ada',
      priority: 'Sedang',
      completed: false,
      reminderEnabled: true,
      reminderMinutesBefore: 10,
      subtasks: [],
      createdAt: new Date().toISOString(),
    }));

    setTasks([...newItems, ...tasks]);
  };

  // Notifications helpers
  const handleClearNotifications = () => {
    setNotifications([]);
    storage.saveAppNotifications([]);
  };

  const handleMarkNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    storage.saveAppNotifications(updated);
  };

  // Pending task counter for badges
  const pendingCount = tasks.filter((t) => !t.completed).length;

  // If splash is active, show splash view
  if (showSplash) {
    return (
      <SplashScreen
        onStart={() => {
          setShowSplash(false);
          storage.setSeenSplash(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSelectedTask(null);
          setIsTaskFormOpen(false);
        }}
        pendingTaskCount={pendingCount}
        onOpenHelpModal={() => setCurrentTab('pengaturan')}
        onLogoClick={() => setShowSplash(true)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Header Bar */}
        <Header
          currentTab={currentTab}
          currentDateText={currentDateText}
          profile={profile}
          darkMode={darkMode}
          notifications={notifications}
          onToggleDarkMode={handleToggleDarkMode}
          onNavigateTab={(tab) => {
            setCurrentTab(tab);
            setSelectedTask(null);
            setIsTaskFormOpen(false);
          }}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onClearNotifications={handleClearNotifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onEditProfile={() => setIsEditProfileOpen(true)}
          onOpenSplash={() => setShowSplash(true)}
        />

        {/* Content View Router */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {/* Subview 1: Add or Edit Task Form */}
          {isTaskFormOpen ? (
            <TaskForm
              initialTask={taskToEdit}
              categories={categories}
              onSave={handleSaveTask}
              onCancel={() => {
                setIsTaskFormOpen(false);
                setTaskToEdit(null);
              }}
              onDelete={handleDeleteTask}
            />
          ) : selectedTask ? (
            /* Subview 2: Task Detail View */
            <TaskDetail
              task={selectedTask}
              category={categories.find((c) => c.id === selectedTask.categoryId)}
              onBack={() => setSelectedTask(null)}
              onEdit={(task) => {
                setTaskToEdit(task);
                setIsTaskFormOpen(true);
              }}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleTask}
              onUpdateSubtasks={handleUpdateSubtasks}
            />
          ) : currentTab === 'beranda' ? (
            /* View: Beranda (Dashboard) */
            <DashboardView
              tasks={tasks}
              categories={categories}
              profile={profile}
              currentDateText={currentDateText}
              onToggleTask={handleToggleTask}
              onSelectTask={setSelectedTask}
              onAddTask={() => {
                setTaskToEdit(null);
                setIsTaskFormOpen(true);
              }}
              onViewAllTasks={() => setCurrentTab('tugas')}
              onViewCalendar={() => setCurrentTab('kalender')}
            />
          ) : currentTab === 'tugas' ? (
            /* View: Daftar Tugas */
            <TaskList
              tasks={tasks}
              categories={categories}
              currentDateText={currentDateText}
              onToggleTask={handleToggleTask}
              onSelectTask={setSelectedTask}
              onAddTask={() => {
                setTaskToEdit(null);
                setIsTaskFormOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
            />
          ) : currentTab === 'kalender' ? (
            /* View: Kalender & Agenda */
            <CalendarView
              tasks={tasks}
              categories={categories}
              onToggleTask={handleToggleTask}
              onSelectTask={setSelectedTask}
              onAddTaskOnDate={(dateStr) => {
                setTaskToEdit({
                  id: '',
                  title: '',
                  categoryId: 'pekerjaan',
                  date: dateStr,
                  time: '12:00',
                  recurrence: 'Tidak ada',
                  priority: 'Sedang',
                  completed: false,
                  reminderEnabled: true,
                  reminderMinutesBefore: 10,
                  subtasks: [],
                  createdAt: new Date().toISOString(),
                });
                setIsTaskFormOpen(true);
              }}
              onImportTasks={handleImportCalendarTasks}
            />
          ) : currentTab === 'progress' ? (
            /* View: Progress & Analytics */
            <ProgressView
              tasks={tasks}
              categories={categories}
              currentDateText={currentDateText}
              onSelectTask={setSelectedTask}
            />
          ) : currentTab === 'kategori' ? (
            /* View: Kategori */
            <CategoryView
              tasks={tasks}
              categories={categories}
              currentDateText={currentDateText}
              onSelectTask={setSelectedTask}
              onOpenAddCategory={() => setIsAddCategoryOpen(true)}
              onDeleteCategory={handleDeleteCategory}
            />
          ) : currentTab === 'teman' ? (
            /* View: Teman, Pengingat Bersama & Obrolan */
            <FriendsView
              friends={friends}
              stickers={stickers}
              messages={messages}
              tasks={tasks}
              onSendMessage={handleSendMessage}
              onAddFriend={handleAddFriend}
              onSaveCustomSticker={handleSaveCustomSticker}
            />
          ) : (
            /* View: Pengaturan */
            <SettingsView
              profile={profile}
              darkMode={darkMode}
              notificationsEnabled={notificationsEnabled}
              soundEnabled={soundEnabled}
              tasks={tasks}
              onToggleDarkMode={handleToggleDarkMode}
              onToggleNotifications={() => {
                const next = !notificationsEnabled;
                setNotificationsEnabled(next);
                storage.setNotificationsEnabled(next);
              }}
              onToggleSound={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                storage.setSoundEnabled(next);
              }}
              onEditProfile={() => setIsEditProfileOpen(true)}
              onResetData={handleResetData}
              onRestoreBackup={handleRestoreBackup}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSelectedTask(null);
          setIsTaskFormOpen(false);
        }}
        pendingTaskCount={pendingCount}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Automated Reminder Modal Alert */}
      {activeReminderTask && (
        <ReminderModal
          task={activeReminderTask}
          categories={categories}
          onClose={() => setActiveReminderTask(null)}
          onSnooze={handleSnoozeReminder}
          onComplete={handleToggleTask}
          onViewTask={(task) => {
            setSelectedTask(task);
            setActiveReminderTask(null);
          }}
        />
      )}

      {/* Quick Search & Command Palette (⌘K) */}
      {isCommandPaletteOpen && (
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          tasks={tasks}
          darkMode={darkMode}
          onClose={() => setIsCommandPaletteOpen(false)}
          onSelectTask={(task) => {
            setSelectedTask(task);
            setIsCommandPaletteOpen(false);
          }}
          onNavigateTab={(tab) => {
            setCurrentTab(tab);
            setSelectedTask(null);
            setIsTaskFormOpen(false);
          }}
          onAddTask={() => {
            setTaskToEdit(null);
            setIsTaskFormOpen(true);
          }}
          onToggleDarkMode={handleToggleDarkMode}
        />
      )}

      {/* Profile Edit Modal */}
      {isEditProfileOpen && (
        <EditProfileModal
          profile={profile}
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* Add Custom Category Modal */}
      {isAddCategoryOpen && (
        <AddCategoryModal
          isOpen={isAddCategoryOpen}
          onClose={() => setIsAddCategoryOpen(false)}
          onAdd={handleAddCategory}
        />
      )}
    </div>
  );
}
