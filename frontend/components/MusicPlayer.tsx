import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Terminal } from 'lucide-react';
import { TRACKS } from '../constants';
import { NeonPanel } from './NeonPanel';

interface MusicPlayerProps {
  onTrackChange?: (trackName: string) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onTrackChange }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentTrack = TRACKS[currentTrackIndex];

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack.duration, handleNext]);

  useEffect(() => {
    if (onTrackChange) {
      onTrackChange(currentTrack.title);
    }
  }, [currentTrackIndex, onTrackChange, currentTrack.title]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (progress / currentTrack.duration) * 100;

  return (
    <NeonPanel color="magenta" title="AUDIO_SUBSYSTEM" className="flex flex-col h-full justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-sys-magenta/30 pb-2">
        <h2 className="text-xl font-bold text-sys-magenta tracking-widest flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          <span className={isPlaying ? 'animate-pulse' : ''}>
            {isPlaying ? 'STREAMING...' : 'IDLE'}
          </span>
        </h2>
        <div className="flex gap-1 h-4 items-end">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-2 bg-sys-magenta transition-all duration-75 ${isPlaying ? 'animate-glitch-shift' : 'h-1'}`}
              style={{ 
                height: isPlaying ? `${Math.random() * 100}%` : '20%',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Album Art & Info */}
      <div className="flex flex-col items-center mb-8 relative">
        <div className={`
          relative w-full aspect-square max-w-[200px] mb-6 border-2 border-sys-magenta 
          overflow-hidden group ${isPlaying ? 'animate-noise' : ''}
        `}>
          <img 
            src={currentTrack.coverUrl} 
            alt="Data Block" 
            className={`w-full h-full object-cover mix-blend-luminosity opacity-80 ${isPlaying ? 'scale-105' : 'scale-100'} transition-transform`}
          />
          <div className="absolute inset-0 bg-sys-magenta/20 mix-blend-overlay" />
          {/* Scanline over image */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,0,255,0.2)_50%)] bg-[length:100%_4px] pointer-events-none" />
        </div>
        
        <div className="text-center w-full px-2">
          <h3 
            className="text-2xl font-bold text-sys-cyan truncate mb-1 glitch-text" 
            data-text={currentTrack.title}
          >
            {currentTrack.title}
          </h3>
          <p className="text-sys-magenta text-sm truncate">
            &gt; {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Controls & Progress */}
      <div className="w-full mt-auto border-t border-sys-magenta/30 pt-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-sys-magenta mb-1">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
          <div className="h-4 w-full bg-sys-black border border-sys-magenta relative overflow-hidden">
            <div 
              className="h-full bg-sys-magenta transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            />
            {/* Grid overlay on progress bar */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.5)_1px,transparent_1px)] bg-[length:10px_100%]" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={handlePrev}
            className="flex-1 py-2 border border-sys-magenta text-sys-magenta hover:bg-sys-magenta hover:text-sys-black transition-colors flex justify-center"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="flex-[2] py-2 bg-sys-magenta text-sys-black font-bold text-xl hover:bg-sys-cyan hover:text-sys-black transition-colors flex justify-center items-center gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-6 h-6" fill="currentColor" />
                HALT
              </>
            ) : (
              <>
                <Play className="w-6 h-6" fill="currentColor" />
                EXECUTE
              </>
            )}
          </button>
          
          <button 
            onClick={handleNext}
            className="flex-1 py-2 border border-sys-magenta text-sys-magenta hover:bg-sys-magenta hover:text-sys-black transition-colors flex justify-center"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
      </div>
    </NeonPanel>
  );
};
