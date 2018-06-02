import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthGuardService implements CanActivate {

  /**
   * Creates an instance of AuthGuardService and injects the services needed
   * @param {AuthService} authService
   * @param {Router} router
   * @memberof AuthGuardService
   */
  constructor(private authService: AuthService, private router: Router) {
  }

  /**
   * Informs router if user is authenticated and can activate the requested component
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<boolean>}
   * @memberof AuthGuardService
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated();
  }
}
