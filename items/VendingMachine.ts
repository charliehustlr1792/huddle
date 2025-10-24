import { ItemType } from '../types/Items'
import Item from './Item'

export default class VendingMachine extends Item {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string,isPrelimsQuestion:boolean, questionId: number,shift:number, frame?: string | number) {
    super(scene, x, y, texture, frame) 
    this.itemType = ItemType.VENDINGMACHINE
    this.questionId = questionId;
    this.shift=shift;
    this.isPrelimsQuestion=isPrelimsQuestion
  }
}