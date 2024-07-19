import { Component, Inject, model, signal } from '@angular/core';
import { ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatGridList,
    MatGridTile
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  // template: `<h2 mat-dialog-title>Message</h2>
  //            <mat-dialog-content>{{ data.message }}</mat-dialog-content>
  //            <mat-dialog-actions>
  //              <button mat-button [mat-dialog-close]="'close'">Close</button>
  //            </mat-dialog-actions>`
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
