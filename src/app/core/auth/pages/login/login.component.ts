import { Component, OnInit } from '@angular/core';
import { Login } from '@core/auth/state/auth.actions';
import { LayoutService } from '@modules/layout/model/layout.service';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private _store: Store,
    private _layout: LayoutService
  ) { }

  ngOnInit(): void {
  }
  public login() {
    this._store.dispatch(new Login);
    this._layout.setTitle('Login')
  }

}
