import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  Video,
  Bell,
  Send,
  Smile,
  Mic,
  MicOff,
  Play,
  Pause,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Plus,
  X,
  Volume2,
} from 'lucide-react';
import { Friend, ChatMessage, Sticker, Task } from '../types/task';
import { soundService } from '../services/sound';
import { VoiceCallModal } from './VoiceCallModal';
import { VideoCallModal } from './VideoCallModal';
import { StickerCreatorModal } from './StickerCreatorModal';

import { useLanguage } from '../services/i18n';

interface FriendsViewProps {
  friends: Friend[];
  stickers: Sticker[];
  messages: ChatMessage[];
  tasks: Task[];
  onSendMessage: (msg: Partial<ChatMessage>) => void;
  onAddFriend: (friend: Friend) => void;
  onSaveCustomSticker: (sticker: Sticker) => void;
}

const QUICK_NUDGES_ID = [
  '⏰ Yuk selesaikan tugas pentingmu hari ini!',
  '💪 Sedikit lagi tuntas, kamu pasti bisa!',
  '🎯 Waktunya fokus 25 menit tanpa distraksi!',
  '☕ Jangan lupa istirahat sejenak dan minum air!',
  '🎉 Bagus sekali progres tugasmu hari ini!',
];

const QUICK_NUDGES_EN = [
  "⏰ Time to tackle today's key tasks!",
  "💪 Almost done, you've got this!",
  '🎯 25-minute deep focus session starts now!',
  '☕ Remember to take a quick breather and stay hydrated!',
  '🎉 Amazing progress on your tasks today!',
];

export const FriendsView: React.FC<FriendsViewProps> = ({
  friends,
  stickers,
  messages,
  tasks,
  onSendMessage,
  onAddFriend,
  onSaveCustomSticker,
}) => {
  const { language, t } = useLanguage();
  const quickNudges = language === 'English' ? QUICK_NUDGES_EN : QUICK_NUDGES_ID;
  const [selectedFriend, setSelectedFriend] = useState<Friend>(friends[0]);
  const [inputText, setInputText] = useState('');
  const [showStickerTray, setShowStickerTray] = useState(false);
  const [showNudgePicker, setShowNudgePicker] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Active call modals
  const [activeVoiceCall, setActiveVoiceCall] = useState<Friend | null>(null);
  const [activeVideoCall, setActiveVideoCall] = useState<Friend | null>(null);

  // Sticker creator modal
  const [isStickerCreatorOpen, setIsStickerCreatorOpen] = useState(false);

  // Add friend modal
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendOccupation, setNewFriendOccupation] = useState('Pekerja Kantoran');

  // Audio note playback simulation
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Filter messages for current friend conversation
  const currentMessages = messages.filter(
    (m) => m.friendId === selectedFriend?.id
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length]);

  // Voice note recording counter
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVoiceRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isVoiceRecording]);

  const handleSendText = () => {
    if (!inputText.trim() || !selectedFriend) return;
    onSendMessage({
      friendId: selectedFriend.id,
      sender: 'me',
      type: 'text',
      content: inputText.trim(),
      timeStr: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });
    setInputText('');
  };

  const handleSendSticker = (sticker: Sticker) => {
    if (!selectedFriend) return;
    onSendMessage({
      friendId: selectedFriend.id,
      sender: 'me',
      type: 'sticker',
      content: sticker.title,
      sticker,
      timeStr: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });
    setShowStickerTray(false);
    soundService.playSuccessChime();
  };

  const handleSendNudge = (nudgeText: string) => {
    if (!selectedFriend) return;
    onSendMessage({
      friendId: selectedFriend.id,
      sender: 'me',
      type: 'reminder',
      content: nudgeText,
      timeStr: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });
    setShowNudgePicker(false);
    soundService.playReminderChime();
  };

  const handleSendVoiceNote = () => {
    if (!selectedFriend) return;
    const duration = Math.max(recordingSeconds, 3);
    setIsVoiceRecording(false);
    onSendMessage({
      friendId: selectedFriend.id,
      sender: 'me',
      type: 'voice',
      content: `Pesan Suara (${duration}s)`,
      voiceDuration: duration,
      timeStr: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    });
    soundService.playSuccessChime();
  };

  const handlePlayVoice = (id: string) => {
    if (playingVoiceId === id) {
      setPlayingVoiceId(null);
    } else {
      setPlayingVoiceId(id);
      soundService.playReminderChime();
      setTimeout(() => setPlayingVoiceId(null), 3500);
    }
  };

  const handleCreateFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;

    const parts = newFriendName.trim().split(/\s+/);
    const initials = parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : newFriendName.slice(0, 2).toUpperCase();

    const newF: Friend = {
      id: `friend-${Date.now()}`,
      name: newFriendName.trim(),
      initials,
      occupation: newFriendOccupation,
      status: 'online',
      currentTaskTitle: 'Mulai aktivitas produktif baru',
      tasksCompletedToday: 0,
      streakDays: 1,
    };

    onAddFriend(newF);
    setSelectedFriend(newF);
    setNewFriendName('');
    setIsAddFriendOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {language === 'English' ? 'Friends & Accountability' : 'Teman & Saling Mengingatkan'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {t('teman_subtext')}
          </p>
        </div>

        <button
          onClick={() => setIsAddFriendOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('tambah_teman_btn')}</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden h-[640px]">
        {/* Left Column: Friends List */}
        <div className="lg:col-span-4 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/60">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {t('daftar_teman')} ({friends.length})
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{friends.filter((f) => f.status === 'online').length} online</span>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-2 space-y-1">
            {friends.map((friend) => {
              const isSelected = selectedFriend?.id === friend.id;
              return (
                <div
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/60'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  {/* Avatar with Status badge */}
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/70 text-indigo-700 dark:text-indigo-300 font-bold text-sm flex items-center justify-center border border-indigo-200 dark:border-indigo-800/60">
                      {friend.avatarUrl ? (
                        <img src={friend.avatarUrl} alt={friend.name} className="w-full h-full object-cover" />
                      ) : (
                        friend.initials
                      )}
                    </div>
                    {/* Status dot */}
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                        friend.status === 'online'
                          ? 'bg-emerald-500'
                          : friend.status === 'fokus'
                          ? 'bg-purple-500'
                          : 'bg-slate-400'
                      }`}
                      title={friend.status}
                    />
                  </div>

                  {/* Friend Details */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {friend.name}
                      </h4>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5 shrink-0">
                        <Flame className="w-3 h-3 fill-amber-500" />
                        <span>{friend.streakDays}h</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {friend.currentTaskTitle ? `Sedang: ${friend.currentTaskTitle}` : friend.occupation}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{friend.tasksCompletedToday} tugas tuntas</span>
                      <span>•</span>
                      <span className="capitalize">{friend.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat, Mutual Reminders, Voice, Video & Stickers */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white dark:bg-slate-900">
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                      {selectedFriend.avatarUrl ? (
                        <img src={selectedFriend.avatarUrl} alt={selectedFriend.name} className="w-full h-full object-cover" />
                      ) : (
                        selectedFriend.initials
                      )}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white dark:border-slate-900 ${
                        selectedFriend.status === 'online'
                          ? 'bg-emerald-500'
                          : selectedFriend.status === 'fokus'
                          ? 'bg-purple-500'
                          : 'bg-slate-400'
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {selectedFriend.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">
                      {selectedFriend.occupation} • {selectedFriend.status === 'online' ? 'Aktif sekarang' : selectedFriend.status}
                    </p>
                  </div>
                </div>

                {/* Call & Reminder Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Quick Nudge / Remind Friend */}
                  <div className="relative">
                    <button
                      onClick={() => setShowNudgePicker(!showNudgePicker)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                      title="Ingatkan Teman"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Ingatkan</span>
                    </button>

                    {/* Nudge Menu Popover */}
                    {showNudgePicker && (
                      <div className="absolute right-0 mt-2 w-72 p-2 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in zoom-in-95">
                        <div className="p-2 border-b border-slate-100 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {language === 'English' ? 'Send Quick Nudge to' : 'Kirim Pengingat Cepat ke'} {selectedFriend.name.split(' ')[0]}
                        </div>
                        <div className="space-y-1 mt-1">
                          {quickNudges.map((nudge, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendNudge(nudge)}
                              className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                            >
                              {nudge}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Voice Call Button */}
                  <button
                    onClick={() => setActiveVoiceCall(selectedFriend)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                    title="Panggilan Suara"
                  >
                    <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </button>

                  {/* Video Call Button */}
                  <button
                    onClick={() => setActiveVideoCall(selectedFriend)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                    title="Panggilan Video"
                  >
                    <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Timeline */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
                    <Sparkles className="w-8 h-8 text-indigo-400 mb-2 opacity-60" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Mulai percakapan dengan {selectedFriend.name}
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                      Kirim pesan, stiker penyemangat, atau ingatkan tugas agar sama-sama konsisten mencapai target!
                    </p>
                  </div>
                ) : (
                  currentMessages.map((msg) => {
                    const isMe = msg.sender === 'me';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                      >
                        {/* Text Message */}
                        {msg.type === 'text' && (
                          <div
                            className={`px-4 py-2.5 rounded-2xl max-w-sm text-xs leading-relaxed shadow-xs ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-br-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                            }`}
                          >
                            {msg.content}
                          </div>
                        )}

                        {/* Reminder Nudge Bubble */}
                        {msg.type === 'reminder' && (
                          <div className="p-3 rounded-2xl max-w-sm bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/60 dark:to-slate-800 border border-amber-200 dark:border-amber-800/60 text-xs shadow-xs">
                            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold mb-1">
                              <Bell className="w-3.5 h-3.5" />
                              <span>Pengingat Tugas dari {isMe ? 'Anda' : selectedFriend.name.split(' ')[0]}</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-200 font-medium">{msg.content}</p>
                          </div>
                        )}

                        {/* Voice Note Bubble */}
                        {msg.type === 'voice' && (
                          <div
                            className={`p-3 rounded-2xl flex items-center gap-3 min-w-[200px] shadow-xs ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-br-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                            }`}
                          >
                            <button
                              onClick={() => handlePlayVoice(msg.id)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-105 ${
                                isMe ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'
                              }`}
                            >
                              {playingVoiceId === msg.id ? (
                                <Pause className="w-3.5 h-3.5" />
                              ) : (
                                <Play className="w-3.5 h-3.5 ml-0.5" />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-1 h-4">
                                {[40, 80, 50, 100, 60, 90, 45, 70].map((h, idx) => (
                                  <span
                                    key={idx}
                                    className={`w-1 rounded-full ${
                                      playingVoiceId === msg.id ? 'animate-pulse' : ''
                                    } ${isMe ? 'bg-indigo-200' : 'bg-indigo-400'}`}
                                    style={{ height: `${h}%` }}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] opacity-80 mt-1 block">
                                {msg.voiceDuration || 3} detik
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Sticker Bubble */}
                        {msg.type === 'sticker' && msg.sticker && (
                          <div
                            className="w-32 h-32 rounded-3xl p-3 flex flex-col items-center justify-center text-center shadow-md select-none transform hover:scale-105 transition-transform"
                            style={{
                              backgroundColor: msg.sticker.bgColor || '#4f46e5',
                              color: msg.sticker.textColor || '#ffffff',
                            }}
                          >
                            <span className="text-3xl mb-1">{msg.sticker.emoji}</span>
                            <span className="text-xs font-bold leading-tight">
                              {msg.sticker.title}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider opacity-85 px-2 py-0.5 rounded-full bg-black/15 mt-1">
                              {msg.sticker.tag}
                            </span>
                          </div>
                        )}

                        <span className="text-[10px] text-slate-400 px-1">{msg.timeStr}</span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Sticker Tray Drawer */}
              {showStickerTray && (
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {language === 'English' ? 'Choose Motivational Sticker' : 'Pilih Stiker Penyemangat'}
                    </span>
                    <button
                      onClick={() => setIsStickerCreatorOpen(true)}
                      className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{language === 'English' ? 'Create New Sticker' : 'Buat Stiker Baru'}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1">
                    {stickers.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => handleSendSticker(st)}
                        className="p-2 rounded-2xl flex flex-col items-center justify-center text-center hover:scale-105 transition-all shadow-xs cursor-pointer"
                        style={{ backgroundColor: st.bgColor || '#4f46e5', color: st.textColor || '#ffffff' }}
                      >
                        <span className="text-2xl">{st.emoji}</span>
                        <span className="text-[10px] font-bold truncate max-w-full mt-1">
                          {st.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                {/* Sticker Tray Button */}
                <button
                  onClick={() => setShowStickerTray(!showStickerTray)}
                  className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                    showStickerTray
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={language === 'English' ? 'Stickers' : 'Stiker'}
                >
                  <Smile className="w-4 h-4" />
                </button>

                {/* Voice Note Button */}
                {!isVoiceRecording ? (
                  <button
                    onClick={() => setIsVoiceRecording(true)}
                    className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title={language === 'English' ? 'Record Voice Note' : 'Rekam Pesan Suara'}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    <span>{language === 'English' ? 'Recording:' : 'Merekam:'} 00:0{recordingSeconds}s</span>
                    <button
                      onClick={handleSendVoiceNote}
                      className="px-2 py-0.5 rounded-lg bg-rose-600 text-white text-[10px] font-bold cursor-pointer"
                    >
                      {language === 'English' ? 'Send' : 'Kirim'}
                    </button>
                    <button
                      onClick={() => setIsVoiceRecording(false)}
                      className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Text Input */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendText();
                    }
                  }}
                  placeholder={
                    language === 'English'
                      ? `Type a message to ${selectedFriend.name.split(' ')[0]}...`
                      : `Ketik pesan untuk ${selectedFriend.name.split(' ')[0]}...`
                  }
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />

                {/* Send Button */}
                <button
                  onClick={handleSendText}
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  title="Kirim Pesan"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Pilih teman untuk memulai percakapan.
            </div>
          )}
        </div>
      </div>

      {/* Voice Call Modal */}
      {activeVoiceCall && (
        <VoiceCallModal
          friend={activeVoiceCall}
          isOpen={Boolean(activeVoiceCall)}
          onEndCall={() => setActiveVoiceCall(null)}
        />
      )}

      {/* Video Call Modal */}
      {activeVideoCall && (
        <VideoCallModal
          friend={activeVideoCall}
          isOpen={Boolean(activeVideoCall)}
          onEndCall={() => setActiveVideoCall(null)}
        />
      )}

      {/* Sticker Creator Modal */}
      {isStickerCreatorOpen && (
        <StickerCreatorModal
          isOpen={isStickerCreatorOpen}
          onClose={() => setIsStickerCreatorOpen(false)}
          onSaveSticker={onSaveCustomSticker}
        />
      )}

      {/* Add Friend Modal */}
      {isAddFriendOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddFriendOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Tambah Teman Akuntabilitas
            </h3>
            <form onSubmit={handleCreateFriend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Nama Teman
                </label>
                <input
                  type="text"
                  required
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  placeholder="Contoh: Sarah Angelina"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Pekerjaan / Status
                </label>
                <select
                  value={newFriendOccupation}
                  onChange={(e) => setNewFriendOccupation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Pekerja Kantoran">Pekerja Kantoran</option>
                  <option value="Pelajar">Pelajar</option>
                  <option value="Anak Kuliahan">Anak Kuliahan</option>
                  <option value="Pengajar">Pengajar</option>
                  <option value="Ibu/Bapak Rumah Tangga">Ibu/Bapak Rumah Tangga</option>
                  <option value="Freelancer / Wirausaha">Freelancer / Wirausaha</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddFriendOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  Simpan Teman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
