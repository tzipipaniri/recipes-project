import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatCard, MatCardActions, MatCardAvatar, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NavbarComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatCardAvatar
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  /**
   *
   */
  users:User[]=[]
  constructor(private router: Router, private server: UsersService) {
    server.getUsers().subscribe(
      data=>{
        this.users=data
      }
    )
  }
}
