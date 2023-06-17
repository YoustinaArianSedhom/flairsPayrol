import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { OrgConfigInst } from '@core/config/organization.config';
import { StorageService } from '@core/services/storage/storage.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './model/auth.service';
import { SetReturnUrl } from './state/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _storage: StorageService,
    private _location: Location,
    private _modals: ModalsService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._routeProtectionChecker(state.url)
  }


  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._routeProtectionChecker()
  }

  private _routeProtectionChecker(route?: string): Observable<boolean> {
    return this._authService.canActivateProtectedRoutes$.pipe(
      tap(isAuthorized => {
        if (!isAuthorized) {
          const returnUrl = route ?? this._location.path(); 
          this._fireSetReturnUrl(returnUrl);
          console.info("[Auth Guard] Current User don't have access token, He will be redirected to login page");
          this._router.navigate([OrgConfigInst.ROUTES_CONFIG.login])
          // this._storage.set('targetUrl', this._location.path(), this._storage.SESSION_STORAGE)
          // console.info('[Auth Guard] Access token has been expired and we are working on refreshing them')
          // this._modals.openSuccessDialog('[Auth Guard] Access token has been expired and we are working on refreshing them', 5);
          // setTimeout(() => {
          // if (this._authService.refreshToken) this._fireRefreshToken();
          // else this._router.navigate([OrgConfigInst.ROUTES_CONFIG.login])
          // }, 5000);
        }
      })
    );
  }

  isAuthorize(): Observable<boolean> {
    return this._authService.canActivateProtectedRoutes$.pipe(
      tap(isAuthorized => {
        if (isAuthorized) return true;
        return false;
      }));
  }


  @Dispatch() private _fireSetReturnUrl(returnUrl: string) { return new SetReturnUrl(returnUrl)}
}
