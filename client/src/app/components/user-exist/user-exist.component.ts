import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-exist',
  standalone: true,
  imports: [
    MatDialogContent,
    MatIcon,
    MatDialogActions,
    MatGridList,
    MatGridTile
  ],
  templateUrl: './user-exist.component.html',
  styleUrl: './user-exist.component.scss'
})
export class UserExistComponent {
  constructor(public dialogRef: MatDialogRef<UserExistComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
