import { Component } from '@angular/core';
import { Logout, NotifyAllOriginContextsToLogout } from '@core/auth/state/auth.actions';
import { Store } from '@ngxs/store';

@Component({
    selector: 'app-logout',
    template: ``
})

export class LogoutComponent {
    constructor(
        private _store: Store,
    ) {

        this._store.dispatch(new Logout);
        this._store.dispatch(new NotifyAllOriginContextsToLogout);

    }
}
