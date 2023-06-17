import { Injectable, Injector } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { combineLatest, forkJoin, from, merge, Observable, of } from 'rxjs';
import { concatMap, first, switchMap, tap, map } from 'rxjs/operators';
import { OrgConfigInst } from '@core/config/organization.config';

@Injectable({
  providedIn: 'root'
})


export class SyncHelperGuard implements CanActivate {
  public constructor(public injector: Injector, private _router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      return combineLatest([
        ...route.data.syncGuards.map(x =>
          // eslint-disable-next-line deprecation/deprecation
          this.injector.get(x).isAuthorize(route, state)
        ),
      ]).pipe(
        map((d) => {
          if (d.includes(true)) {
            return true;
          }
          this._router.navigate([OrgConfigInst.ROUTES_CONFIG.root]);
          return false;
        })
      );
  }
}
