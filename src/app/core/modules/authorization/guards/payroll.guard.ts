import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OrgConfigInst } from '@core/config/organization.config';
import { Store } from '@ngxs/store';
import { AuthorizationState } from '../state/authorization.state';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PayrollGuard implements CanActivate, CanLoad {
  constructor(
    private _store: Store,
    private _router: Router
  ) { }

  public isPayroll$ = this._store.select(AuthorizationState.isPayroll)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.isPayroll$.pipe(map(isPayroll => {
      if (isPayroll) return true;
      this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
      return false;
    }))
  }


  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.isPayroll$.pipe(map(isPayroll => {
      if (isPayroll) return true;
      this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
      return false;
    }))
  }
  isAuthorize(): Observable<boolean> {
    return this.isPayroll$.pipe(
      map(isPayroll => {
        if (isPayroll) return true;
        return false;
      }));
  }
}
