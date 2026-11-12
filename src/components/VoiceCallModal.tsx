import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { Friend } from '../types/task';
import { soundService } from '../services/sound';

interface VoiceCallModalProps {
  friend: Friend | null;
  isOpen: boolean;
  onEndCall: () => void;
}

export const VoiceCallModal: React.FC<VoiceCallModalProps> = ({
  friend,
  isOpen,
  onEndCall,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Timer tick
  useEffect(() => {
    if (!isOpen || !friend) {
      setSeconds(0);
      return;
    }
    soundService.playReminderChime();
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, friend]);

  if (!isOpen || !friend) return null;

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-8 shadow-2xl flex flex-col items-center text-center text-white relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Friend Avatar with animated pulsing waves */}
        <div className="relative my-6">
          <div className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping duration-1000" />
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500/80 relative z-10 shadow-xl bg-slate-800 flex items-center justify-center">
            {friend.avatarUrl ? (
              <img src={friend.avatarUrl} alt={friend.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-indigo-300">{friend.initials}</span>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-white">{friend.name}</h3>
        <p className="text-xs text-indigo-400 font-medium mt-1">{friend.occupation}</p>

        {/* Duration badge */}
        <div className="mt-4 px-3 py-1 rounded-full bg-slate-800 border border-slate-700/80 text-xs font-mono text-emerald-400 flex items-center gap-1.5 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{formatDuration(seconds)}</span>
        </div>

        {/* Audio Wave Visualizer Simulation */}
        <div className="flex items-center gap-1.5 my-8 h-8">
          {[40, 75, 100, 60, 90, 50, 80, 100, 65, 45].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-indigo-400 rounded-full animate-pulse"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 100}ms`,
                animationDuration: '800ms',
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition-all ${
              isMuted
                ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Nyalakan Mikrofon' : 'Bisukan Mikrofon'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call */}
          <button
            onClick={onEndCall}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            title="Akhiri Panggilan"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          {/* Speaker */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-3.5 rounded-full border transition-all ${
              !isSpeakerOn
                ? 'bg-slate-800 border-slate-700 text-slate-500'
                : 'bg-indigo-600/30 border-indigo-500 text-indigo-300 hover:bg-indigo-600/40'
            }`}
            title={isSpeakerOn ? 'Matikan Speaker' : 'Nyalakan Speaker'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
