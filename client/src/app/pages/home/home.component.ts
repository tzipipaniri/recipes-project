import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { User } from '../../shared/models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  name: String = 'אורח'
  user?: User

  constructor(private router: Router) {
    // const userString = localStorage.getItem('user');
    // if (userString) {
    //   try {
    //     this.user = JSON.parse(userString);
    //     if (this.user)
    //       this.name = this.user.firstName
    //   } catch (error) {
    //     console.error('Error parsing user data:', error);
    //     // Handle the error gracefully, like setting user to null
    //     // this.user = null;
    //   }
    // }
  }
  ngOnInit(): void {
    console.log('in home user',localStorage.getItem('user'));
    
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        this.user = JSON.parse(userString);
        if (this.user) {
          this.name = this.user.firstName;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Handle the error gracefully, like setting user to null
      }
    }
  }
  navigateToRecipeForm() {
    this.router.navigate(['recipeForm'])
  }

}
