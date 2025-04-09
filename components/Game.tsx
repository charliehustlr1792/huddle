import Phaser from 'phaser'

// import { debugDraw } from '../utils/debug'
import { createCharacterAnims } from '../anims/CharacterAnims'

import Item from '../items/Item'
import Chair from '../items/Chair'
import VendingMachine from '../items/VendingMachine'
import MyPlayer from '../characters/MyPlayer'
import PlayerSelector from '../characters/PlayerSelector'
import { PlayerBehavior } from '../types/PlayerBehavior'
import { NavKeys } from '../types/KeyboardState'
import { phaserEvents, Event } from '../events/EventCenter'
import { setReadyToConnect,updatePlayer } from '@/stores/UserStore'
import store from '@/stores'

export default class Game extends Phaser.Scene {
  private cursors!: NavKeys
  private keyE!: Phaser.Input.Keyboard.Key
  private keyR!: Phaser.Input.Keyboard.Key
  private map!: Phaser.Tilemaps.Tilemap
  private myPlayer!: MyPlayer
  private playerSelector!: Phaser.GameObjects.Zone

  constructor() {
    super('game')
  }
  
  registerKeys() {
    const cursorKeys = this.input.keyboard?.createCursorKeys();
    this.cursors = {
      up: cursorKeys?.up ?? this.input.keyboard!.addKey('W'),
      down: cursorKeys?.down ?? this.input.keyboard!.addKey('S'),
      left: cursorKeys?.left ?? this.input.keyboard!.addKey('A'),
      right: cursorKeys?.right ?? this.input.keyboard!.addKey('D'),
      W: this.input.keyboard!.addKey('W'),
      S: this.input.keyboard!.addKey('S'),
      A: this.input.keyboard!.addKey('A'),
      D: this.input.keyboard!.addKey('D'),
    } as NavKeys;

    // maybe we can have a dedicated method for adding keys if more keys are needed in the future
    this.keyE = this.input.keyboard?.addKey('E') ?? this.input.keyboard!.addKey('E')
    this.keyR = this.input.keyboard?.addKey('R') ?? this.input.keyboard!.addKey('R')
    this.input.keyboard?.disableGlobalCapture()
    
  }

  disableKeys() {
    if (this.input.keyboard) {
      this.input.keyboard.enabled = false
    }
  }

  enableKeys() {
    if (this.input.keyboard) {
        this.input.keyboard.enabled = true
      }
  }

  create() {

    createCharacterAnims(this.anims)

    this.map = this.make.tilemap({ key: 'tilemap' })
    const FloorAndGround = this.map.addTilesetImage('FloorAndGround', 'tiles_wall')
    if (!FloorAndGround) {
      throw new Error("Failed to load tileset 'FloorAndGround'")
    }
    const groundLayer = this.map.createLayer('Ground', FloorAndGround)
    groundLayer?.setCollisionByProperty({ collides: true })
    // debugDraw(groundLayer, this)
    // In your Game.ts file, at the beginning of your create() method
Phaser.GameObjects.GameObjectFactory.register(
  'myPlayer',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    id: string,
    frame?: string | number
  ) {
    const sprite = new MyPlayer(this.scene, x, y, texture, id, frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

    const collisionScale = [0.5, 0.2]
    if(sprite.body)
    sprite.body
      .setSize(sprite.width * collisionScale[0], sprite.height * collisionScale[1])
      .setOffset(
        sprite.width * (1 - collisionScale[0]) * 0.5,
        sprite.height * (1 - collisionScale[1])
      )

    return sprite
  }
)

    const playerId = 'local-player' // In single player mode, we can use a fixed ID
    this.myPlayer = this.add.myPlayer(705, 500, 'adam', playerId)
    this.playerSelector = new PlayerSelector(this, 0, 0, 16, 16)
     if(store.getState().user.readyToConnect)
      this.handleMyPlayerReady()
    const x=store.getState().user.x
    const y=store.getState().user.y
    const anim=store.getState().user.anim
     phaserEvents.on(Event.MY_PLAYER_TEXTURE_CHANGE,()=>{
      this.updatePlayer(x,y,anim)
     },this)

    // import chair objects from Tiled map to Phaser
    const chairs = this.physics.add.staticGroup({ classType: Chair })
    const chairLayer = this.map.getObjectLayer('Chair')
    chairLayer?.objects.forEach((chairObj) => {
      const item = this.addObjectFromTiled(chairs, chairObj, 'chairs', 'chair') as Chair
      // custom properties[0] is the object direction specified in Tiled
      item.itemDirection = chairObj.properties[0].value
    })

     // import computers as static objects (no special class)
     const computers = this.physics.add.staticGroup()
     const computerLayer = this.map.getObjectLayer('Computer')
     computerLayer?.objects.forEach((obj) => {
       const actualX = obj.x! + obj.width! * 0.5
       const actualY = obj.y! - obj.height! * 0.5
       computers
         .get(actualX, actualY, 'computers', obj.gid! - (this.map.getTileset('computer')?.firstgid??0))
         .setDepth(actualY + obj.height! * 0.27)
     })
 
     // import whiteboards as static objects (no special class)
     const whiteboards = this.physics.add.staticGroup()
     const whiteboardLayer = this.map.getObjectLayer('Whiteboard')
     whiteboardLayer?.objects.forEach((obj) => {
       const actualX = obj.x! + obj.width! * 0.5
       const actualY = obj.y! - obj.height! * 0.5
        whiteboards
         .get(
           actualX,
           actualY,
           'whiteboards',
           obj.gid! - (this.map.getTileset('whiteboard')?.firstgid ?? 0)
         )
         .setDepth(actualY)
     })

    // import vending machine objects from Tiled map to Phaser
    const vendingMachines = this.physics.add.staticGroup({ classType: VendingMachine })
    const vendingMachineLayer = this.map.getObjectLayer('VendingMachine')
    vendingMachineLayer?.objects.forEach((obj) => {
      this.addObjectFromTiled(vendingMachines, obj, 'vendingmachines', 'vendingmachine')
    })

    // import other objects from Tiled map to Phaser
    this.addGroupFromTiled('Wall', 'tiles_wall', 'FloorAndGround', false)
    this.addGroupFromTiled('Objects', 'office', 'Modern_Office_Black_Shadow', false)
    this.addGroupFromTiled('ObjectsOnCollide', 'office', 'Modern_Office_Black_Shadow', true)
    this.addGroupFromTiled('GenericObjects', 'generic', 'Generic', false)
    this.addGroupFromTiled('GenericObjectsOnCollide', 'generic', 'Generic', true)
    this.addGroupFromTiled('Basement', 'basement', 'Basement', true)

    this.cameras.main.zoom = 1.5
    this.cameras.main.startFollow(this.myPlayer, true)

    if (groundLayer) {
      this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], groundLayer)
    }
    this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], vendingMachines)

    this.physics.add.overlap(
      this.playerSelector,
      [chairs, computers, whiteboards, vendingMachines],
      (playerSelector, selectionItem) =>
        this.handleItemSelectorOverlap(
          playerSelector as PlayerSelector,
          selectionItem as Item
        ),
      undefined,
      this
    )
    this.myPlayer.setActive(true).setVisible(true)
    if (this.myPlayer.playerContainer) {
      this.myPlayer.playerContainer.setActive(true).setVisible(true)
    }
    
    // Make sure input is enabled
    this.enableKeys()

    // register network event listeners
    store.dispatch(setReadyToConnect(true))
  }

  private handleItemSelectorOverlap(playerSelector: PlayerSelector, selectionItem: Item) {
    const currentItem = playerSelector.selectedItem as Item
    // currentItem is undefined if nothing was perviously selected
    if (currentItem) {
      // if the selection has not changed, do nothing
      if (currentItem === selectionItem || currentItem.depth >= selectionItem.depth) {
        return
      }
      // if selection changes, clear pervious dialog
      if (this.myPlayer.playerBehavior !== PlayerBehavior.SITTING && (currentItem instanceof Chair || currentItem instanceof VendingMachine)) currentItem.clearDialogBox()
    }

    // set selected item and set up new dialog
    playerSelector.selectedItem = selectionItem
    if(selectionItem instanceof Chair || selectionItem instanceof VendingMachine) 
    selectionItem.onOverlapDialog()
  }

  private addObjectFromTiled(
    group: Phaser.Physics.Arcade.StaticGroup,
    object: Phaser.Types.Tilemaps.TiledObject,
    key: string,
    tilesetName: string
  ) {
    const actualX = object.x! + object.width! * 0.5
    const actualY = object.y! - object.height! * 0.5
    const obj = group
      .get(actualX, actualY, key, object.gid! - (this.map.getTileset(tilesetName)?.firstgid??0))
      .setDepth(actualY)
    return obj
  }

  private addGroupFromTiled(
    objectLayerName: string,
    key: string,
    tilesetName: string,
    collidable: boolean
  ) {
    const group = this.physics.add.staticGroup()
    const objectLayer = this.map.getObjectLayer(objectLayerName)
    objectLayer?.objects.forEach((object) => {
      const actualX = object.x! + object.width! * 0.5
      const actualY = object.y! - object.height! * 0.5
      group
        .get(actualX, actualY, key, object.gid! - (this.map.getTileset(tilesetName)?.firstgid??0))
        .setDepth(actualY)
    })
    if (this.myPlayer && collidable)
      this.physics.add.collider([this.myPlayer, this.myPlayer.playerContainer], group)
  }

  updatePlayer(currentX: number, currentY: number, currentAnim: string) {
    store.dispatch(updatePlayer({
      x: currentX,
      y: currentY,
      anim: currentAnim || null
    }))
    return 
  }
  handleMyPlayerReady() {
    const name=store.getState().user.playerName;
    console.log(name)
    const playerTexture=store.getState().user.playerTexture;
    console.log(playerTexture)
    this.myPlayer.setPlayerName(name);
    this.myPlayer.setPlayerTexture(playerTexture);
  }
  
  update(/* t: number, dt: number */) {
    if (this.myPlayer) {
      this.playerSelector.update(this.myPlayer, this.cursors)
      this.myPlayer.update(this.playerSelector, this.cursors, this.keyE, this.keyR)
    }
  }
}
