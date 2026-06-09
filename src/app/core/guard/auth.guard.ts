import { Injectable, inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageService } from '@shared/services';
import { User } from '@core/models/interface';
import { Role } from '@core/models/role';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private router = inject(Router);
  private store = inject(LocalStorageService);

  canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    const currentUser = this.store.get('currentUser') as User;
    if (currentUser && currentUser.roles && currentUser.roles.length > 0) {
      const userRoles = currentUser.roles.map(r => r.name);

      // SUPERADMIN has access to everything
      if (userRoles.includes(Role.SuperAdmin)) {
        return true;
      }

      // Check if the route requires a specific role
      if (route.data['role'] && !userRoles.includes(route.data['role'])) {
        this.router.navigate(['/authentication/signin']);
        return false;
      }

      return true;
    }

    this.router.navigate(['/authentication/signin']);
    return false;
  }
}
