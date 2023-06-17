import { Injectable } from "@angular/core";
import {
  CanLoad,
  Route,
  UrlSegment,
  Router,
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
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
export class CEOGuard implements CanActivate, CanLoad {
  constructor(private _auth: AuthService, private _router: Router, private _store: Store) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this._auth.isCEO) return true;
    this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._auth.isCEO) return true;
    this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
  }
  isAuthorize(): Observable<boolean> {
    return this._store.select(AuthorizationState.isCEO).pipe(
      map( isCEO=> {
        if (isCEO) return true;
        return false;
    }));
  }

}
