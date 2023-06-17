import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@core/auth/model/auth.service';
import { OrgConfigInst } from '@core/config/organization.config';
import { Store } from '@ngxs/store';
import { AuthorizationState } from '../state/authorization.state';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LDGuard implements CanActivate, CanLoad {
  constructor(
    private _store: Store,
    private _router: Router
  ) { }

  public isLD$ = this._store.select(AuthorizationState.isLD)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.isLD$.pipe(map(isLD => {
      if (isLD) return true;
      this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
      return false;
    }))
  }


  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.isLD$.pipe(map(isLD => {
      if (isLD) return true;
      this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
      return false;
    }))
  }
  isAuthorize(): Observable<boolean> {
    return this.isLD$.pipe(
      map(isLD => {
        if (isLD) return true;
        return false;
    }));
  }
}
