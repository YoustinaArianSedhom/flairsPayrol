import { Injectable } from "@angular/core";
import { CanLoad, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from '@core/auth/model/auth.service';
import { OrgConfigInst } from "@core/config/organization.config";
import { Store } from "@ngxs/store";
import { AuthorizationState } from "../state/authorization.state";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class HRManagerGuard implements CanActivate, CanLoad {
  constructor(private _router: Router, private _auth: AuthService, private _store:Store) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if (this._auth.isHRManager) return true;
    this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
  }


  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    if (this._auth.isHRManager) return true;
    this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
  }
  isAuthorize(): Observable<boolean> {
    return this._store.select(AuthorizationState.isHRManager).pipe(
      map( isHRManager=> {
        if (isHRManager) return true;
        return false;
    }));
  }
}
