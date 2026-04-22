import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Terminal, Play, AlertTriangle } from 'lucide-react';
import { NeonPanel } from './NeonPanel';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED_MS } from '../constants';
import { Point } from '../types';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAME_OVER'>('IDLE');
  
  const directionRef = useRef(direction);
  const lastProcessedDirectionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    lastProcessedDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setGameState('PLAYING');
  };

  const gameOver = useCallback(() => {
    setGameState('GAME_OVER');
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const currentDir = lastProcessedDirectionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        
        lastProcessedDirectionRef.current = currentDir;

        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y,
        };

        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          gameOver();
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          gameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 16); // Hex-like scoring
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED_MS);
    return () => clearInterval(gameInterval);
  }, [gameState, food, generateFood, gameOver]);

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.some((segment, index) => index !== 0 && segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;

        let cellClass = 'bg-sys-black border border-sys-cyan/10'; 
        
        if (isSnakeHead) {
          cellClass = 'bg-sys-cyan z-10 relative shadow-[0_0_10px_#00ffff]';
        } else if (isSnakeBody) {
          cellClass = 'bg-sys-cyan/70 border border-sys-cyan';
        } else if (isFood) {
          cellClass = 'bg-sys-magenta animate-blink shadow-[0_0_15px_#ff00ff]';
        }

        cells.push(
          <div key={`${x}-${y}`} className={`w-full h-full ${cellClass}`} />
        );
      }
    }
    return cells;
  };

  return (
    <NeonPanel color="cyan" title="DATA_HARVEST_PROTOCOL" className="flex flex-col h-full relative overflow-hidden">
      {/* Header / Scoreboard */}
      <div className="flex justify-between items-center mb-4 border-b border-sys-cyan/30 pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sys-cyan text-sys-black">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-sys-cyan/70">BYTES_CONSUMED</p>
            <p className="text-3xl font-bold text-sys-cyan leading-none">0x{score.toString(16).toUpperCase().padStart(4, '0')}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-sys-cyan/70">MAX_BUFFER</p>
          <p className="text-2xl font-bold text-sys-cyan/50 leading-none">0x{highScore.toString(16).toUpperCase().padStart(4, '0')}</p>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="flex-grow flex items-center justify-center bg-sys-black border-2 border-sys-cyan p-1 relative">
        
        {/* The Grid */}
        <div 
          className="w-full max-w-[500px] aspect-square grid"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
          }}
        >
          {renderGrid()}
        </div>

        {/* Overlays */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-sys-black/80 flex flex-col items-center justify-center z-20 border-4 border-sys-cyan m-2">
            <h2 
              className="text-5xl font-bold text-sys-cyan mb-4 glitch-text"
              data-text="AWAITING_INPUT"
            >
              AWAITING_INPUT
            </h2>
            <p className="text-sys-magenta mb-8 text-xl animate-pulse">&gt; PRESS TO INITIALIZE PROTOCOL</p>
            <button 
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-4 bg-sys-cyan text-sys-black hover:bg-sys-magenta hover:text-sys-black transition-colors font-bold text-2xl"
            >
              <Play className="w-6 h-6" fill="currentColor" />
              START_SEQUENCE
            </button>
          </div>
        )}

        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-sys-magenta/20 flex flex-col items-center justify-center z-20 border-4 border-sys-magenta m-2 animate-glitch-shift">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,0,255,0.2)_50%)] bg-[length:100%_4px] pointer-events-none" />
            <AlertTriangle className="w-16 h-16 text-sys-magenta mb-4 animate-blink" />
            <h2 
              className="text-5xl font-black text-sys-magenta mb-2 glitch-text text-center"
              data-text="FATAL_EXCEPTION"
            >
              FATAL_EXCEPTION
            </h2>
            <p className="text-sys-black bg-sys-magenta px-4 py-1 mb-8 text-xl font-bold">
              ERR_CODE: COLLISION_DETECTED
            </p>
            <button 
              onClick={startGame}
              className="flex items-center gap-2 px-8 py-4 border-2 border-sys-magenta text-sys-magenta hover:bg-sys-magenta hover:text-sys-black transition-colors font-bold text-2xl relative z-30 bg-sys-black"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}
      </div>
    </NeonPanel>
  );
};
