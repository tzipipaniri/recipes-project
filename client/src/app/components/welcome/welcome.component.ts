import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { User } from '../../shared/models/user';
import { Router } from '@angular/router';
import { UsersService } from '../../shared/services/users.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../shared/services/auth-service.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    // BrowserModule,
    CommonModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  name: String = 'אורח'
  user?: User

  constructor(private router: Router, private userService: UsersService,private auth:AuthServiceService) {
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
  // ngOnInit(): void {
  //   console.log('in home user', localStorage.getItem('user'));

  //   const userString = localStorage.getItem('user');
  //   if (userString) {
  //     try {
  //       this.user = JSON.parse(userString);
  //       if (this.user) {
  //         this.name = this.user.firstName;
  //       }
  //     } catch (error) {
  //       console.error('Error parsing user data:', error);
  //       // Handle the error gracefully, like setting user to null
  //     }
  //   }
  // }
  ngOnInit(): void {
    this.auth.currentUsername.subscribe(username => {
      this.name = username;
    });

    const userString = localStorage.getItem('user');
    if (userString) {

      try {
        const user = JSON.parse(userString);
        if (user) {
          console.log('user',user.firstName);
          
          this.auth.changeUsername(user.firstName);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  getName() {
    console.log('in home user', localStorage.getItem('user'));

    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        this.user = JSON.parse(userString);
        if (this.user) {
          this.name = this.user.firstName;
          return this.name
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Handle the error gracefully, like setting user to null
      }
    }
    return null
  }
  // ngOnDestroy(): void {
  //   this.userService.userChange.unsubscribe(); // Unsubscribe on component destroy
  // }


  navigateToRecipeForm() {
    this.router.navigate(['recipeForm'])
  }
}
