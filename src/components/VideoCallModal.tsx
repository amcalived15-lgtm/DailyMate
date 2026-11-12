import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Maximize2, Sparkles, User } from 'lucide-react';
import { Friend } from '../types/task';
import { soundService } from '../services/sound';

interface VideoCallModalProps {
  friend: Friend | null;
  isOpen: boolean;
  onEndCall: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  friend,
  isOpen,
  onEndCall,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen || !friend) {
      setSeconds(0);
      return;
    }

    soundService.playReminderChime();
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    // Try initializing camera for self-view
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          mediaStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setCameraActive(true);
        }
      } catch {
        // Fallback gracefully without camera
        setCameraActive(false);
      }
    }

    startCamera();

    return () => {
      clearInterval(interval);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, friend]);

  if (!isOpen || !friend) return null;

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full h-[520px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
        {/* Friend Main Video Frame */}
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
          {friend.avatarUrl ? (
            <div className="relative w-full h-full">
              <img
                src={friend.avatarUrl}
                alt={friend.name}
                className="w-full h-full object-cover filter brightness-75 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/60" />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-indigo-900/60 text-indigo-300 flex items-center justify-center text-4xl font-extrabold border-4 border-indigo-500/40">
              {friend.initials}
            </div>
          )}

          {/* Friend live label */}
          <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{friend.name}</span>
            <span className="text-slate-400 font-mono text-[11px]">• {formatDuration(seconds)}</span>
          </div>
        </div>

        {/* Self PIP Camera View */}
        <div className="absolute top-5 right-5 w-28 h-36 sm:w-36 sm:h-48 rounded-2xl overflow-hidden border-2 border-indigo-500/80 bg-slate-800 shadow-2xl z-20">
          {!isVideoOff && cameraActive ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-2 text-center text-[10px]">
              <User className="w-6 h-6 mb-1 text-slate-500" />
              <span>{isVideoOff ? 'Kamera Mati' : 'Kamera Aktif'}</span>
            </div>
          )}
          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white">
            Anda
          </div>
        </div>

        {/* Top spacer */}
        <div />

        {/* Bottom Control Bar */}
        <div className="relative z-30 p-6 flex items-center justify-center gap-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
          {/* Mute Mic */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition-all ${
              isMuted
                ? 'bg-rose-500/30 border-rose-500 text-rose-400'
                : 'bg-slate-800/90 border-slate-700 text-white hover:bg-slate-700'
            }`}
            title={isMuted ? 'Nyalakan Mikrofon' : 'Bisukan Mikrofon'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Toggle */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3.5 rounded-full border transition-all ${
              isVideoOff
                ? 'bg-rose-500/30 border-rose-500 text-rose-400'
                : 'bg-slate-800/90 border-slate-700 text-white hover:bg-slate-700'
            }`}
            title={isVideoOff ? 'Nyalakan Kamera' : 'Matikan Kamera'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* End Call */}
          <button
            onClick={onEndCall}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-xl shadow-rose-600/40 transition-all cursor-pointer"
            title="Akhiri Panggilan Video"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
