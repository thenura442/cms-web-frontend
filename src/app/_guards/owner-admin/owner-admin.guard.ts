import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerAdminGuard implements CanActivate {
  constructor(private router:Router, private authService: AuthService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUser = this.authService.getUser();
      if (currentUser.type == 'admin' || currentUser.type == 'owner') {
          return true;
      }
      // unauthorized access
      this.router.navigate(['/unauthorized']);
      return false;
  }

}
