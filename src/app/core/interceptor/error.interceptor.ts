import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { TokenService } from '../service/token.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.includes('/auth/')) {
        // Try to refresh the token
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((response: any) => {
              isRefreshing = false;
              if (response) {
                const newToken = tokenService.getBearerToken();
                refreshTokenSubject.next(newToken);
                return next(req.clone({
                  setHeaders: { Authorization: newToken }
                }));
              }
              authService.logout().subscribe();
              location.reload();
              return throwError(() => err);
            }),
            catchError((refreshErr) => {
              isRefreshing = false;
              authService.logout().subscribe();
              location.reload();
              return throwError(() => refreshErr);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(token => {
              return next(req.clone({
                setHeaders: { Authorization: token }
              }));
            })
          );
        }
      }

      const error = err.error?.message || err.statusText;
      return throwError(() => error);
    })
  );
};
