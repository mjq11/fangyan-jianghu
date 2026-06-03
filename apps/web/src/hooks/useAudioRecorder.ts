import { useState, useRef, useCallback } from 'react';

export interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;       // 秒
  audioBlob: Blob | null;
  audioUrl: string | null;
  error: string | null;
}

export function useAudioRecorder(maxDuration = 30) {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false, isPaused: false, duration: 0,
    audioBlob: null, audioUrl: null, error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus' : 'audio/webm',
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setState(s => ({ ...s, isRecording: false, audioBlob: blob, audioUrl: url }));
        stream.getTracks().forEach(t => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mediaRecorder.start(100);
      startTimeRef.current = Date.now();

      setState({ isRecording: true, isPaused: false, duration: 0, audioBlob: null, audioUrl: null, error: null });

      // 计时器
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setState(s => ({ ...s, duration: elapsed }));
        if (elapsed >= maxDuration) {
          mediaRecorder.stop();
        }
      }, 100);
    } catch (err) {
      setState(s => ({ ...s, error: '无法获取麦克风权限，请在浏览器设置中允许' }));
    }
  }, [maxDuration]);

  const stopRecording = useCallback(() => {
    // 立即清除计时器，停止读秒
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const resetRecording = useCallback(() => {
    if (state.audioUrl) URL.revokeObjectURL(state.audioUrl);
    setState({ isRecording: false, isPaused: false, duration: 0, audioBlob: null, audioUrl: null, error: null });
  }, [state.audioUrl]);

  return { ...state, startRecording, stopRecording, resetRecording };
}
