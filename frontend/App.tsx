import React from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

const App: React.FC = () => {
  return (
    <div className="crt min-h-screen bg-sys-black text-sys-cyan relative overflow-hidden flex items-center justify-center p-4 sm:p-8 selection:bg-sys-magenta selection:text-sys-black">
      
      {/* Static Noise Background */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none mix-blend-screen animate-noise" />
      
      {/* Scanline Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-4 bg-sys-cyan/10 animate-scanline shadow-[0_0_20px_rgba(0,255,255,0.2)]" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative z-10 h-[90vh] min-h-[600px]">
        
        {/* Left Column: Music Player */}
        <div className="lg:col-span-4 xl:col-span-3 h-full order-2 lg:order-1">
          <MusicPlayer />
        </div>

        {/* Right Column: Snake Game */}
        <div className="lg:col-span-8 xl:col-span-9 h-full order-1 lg:order-2">
          <SnakeGame />
        </div>

      </div>
    </div>
  );
};

export default App;
