import { Component } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';

@Component({
  selector: 'app-delete-recipe-dialog',
  standalone: true,
  imports: [
    MatGridList,
    MatGridTile,
    MatDialogContent
  ],
  templateUrl: './delete-recipe-dialog.component.html',
  styleUrl: './delete-recipe-dialog.component.scss'
})
export class DeleteRecipeDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteRecipeDialogComponent>) {}

  onDelete(): void {
    
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
