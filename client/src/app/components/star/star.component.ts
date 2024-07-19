import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-star',
  standalone: true,
  template: `
  <mat-icon>star</mat-icon>
`,
  imports: [
    MatIcon
  ],
  templateUrl: './star.component.html',
  styleUrl: './star.component.scss'
})
export class StarComponent {

}
