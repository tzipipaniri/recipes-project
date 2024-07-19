import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UsersService } from '../services/users.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UsersService); // ניתן להזריק את הסרויס רק כך כי אנו לא נמצאים בתוך מחלקה
  const token = userService.token;

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }, // שינוי/הוספת הידר
    });
  }
  return next(req);
};
