'use client';

import { Mic, Square, RotateCcw, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useState, useRef } from 'react';

interface AudioRecorderProps {
  onRecorded: (blob: Blob) => void;
  maxDuration?: number;
}

export default function AudioRecorder({ onRecorded, maxDuration = 30 }: AudioRecorderProps) {
  const { isRecording, duration, audioBlob, audioUrl, error, startRecording, stopRecording, resetRecording } = useAudioRecorder(maxDuration);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  };

  const handleConfirm = () => {
    if (audioBlob) onRecorded(audioBlob);
  };

  const handleReset = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setIsPlaying(false);
    resetRecording();
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
      <h3 className="font-bold text-white mb-4 flex items-center gap-2">
        <Mic className="w-5 h-5 text-orange-400" /> 录制方言语音（可选）
      </h3>

      {error && (
        <div className="text-red-400 text-sm mb-4 bg-red-500/10 p-3 rounded-lg">{error}</div>
      )}

      {/* 未录制状态 */}
      {!isRecording && !audioUrl && (
        <div className="text-center py-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow"
          >
            <Mic className="w-8 h-8 text-white" />
          </motion.button>
          <p className="text-gray-500 text-sm mt-3">点击开始录音（最长 {maxDuration} 秒）</p>
        </div>
      )}

      {/* 录制中 */}
      {isRecording && (
        <div className="text-center py-6">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mx-auto shadow-lg shadow-red-500/50"
          >
            <div className="w-4 h-4 bg-white rounded-sm" />
          </motion.div>

          {/* 时间进度条 */}
          <div className="mt-4 max-w-xs mx-auto">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-red-400 font-mono">{duration.toFixed(1)}s</span>
              <span className="text-gray-500">{maxDuration}s</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <motion.div
                className="bg-red-500 h-1.5 rounded-full"
                style={{ width: `${(duration / maxDuration) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={stopRecording}
            className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <Square className="w-4 h-4" /> 停止录音
          </button>
        </div>
      )}

      {/* 录制完成 - 预览 */}
      {audioUrl && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={handlePlay}
              className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-0.5" />}
            </button>
            <div className="text-left">
              <p className="text-white font-medium">录制完成</p>
              <p className="text-gray-500 text-sm">{duration.toFixed(1)} 秒</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button onClick={handleReset} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-1">
              <RotateCcw className="w-4 h-4" /> 重录
            </button>
            <button onClick={handleConfirm} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center gap-1">
              ✅ 确认使用
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
