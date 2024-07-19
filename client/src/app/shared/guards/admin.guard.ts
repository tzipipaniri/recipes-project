import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { Role } from '../role';

export const adminGuard: CanActivateFn = (route, state) => {
   const userService = inject(UsersService);
  const router = inject(Router);

  // Check if the user is an admin
  const isAdmin = userService?.role === Role.admin;

  // if (!isAdmin) {
  //   // Redirect to login if the user is not an admin
  //   return router.parseUrl('/login'); // You can change '/login' to the route you want to redirect to
  // }

  return true;
};
