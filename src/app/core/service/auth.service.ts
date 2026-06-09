import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { User, LoginResponse } from '@core/models/interface';
import { LocalStorageService } from '@shared/services';
import { TokenService } from './token.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenService = inject(TokenService);
  private loginService = inject(LoginService);
  private store = inject(LocalStorageService);

  currentUser = signal<User>(this.store.get('currentUser') as User || {} as User);
  currentUser$ = toObservable(this.currentUser);

  private change$ = this.currentUser$;

  change() {
    return this.change$;
  }

  login(username: string, password: string, rememberMe = false) {
    return this.loginService.login(username, password, rememberMe).pipe(
      tap((response: LoginResponse) => {
        // Store tokens
        this.tokenService.set({
          access_token: response.accessToken,
          token_type: 'Bearer',
          refresh_token: response.refreshToken,
        });

        // Store user data
        const user = response.user;
        this.store.set('currentUser', user);
        this.currentUser.set(user);

        // Store role names
        const roleNames = user.roles?.map((role) => role.name) || [];
        this.store.set('roleNames', JSON.stringify(roleNames));

        // Store permissions
        const permissions = user.roles?.flatMap((role) => role.permissions) || [];
        this.tokenService.permissionArray = permissions;
      })
    );
  }

  logout() {
    return this.loginService.logout().pipe(
      tap(() => {
        this.store.clear();
        this.currentUser.set({} as User);
      }),
      catchError(() => {
        this.store.clear();
        this.currentUser.set({} as User);
        return of({ message: 'Logged out locally' });
      })
    );
  }

  refreshToken() {
    const token = this.tokenService.getRefreshToken();
    if (!token) return of(null);
    return this.loginService.refresh(token as string).pipe(
      tap((response: LoginResponse) => {
        this.tokenService.set({
          access_token: response.accessToken,
          token_type: 'Bearer',
          refresh_token: response.refreshToken,
        });
        this.store.set('currentUser', response.user);
        this.currentUser.set(response.user);
      }),
      catchError(() => {
        this.store.clear();
        return of(null);
      })
    );
  }

  assignUser(): Observable<User> {
    const user = this.store.get('currentUser') as User || {} as User;
    this.currentUser.set(user);
    return of(user);
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.roles?.some((r) => r.name === role) || false;
  }

  isSuperAdmin(): boolean {
    return this.hasRole('SUPERADMIN');
  }
}
