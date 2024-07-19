import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UsersService } from '../services/users.service';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UsersService);

  // const router = inject(Router);
  
  // router.navigateByUrl('login');

  return userService.token ? true : false;
};
// @Injectable()
// export class authGuard implements CanActivate {

 
//   constructor(private userService: UsersService, private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean> | Promise<boolean> | boolean {
//     const isAuthenticated = !!this.userService.token;
//     if (!isAuthenticated) {
//       this.router.navigate(['/login']);
//     }
//     return isAuthenticated;
//   }
// }
