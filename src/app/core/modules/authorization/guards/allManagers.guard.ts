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

@Injectable({
  providedIn: "root"
})
export class allManagersGuard implements CanActivate, CanLoad {
  constructor(private _auth: AuthService, private _router: Router) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this._auth.isBusinessPartner || 
        this._auth.isHRManager || this._auth.isPayrollManager || this._auth.isITSupport) return true;
    this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._auth.isBusinessPartner) return true;
    this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
  }

}
