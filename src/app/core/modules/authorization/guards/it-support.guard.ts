import { Injectable } from "@angular/core";
import {
  CanLoad,
  Route,
  UrlSegment,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from '@core/auth/model/auth.service';
import { OrgConfigInst } from "@core/config/organization.config";
import { Store } from '@ngxs/store';
import { AuthorizationState } from "../state/authorization.state";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class isITSupportGuard implements CanLoad {
  constructor(private _authService: AuthService, private _router: Router, private _store: Store) { }
  public isITSupport$ = this._store.select(AuthorizationState.isITSupport)

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this._authService.isITSupport) return true;
    this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if (this._authService.isITSupport) return true;
    this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
  }

  isAuthorize(): Observable<boolean> {
    return this.isITSupport$.pipe(
      map(isITSupport => {
        if (isITSupport) return true;
        return false;
    }));
  }
}
