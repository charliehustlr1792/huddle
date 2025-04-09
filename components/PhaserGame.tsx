'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Game } from 'phaser';

// ✅ Store the game instance globally
let gameInstance: Game | null = null;

export const getGameInstance = (): Game | null => {
  return gameInstance;
};

const PhaserGame: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && gameContainerRef.current && typeof window !== "undefined" && !gameInstance) {
      import('phaser').then((Phaser) => {
        // Dynamically import the scene files
        Promise.all([
          import('./Preloader').then(module => module.default),
          import('./Background').then(module => module.default),
          import('./Game').then(module => module.default)
        ]).then(([Preloader, Background,Game]) => {
          const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: gameContainerRef.current,
            backgroundColor: '#93cbee',
            pixelArt: true,
            scale: {
              mode: Phaser.Scale.ScaleModes.RESIZE,
              width: 800,
              height: 600,
            },
            audio: {
              disableWebAudio: true,
            },
            physics: {
              default: 'arcade',
              arcade: {
                gravity: { x: 0, y: 0 },
                debug: false,
              },
            },
            autoFocus: true,
            scene: [Preloader, Background,Game], // Attach dynamically imported scenes
          };

          // ✅ Assign the Phaser game instance globally
          gameInstance = new Phaser.Game(config);
          console.log('Phaser game instance created:', gameInstance);
        });
      });
    }

    // Cleanup when unmounting
    return () => {
      if (gameInstance) {
        gameInstance.destroy(true);
        gameInstance = null;
      }
    };
  }, [isClient]);

  return <div className="w-full h-full" ref={gameContainerRef}></div>;
};

export default PhaserGame;
