import Phaser from 'phaser'
import { ItemType } from '../types/Items'
import QuestionAnswerForm from "@/components/QuestionAnswerForm"
import { createRoot } from 'react-dom/client'

export default class Item extends Phaser.Physics.Arcade.Sprite {
  private dialogBox!: Phaser.GameObjects.Container
  private statusBox!: Phaser.GameObjects.Container
  formOpen: boolean;
  itemType!: ItemType
  private completed: boolean = false;
  questionId?: number;
  isPrelimsQuestion: boolean = false;
  shift: number = 1; // Default to shift 1
  questionLevel: number = 0; // Level in the question sequence (1-4)
  private accessible: boolean = false; // Whether this question is currently accessible
  private onCompleteCallback?: () => void; // Callback when question is completed

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
    // add dialogBox and statusBox containers on top of everything which we can add text in later
    this.dialogBox = this.scene.add.container().setDepth(10000)
    this.statusBox = this.scene.add.container().setDepth(10000)
    this.formOpen = false;
  }

  // add texts into dialog box container
  setDialogBox(text: string) {
    this.clearDialogBox();
    const innerText = this.scene.add
      .text(0, 0, text)
      .setFontFamily('Arial')
      .setFontSize(12)
      .setColor('#000000')

    // set dialogBox slightly larger than the text in it
    const dialogBoxWidth = innerText.width + 4
    const dialogBoxHeight = innerText.height + 2
    const dialogBoxX = this.x - dialogBoxWidth * 0.5
    const dialogBoxY = this.y + this.height * 0.5

    this.dialogBox.add(
      this.scene.add
        .graphics()
        .fillStyle(0xffffff, 1)
        .fillRoundedRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight, 3)
        .lineStyle(1.5, 0x000000, 1)
        .strokeRoundedRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight, 3)
    )
    this.dialogBox.add(innerText.setPosition(dialogBoxX + 2, dialogBoxY))
  }

  // remove everything in the dialog box container
  clearDialogBox() {
    this.dialogBox.removeAll(true)
  }

  openForm() {
    if (this.formOpen || this.completed || !this.questionId) return;

    if (!this.accessible) return;
    
    this.formOpen = true;
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    
    root.render(
      <QuestionAnswerForm 
        position={{ x: window.innerWidth / 2, y: window.innerHeight / 2 }} 
        root={root} 
        item={this} 
        questionId={this.questionId}
        isPrelimsQuestion={this.isPrelimsQuestion}
        shift={this.shift}
        questionLevel={this.questionLevel}
      />
    );
  }

  // Set this item as completed
  setCompleted(value: boolean) {
    this.completed = value;

    if (value) {
      this.setStatusBox('Completed ✓');
      if (this.onCompleteCallback) {
        this.onCompleteCallback();
      }
    }
  }

  isCompleted(): boolean {
    return this.completed;
  }

  // add text into status box container
  setStatusBox(text: string) {
    this.clearStatusBox();
    const innerText = this.scene.add
      .text(0, 0, text)
      .setFontFamily('Arial')
      .setFontSize(12)
      .setColor('#000000')

    // set dialogBox slightly larger than the text in it
    const statusBoxWidth = innerText.width + 4
    const statusBoxHeight = innerText.height + 2
    const statusBoxX = this.x - statusBoxWidth * 0.5
    const statusBoxY = this.y - this.height * 0.25
    this.statusBox.add(
      this.scene.add
        .graphics()
        .fillStyle(0xffffff, 1)
        .fillRoundedRect(statusBoxX, statusBoxY, statusBoxWidth, statusBoxHeight, 3)
        .lineStyle(1.5, 0x000000, 1)
        .strokeRoundedRect(statusBoxX, statusBoxY, statusBoxWidth, statusBoxHeight, 3)
    )
    this.statusBox.add(innerText.setPosition(statusBoxX + 2, statusBoxY))
  }

  // remove everything in the status box container
  clearStatusBox() {
    this.statusBox.removeAll(true)
  }
  
  // Add a hasQuestion method to check if this item has an assigned question
  hasQuestion(): boolean {
    return this.questionId !== undefined && this.questionId !== null;
  }

  // Set callback for when question is completed
  setOnCompleteCallback(callback: () => void) {
    this.onCompleteCallback = callback;
  }

  // Explicitly set accessibility
  setAccessible(accessible: boolean) {
    this.accessible = accessible;
    // If dialogue is currently shown, update it to reflect new accessibility
    if (this.dialogBox.getAll().length > 0) {
      this.onOverlapDialog();
    }
  }
  
  // Check if the question is accessible
  isAccessible(): boolean {
    return this.accessible;
  }

  onOverlapDialog() {
    if (this.isCompleted()) {
      this.setDialogBox('Already completed!');
    }else if(!this.accessible){
      this.setDialogBox('Oops,nothing to see here!')
    } else {
      this.setDialogBox('Press R to interact!');
    }
  }
}