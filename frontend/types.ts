export interface Point {
  x: number;
  y: number;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: number; // in seconds
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
