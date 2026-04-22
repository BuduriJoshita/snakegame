import { Track, Point } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION: Point = { x: 0, y: -1 }; // Moving UP
export const GAME_SPEED_MS = 100; // Slightly faster for a more aggressive feel

export const TRACKS: Track[] = [
  {
    id: 'trk_0x01',
    title: 'SECTOR_01_SCAN',
    artist: 'SYS.ADMIN // ROOT',
    coverUrl: 'https://picsum.photos/seed/glitch1/400/400?grayscale',
    duration: 215,
  },
  {
    id: 'trk_0x02',
    title: 'MEMORY_LEAK_DETECTED',
    artist: 'NULL_POINTER_EXCEPTION',
    coverUrl: 'https://picsum.photos/seed/glitch2/400/400?grayscale',
    duration: 184,
  },
  {
    id: 'trk_0x03',
    title: 'BUFFER_OVERFLOW',
    artist: 'DAEMON_PROCESS',
    coverUrl: 'https://picsum.photos/seed/glitch3/400/400?grayscale',
    duration: 240,
  }
];
