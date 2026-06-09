import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../service/token.service';
import { environment } from 'environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const tokenService = inject(TokenService);
  const token = tokenService.getBearerToken();

  // Only add token for API requests (not external APIs like AI services)
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register') || req.url.includes('/auth/refresh');

  if (token && isApiRequest && !isAuthRequest) {
    req = req.clone({
      setHeaders: {
        Authorization: token,
      },
    });
  }

  return next(req);
};
