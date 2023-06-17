import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { OrgConfigInst } from '@core/config/organization.config';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthorizationState } from '../state/authorization.state';

@Injectable({
  providedIn: 'root'
})
export class HrManagerFinanceGuard implements CanActivate, CanLoad {
  constructor(
    private _store: Store
  ) {}

  public isPayroll = this._store.selectSnapshot(AuthorizationState.isPayroll);
  public isHRManager = this._store.selectSnapshot(AuthorizationState.isHRManager)


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isPayroll || this.isHRManager) return true;
    this._store.dispatch(new Navigate([OrgConfigInst.ROUTES_CONFIG.root]))
    return false;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.isPayroll || this.isHRManager) return true;
      this._store.dispatch(new Navigate([OrgConfigInst.ROUTES_CONFIG.root]))
      return 
    }
}
