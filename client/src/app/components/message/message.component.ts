import { Component } from '@angular/core';
import { MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    MatDialogActions
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  /**
   *
   */
  constructor(public dialogRef: MatDialogRef<MessageComponent>) {
  
  }
  onClose(): void {
    this.dialogRef.close(false);
  }
}
