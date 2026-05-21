'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  compact?: boolean;
}

export default function AudioPlayer({ src, compact = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.onended = () => { setIsPlaying(false); setProgress(0); };
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      };
    }

    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  };

  if (compact) {
    return (
      <button
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center hover:bg-orange-500/40 transition-colors"
        title="播放语音"
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5 text-orange-400" /> : <Volume2 className="w-3.5 h-3.5 text-orange-400" />}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors flex-shrink-0"
      >
        {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
      </button>
      <div className="flex-1">
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div className="bg-orange-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
