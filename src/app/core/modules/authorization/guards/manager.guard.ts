import { Injectable } from "@angular/core";
import { CanLoad, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from '@core/auth/model/auth.service';
import { OrgConfigInst } from "@core/config/organization.config";
import { map } from "rxjs/operators";
import { Store } from '@ngxs/store';
import { AuthorizationState } from "../state/authorization.state";

@Injectable({
  providedIn: "root"
})
export class ManagerGuard implements CanActivate, CanLoad {
  constructor(private _router: Router, private _auth: AuthService, private _store: Store) {}

  public isManager$ = this._store.select(AuthorizationState.isManager)


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if (this._auth.isManager) return true;
    this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
  }


  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    if (this._auth.isManager) return true;
    this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
  }

  isAuthorize(): Observable<boolean> {
    return this.isManager$.pipe(
      map(isManager => {
        if (isManager) return true;
        return false;
      }));
  }
}
