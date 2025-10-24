'use client';
import { Scene } from "phaser";
import { BackgroundMode } from "@/types/BackgroundMode";
import store from "@/stores";
import { setReadyToConnect } from "@/stores/UserStore";
export default class Preloader extends Scene {
  private preloadComplete = false
  constructor() {
    super('preloader')
  }
  preload() {
    this.load.atlas(
      'cloud_day',
      'assets/background/cloud_day.png',
      'assets/background/cloud_day.json'
    )
    this.load.image('cypherlogo_black', 'assets/cypher/Cypher_inverted.png')
    this.load.image('backdrop_day', 'assets/background/backdrop_day.png')
    this.load.atlas(
      'cloud_night',
      'assets/background/cloud_night.png',
      'assets/background/cloud_night.json'
    )
    this.load.image('cypherlogo_white', 'assets/cypher/Cypher.png')
    this.load.image('backdrop_night', 'assets/background/backdrop_night.png')
    this.load.image('sun_moon', 'assets/background/sun_moon.png')


    this.load.tilemapTiledJSON('tilemap', 'assets/map/map.json')
    this.load.spritesheet('tiles_wall', 'assets/map/FloorAndGround.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('chairs', 'assets/items/chair.png', {
      frameWidth: 32,
      frameHeight: 64,
    })
    this.load.spritesheet('computers', 'assets/items/computer.png', {
      frameWidth: 96,
      frameHeight: 64,
    })
    this.load.spritesheet('whiteboards', 'assets/items/whiteboard.png', {
      frameWidth: 64,
      frameHeight: 64,
    })
    this.load.spritesheet('vendingmachines', 'assets/items/vendingmachine.png', {
      frameWidth: 48,
      frameHeight: 72,
    })
    this.load.spritesheet('office', 'assets/tileset/Modern_Office_Black_Shadow.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('basement', 'assets/tileset/Basement.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('generic', 'assets/tileset/Generic.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.spritesheet('adam', 'assets/character/adam.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
    this.load.spritesheet('ash', 'assets/character/ash.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
    this.load.spritesheet('lucy', 'assets/character/lucy.png', {
      frameWidth: 32,
      frameHeight: 48,
    })
    this.load.spritesheet('nancy', 'assets/character/nancy.png', {
      frameWidth: 32,
      frameHeight: 48,
    })

    this.load.audio('correct','assets/sounds/correctanswer.mp3')
    this.load.audio('wrong','assets/sounds/wronganswer.mp3')
    this.load.audio('win','assets/sounds/win.wav')
    this.load.on('complete', () => {
      this.preloadComplete = true
      this.launchBackground(store.getState().user.backgroundMode)
      if (store.getState().user.loggedIn) {
        this.launchGame();
      }
    })
  }
  launchGame() {
    if (!this.preloadComplete) return;
    
    
    // Make sure the game scene is not already running
    if (!this.scene.isActive('game')) {
      this.scene.launch('game');
      
      // Make game scene visible and active
      this.scene.bringToTop('game');
      
      // Hide the background scene or adjust its visibility as needed
      // this.scene.sendToBack('background');
      
      // update Redux state
      store.dispatch(setReadyToConnect(true));
    }
  }
  private launchBackground(backgroundMode: BackgroundMode) {
    this.scene.launch('background', { backgroundMode })
  }
  changeBackgroundMode(backgroundMode: BackgroundMode) {
    this.scene.stop('background')
    this.launchBackground(backgroundMode)
  }
  update() {
    // Check if user is logged in but game isn't started yet
    if (store.getState().user.readyToConnect && this.preloadComplete && !this.scene.isActive('game')) {
      this.launchGame();
    }
  }
}