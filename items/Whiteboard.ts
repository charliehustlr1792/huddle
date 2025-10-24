import { ItemType } from '../types/Items'
import Item from './Item'

export default class Whiteboard extends Item {
    id?: string
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string,isPrelimsQuestion:boolean, questionId: number ,shift:number, frame?: string | number) {
    super(scene, x, y, texture, frame) 
    this.itemType = ItemType.WHITEBOARD
    this.questionId = questionId;
    this.shift=shift;
    this.isPrelimsQuestion=isPrelimsQuestion
  }
}