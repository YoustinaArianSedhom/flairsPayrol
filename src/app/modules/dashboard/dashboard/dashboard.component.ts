import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetMyOrganization } from '@core/modules/organization/state/organization.actions';
import { OrganizationState } from '@core/modules/organization/state/organization.state';
import { UserModel } from '@core/modules/user/model/user.model';
import { UserState } from '@core/modules/user/state/user.state';
import { StorageService } from '@core/services/storage/storage.service';
import { environment } from '@environments/environment';
import { LayoutService } from '@modules/layout/model/layout.service';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  public organization: any;
  public environment : any;
  @Select(OrganizationState.org) public myOrganization$: Observable<string[]>;
  @ViewSelectSnapshot(UserState.user) public user: UserModel;


  constructor(
    private _store: Store,
    private _layoutService: LayoutService,
    private _router: Router,
    private _storage: StorageService
  ) { }

  ngOnInit(): void {
    if (this._storage.get('returnURL', this._storage.SESSION_STORAGE)) {
      this._router.navigate([this._storage.get('returnURL', this._storage.SESSION_STORAGE)])
      this._storage.remove('returnURL', this._storage.SESSION_STORAGE)
    }

    this.environment = environment;


    this.myOrganization$.subscribe(res => {
      if (res) this.organization = res
      else this._store.dispatch(new GetMyOrganization())
    })
    this._layoutService.setTitle('Home')


    
    
  }



}
