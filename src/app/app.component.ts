import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@core/auth/model/auth.service';
import { CacheLastDispatchedAction } from '@core/auth/state/auth.actions';
import { OrgConfigInst } from '@core/config/organization.config';
import { HideSpinner } from '@core/modules/spinner/state/spinner.actions';
import { CustomIconsService } from '@core/services/custom-icons/custom-icons.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Actions, Store } from '@ngxs/store';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'payroll';


  constructor(
    private _customIconService: CustomIconsService,
    private _router: Router,
    private _location: Location,
    private _authService: AuthService,
    private _actions: Actions,
    private _store: Store
  ) {

    this._authService.runInitialLoginSequence();
  }


  ngOnInit(): void {
    // this._authService.kickingAuthFlowAndNeededSetups();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._customIconService.init();
    this._cacheActions();

    // Trying to skip the origin url and back again
    this._router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.hideLoader();
        const url = this._location.path();
        const suspendedUrls = ['/', '/index.html', '', '/auth/auto-login'];
        if (suspendedUrls.includes(url)) this._location.forward();
      });
  }



  private _cacheActions() {
    this._actions
      .subscribe(({ action, status, error }: { action: object, status: string, error: HttpErrorResponse }) => {
        if (error) {
          if ( status == 'ERRORED' && error.status == OrgConfigInst.CRUD_CONFIG.errorsTypes.notAuthenticated) {
            this._store.dispatch(new CacheLastDispatchedAction(action))
          }
        }
      });

  }


  @Dispatch() public hideLoader() { return new HideSpinner }


}
