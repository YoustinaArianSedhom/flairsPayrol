import { Component, OnInit, OnDestroy } from '@angular/core';
import { Logout } from '@core/auth/state/auth.actions';
import { OrgConfigInst } from '@core/config/organization.config';
import { ProfileModel, UserModel } from '@core/modules/user/model/user.model';
import { UserState } from '@core/modules/user/state/user.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { environment } from '@environments/environment';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetMyProfileDetails } from '@core/modules/user/state/user.actions';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.scss']
})
export class UserNavComponent implements OnInit, OnDestroy  {

  public isProduction = environment.isProd;
  public profilePic:string;
  private _prfileSub;
  constructor(
    private _modals:ModalsService
  ) { }
  public isOpened = false;

  @ViewSelectSnapshot(UserState.user) public loggedInUser: UserModel;
  @Select(UserState.myProfile) public myProfile$: Observable<ProfileModel>

  
  public confirmLogout() {
    this.isOpened=!this.isOpened
    this._modals.openConfirmationDialog({
      title: OrgConfigInst.CRUD_CONFIG.actions.logout,
      class: 'danger',
      content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.logout(),
      proceedText: OrgConfigInst.CRUD_CONFIG.actions.logout,
      cancelText: OrgConfigInst.CRUD_CONFIG.actions.cancel
    }, () => this._fireLogoutAction())

  
  }
  
  ngOnInit(): void {
    this.fireMyProfileDetails()
    this._prfileSub = this.myProfile$.subscribe(
      (data:ProfileModel) =>{  
        if(data){
          this.profilePic = data.profileImageLink
        }        
      }
    )
  }
  ngOnDestroy(): void {
    this._prfileSub.unsubscribe();
  }
  @Dispatch() public fireMyProfileDetails() {
    return new GetMyProfileDetails()
  }
  @Dispatch() private _fireLogoutAction() {
    return new Logout()
  }

}
