import { Component } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [
    MatGridListModule,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrl: './delete-confirmation-dialog.component.scss'
})
export class DeleteConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
