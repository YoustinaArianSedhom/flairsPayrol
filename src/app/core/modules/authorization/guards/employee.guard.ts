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
import { OrgConfigInst } from '@core/config/organization.config';
import { StorageService } from '@core/services/storage/storage.service';

@Injectable({
  providedIn: "root"
})
export class EmployeeGuard implements CanActivate, CanLoad {
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _storage: StorageService) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._protectRoute();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._protectRoute();
  }



  private _protectRoute(): boolean {
    if (this._auth.isEmployee) return true;
    else this._router.navigate([OrgConfigInst.LAND_ROUTE]);
    return false;
  }

}
