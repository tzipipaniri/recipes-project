import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { delay, filter } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../shared/services/users.service';
import { User } from '../../shared/models/user';
import { WelcomeComponent } from '../welcome/welcome.component';
import { Role } from '../../shared/role';
import { MatGridList, MatGridListModule, MatGridTile } from '@angular/material/grid-list';
import { AuthServiceService } from '../../shared/services/auth-service.service';
// import { MatGridModule } from '@angular/material/grid';
@UntilDestroy() // Add the UntilDestroy decorator

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatSidenavModule,
    // RouterModule,
    // BrowserAnimationsModule,
    // NoopAnimationsModule,
    CommonModule,
    RouterOutlet,
    WelcomeComponent,
    MatGridTile,
    MatGridList,
    MatGridListModule,
    // MatGridModule
    MatToolbarModule

  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  isGuest: boolean = localStorage.getItem('user') == undefined
  isManager: boolean = false

  constructor(private observer: BreakpointObserver, private router: Router, private server: UsersService, private auth: AuthServiceService) {
    console.log("localStorage.getItem('user')", localStorage.getItem('user'));

    const userString = localStorage.getItem('user');
    if (!this.isGuest && userString) {
      const { username, password, role } = JSON.parse(userString)
      this.isManager = role == Role.admin
      this.server.sigin(username, password).subscribe(
        response => {
          const typedResponse: { user: User; token: string } = response as any;
          const user = typedResponse.user;
          const token = typedResponse.token;
          localStorage.setItem('token', token);
          // localStorage.setItem('user', JSON.stringify(user));

        },
        error => {
          console.log('Login error', error);
        }
      );
    }
  }
  // mdbCollapse:String='mdbCollapse'
  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res: any) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });


    this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }
  register() {
    this.router.navigate(['register', '', ''])
  }
  login() {
    this.router.navigate(['/login'])
  }
  allRecipes() {
    this.router.navigate(['/allRecipes']);
  }
  myRecipes() {
    this.router.navigate(['myRecipes']);
  }
  signOut() {
    localStorage.setItem('user', '')
    this.isGuest = true
    this.isManager = false
    this.auth.changeUsername('אורח');
    this.server.logout()
    this.router.navigate(['/']);
    
  }
  addRecipe() {
    this.router.navigate(['/recipeForm/add']);
  }
  users() {
    this.router.navigate(['/users']);
  }
}
