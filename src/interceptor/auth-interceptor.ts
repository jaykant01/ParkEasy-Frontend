import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {Auth} from '../services/auth/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);

  const authToken = authService.getToken();

  if (!authToken) return next(req);

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });

  return next(cloned);
};
