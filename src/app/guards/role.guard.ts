import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private tokenService: TokenService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.tokenService.getToken();
    if (!token) {
      this.router.navigate(['/']);
      return false;
    }

    const userRoles = this.tokenService.getAuthorities();
    const expectedRoles = route.data['roles'] as Array<string>;

    if (expectedRoles.some((role) => userRoles.includes(role))) {
      return true;
    } else {
      alert('You do not have permission to access this page.');
      this.router.navigate(['/']);
      return false;
    }
  }
}
