import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DaoService } from '../dao/dao.service';

@Injectable()
export class UserResolverService /*implements Resolve<User>*/ {

  constructor(private authService: AuthService, private dao: DaoService) {}

  // resolve(route: ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<User> {
  //   return this.dao.user(this.authService.currentFirebaseUser.uid)
  // }
}
