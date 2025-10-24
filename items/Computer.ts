import { ItemType } from '../types/Items'
import Item from './Item'

export default class Computer extends Item {
    id?: string
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string,shift:number,isPrelimsQuestion:boolean, questionId: number,frame?: string | number) {
    super(scene, x, y, texture, frame) 
    this.itemType = ItemType.COMPUTER
    this.questionId = questionId;
    this.shift=shift;
    this.isPrelimsQuestion=isPrelimsQuestion
  }
}